function emberCliStylesOverride(app, preprocessors) {

    console.log('EmberCliStylesOverride', arguments);
    if (!app.options.sprite) {
        return;
    }
    if (!preprocessors) {
        console.log('must have preprocessors');
    }
    this.app = app;

    var memoize = require('lodash-node/modern/functions').memoize;
    var pickFiles = require('broccoli-static-compiler');
    var mergeTrees = require('broccoli-merge-trees');
    var concatFiles = require('broccoli-concat');
    var broccoliSprite = require('./index.js');

    var preprocessCss = preprocessors.preprocessCss;
    var preprocessMinifyCss = preprocessors.preprocessMinifyCss;

    // //Disable fingerprinting for generated sprite
    // //TODO submit patch to node-sprite-generator to do fingerprinting in house
    // if (app.options.fingerprint && app.options.fingerprint.enabled) {
    //     app.options.fingerprint.exclude = app.options.fingerprint.exclude || [];
    //     app.options.fingerprint.exclude.push(app.options.sprite.spritePath);
    // }

    app.styles = memoize(function() {
        console.log('app.styles extended for sprites');
        var vendor = this._processedVendorTree();
        var styles = pickFiles(this.trees.styles, {
            srcDir: '/',
            destDir: '/app/styles'
        });

        var stylesAndVendor = mergeTrees([
            vendor,
            styles
        ], {
            description: 'TreeMerger (stylesAndVendor)'
        });

        var processedStyles = preprocessCss(stylesAndVendor, '/app/styles', '/assets');
        var vendorStyles = concatFiles(stylesAndVendor, {
            inputFiles: this.vendorStaticStyles,
            outputFile: '/assets/vendor.css',
            description: 'concatFiles - vendorStyles'
        });

        var spriteTree, spriteImageOnlyTree;

        var appCssFile = 'assets/' + this.options.name + '.css';
        console.log('appCssFile', appCssFile);

        spriteTree = broccoliSprite('public', this.options.sprite);
        var processedStylesAndSpritesTree = mergeTrees([processedStyles, spriteTree], {
            description: 'mergeTrees - tmp processed styles and sprites',
        });
        processedStyles = concatFiles(processedStylesAndSpritesTree, {
            inputFiles: [
                this.options.sprite.stylesheetPath,
                appCssFile,
            ],
            outputFile: '/' + appCssFile,
            description: 'concatFiles - sprites and styles CSS only',
        });

        spriteImageOnlyTree = pickFiles(spriteTree, {
            srcDir: '/',
            destDir: '/',
            files: ['**/*.png'],
            description: 'pickFiles - sprite image only',
        });

        if (this.env === 'production' && this.options.minifyCSS.enabled === true) {
            var options = this.options.minifyCSS.options || {};
            processedStyles = preprocessMinifyCss(processedStyles, options);
            vendorStyles = preprocessMinifyCss(vendorStyles, options);
        }

        if (spriteImageOnlyTree) {
            //NOTE important to merge these in *after* preprocessMinifyCss
            processedStyles = mergeTrees([
                processedStyles,
                spriteImageOnlyTree
            ], {
                description: 'mergeTrees - processed styles with sprite image',
            });
        }

        return mergeTrees([
            processedStyles,
            vendorStyles
        ], {
            description: 'styles'
        });
    });
}

module.exports = emberCliStylesOverride;
