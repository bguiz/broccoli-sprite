# A BroccoliJs plugin for sprite generation

Use this plugin in a project built using
[BroccoliJs](https://github.com/broccolijs/broccoli) to add CSS image sprites to it.
Includes instructions for how to integrate into an
[ember-cli](https://github.com/bguiz/broccoli-sprite) also included,
and [direct support is planned](#time-line).

[![broccoli-sprite NPM](https://nodei.co/npm/broccoli-sprite.png?compact=true)](https://github.com/bguiz/broccoli-sprite)

    npm install --save broccoli-sprite

### Installation dependencies

You will need to install at least one of the following,
before installing `broccoli-sprite`.

- GraphicsMagick
  - On Ubuntu:
    - `sudo apt-get install graphicsmagick`
  - On Windows:
    - [Instructions here](http://www.graphicsmagick.org/INSTALL-windows.html)
- [node canvas](https://github.com/LearnBoost/node-canvas/wiki "node canvas installation instructions")
  - Ensure that you have NodeJs version is v0.10.29 (>= v0.11.x will not work)
  - On Ubuntu:
    - `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
    - `npm install -g canvas`

## Usage

In `Brocfile.js`, add the following:

    var broccoliSprite = require('broccoli-sprite');
    var spritesTree = broccoliSprite('public', {
      src: [ 'public/images/sprites/*.png' ],
      spritePath: 'assets/sprites.png',
      stylesheetPath: 'assets/sprites.css',
      stylesheet: 'css',
      stylesheetOptions: {
        prefix: 'sprite-',
      },
    });

&hellip; and be sure to merge `spritesTree` into the main tree.

### Usage in `ember-cli` apps

To use `broccoli-sprite` in an [`ember-cli`](https://github.com/stefanpenner/ember-cli) app:

#### Option #1 - Registry Plugin

Ideally, the plugin *should be* integrated into the registry found in
`node_modules/ember-cli/lib/preprocessors.js`.
However, this is not currently possible.
See [time line](#time-line) for more details.

In the mean time see *Option #1* and *Option #2* for workaround that you can use now.

#### Option #2 - Least Intrusive

In this method, we extend `EmberApp` to add an additional `sprite` tree
to the app tree.
This method requires minimal modifications to `Brocfile.js`,
but the drawback of this approach is that `index.html` needs to reference two
separate CSS files.

In `Brocfile.js`:

    var EmberApp = require('ember-cli/lib/broccoli/ember-app');
    var broccoliSprite = require('broccoli-sprite');

    EmberApp.prototype.sprites = function() {
      var spritesTree = broccoliSprite('public', this.options.sprite);
      return spritesTree;
    };
    var originalEmberAppToArray = EmberApp.prototype.toArray;
    EmberApp.prototype.toArray = function() {
      var sourceTrees = originalEmberAppToArray.apply(this, arguments);
      sourceTrees.push(this.sprites());
      return sourceTrees;
    };

    var app = new EmberApp({
      /* ... */
      sprite: {
        src: [ 'public/images/sprites/*.png' ],
        spritePath: 'assets/sprites.png',
        stylesheetPath: 'assets/sprites.css',
        stylesheet: 'css',
        stylesheetOptions: {
          prefix: 'sprite-',
        },
      },
    });

In `app/index.html`:

Include an additional CSS file.

    <link rel="stylesheet" href="assets/sprites.css">

#### Option #3 - Single CSS File

What we do here is extend `EmberApp` to override the `styles` method.
This method requires quite a lot to be added to `Brocfile.js`,
but it also means that `index.html` needs to reference just one CSS file.

In `Brocfile.js`:

    var memoize = require('lodash-node/modern/functions').memoize;
    var pickFiles = require('broccoli-static-compiler');
    var mergeTrees = require('broccoli-merge-trees');
    var concatFiles = require('broccoli-concat');
    var preprocessors = require('ember-cli/lib/preprocessors');
    var preprocessCss = preprocessors.preprocessCss;
    var preprocessMinifyCss = preprocessors.preprocessMinifyCss;

    EmberApp.prototype.styles = memoize(function() {
      console.log('EmberApp.prototype.styles extended');
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
      var vendorStyles    = concatFiles(stylesAndVendor, {
        inputFiles: this.vendorStaticStyles,
        outputFile: '/assets/vendor.css',
        description: 'concatFiles - vendorStyles'
      });
      var spriteTree, spriteImageOnlyTree;
      if (this.options.sprite) {
        var appCssFile = 'assets/'+this.options.name+'.css';
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
          outputFile: '/'+appCssFile,
          description: 'concatFiles - sprites and styles CSS only',
        });
        spriteImageOnlyTree = pickFiles(spriteTree, {
          srcDir: '/',
          destDir: '/',
          files: ['**/*.png'],
          description: 'pickFiles - sprite image only',
        });
      }
      if (this.env === 'production' && this.options.minifyCSS.enabled === true) {
        var options = this.options.minifyCSS.options || {};
        processedStyles = preprocessMinifyCss(processedStyles, options);
        vendorStyles    = preprocessMinifyCss(vendorStyles, options);
      }
      if (spriteImageOnlyTree) {
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

## Configuration Options

`broccoli-sprite` wraps around the excellent
[`node-sprite-generator`](https://github.com/selaux/node-sprite-generator)
library.

When you call `broccoliSprite`, it accepts two arguments: `tree` and `options`.

### `tree`

This is any broccoli tree.
In an `ember-cli` app, this would most likely be `'public'`.

### `options`

These options are passed into `node-sprite-generator`,
so [follow the options specified here](https://github.com/selaux/node-sprite-generator#options "node-sprite-generator options").

There are a few things to note though:

`src` is the full path, not the path within the tree.
Notice that in the example above,
the tree is `'public'`, and "public" is repeated in the path within `src`.

The same is **not** true for output paths though,
`spritePath` and `stylesheetPath`,
which must be specified relative to the tree.
Notice that "public" is not repeated within these paths.

## Time Line

- [x] Make work with live-reload
- [ ] Make it work as an ember-cli registry plugin, so that there is no need to extend `EmberApp` in `Brocfile.js`
  - [ ] Dependent on ember-cli release where plugin registry is exposed. See [this issue](https://github.com/stefanpenner/ember-cli/issues/810),
    - Reference example: [ember-cli-esnext](https://github.com/rjackson/ember-cli-esnext/blob/master/index.js)
- [x] Integrate into `EmberApp.styles()` such that CSS for sprites is concatenated and minifed together with CSS of app
  - [x] Generated sprite images exported into `style` tree
  - [ ] Works in conjunction with registry plugin system, so that there is no need to extend `EmberApp` in `Brocfile.js`

## Licence

[GPL v3](http://opensource.org/licenses/GPL-3.0)
