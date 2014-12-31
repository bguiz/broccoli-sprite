var path = require('path');
var mkdirp = require('mkdirp');
var svgSprite = require('svg-sprite');
var brocCachingWriter  = require('broccoli-caching-writer');
var rsvp = require('rsvp');

var BroccoliVectorSprite = function BroccoliVectorSprite(inTree, options) {
  if (!(this instanceof BroccoliVectorSprite)) {
    return new BroccoliVectorSprite(inTree, options);
  }
  this.inputTree = inTree;
  options = options || {};
  this.options = {};

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this.options[key] = options[key];
    }
  }
  this.debugLog('Running BroccoliVectorSprite');
};

//Using broccoli caching writer to avoid recompiling the sprite sheets each time
BroccoliVectorSprite.prototype = Object.create(brocCachingWriter.prototype);
BroccoliVectorSprite.prototype.constructor = BroccoliVectorSprite;
BroccoliVectorSprite.prototype.description = 'sprite';
BroccoliVectorSprite.prototype.debugLog = function() {
  if (this.options.debug) {
    console.log.apply(null, arguments);
  }
};

BroccoliVectorSprite.prototype.updateCache = function(srcDir, destDir) {
  var self = this;
  self.debugLog('Running BroccoliVectorSprite updateCache');

  // var files = (self.options.src || []).map(function(file) {
  //   return srcDir+'/'+file;
  // });
  // self.debugLog('inputImageDir', inputImageDir);
  // self.debugLog('outputCssDir', outputCssDir);
  // self.debugLog('files', files);
  var svgSpriteOptions = JSON.parse(JSON.stringify(self.options)); //lazy way to deep clone

  //TODO do steps to prepare for svg-sprite
  //e.g. mkdir required folders within destDir, or parse/modify certain options

  self.debugLog('Options: ', svgSpriteOptions);
  var promise = new rsvp.Promise(function(resolvePromise, rejectPromise) {
    svgSprite.createSprite(
      svgSpriteOptions.inputDir, 
      svgSpriteOptions.outputDir, 
      svgSpriteOptions, 
      function (err, results) {
        if (err) {
          self.debugLog('Sprite generation failed:', err);
          return rejectPromise(err);
        }
        self.debugLog('Sprite generated!');
        resolvePromise(destDir);
    });
  });
  return promise;
};

module.exports = BroccoliVectorSprite;
