var path = require('path');
var mkdirp = require('mkdirp');
var nodeSpriteGenerator = require('node-sprite-generator');
var brocCachingWriter  = require('broccoli-caching-writer');
var rsvp = require('rsvp');

var BroccoliSprite = function BroccoliSprite(inTree, options) {
  if (!(this instanceof BroccoliSprite)) {
    return new BroccoliSprite(inTree, options);
  }
  this.inputTree = inTree;
  options = options || {};
  this.options = {};

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this.options[key] = options[key];
    }
  }
};

//Using broccoli caching writer to avoid recompiling the sprite sheets each time
BroccoliSprite.prototype = Object.create(brocCachingWriter.prototype);
BroccoliSprite.prototype.constructor = BroccoliSprite;
BroccoliSprite.prototype.description = 'sprite';
BroccoliSprite.prototype.debugLog = function() {
  if (this.options.debug) {
    console.log.apply(null, arguments);
  }
};

BroccoliSprite.prototype.updateCache = function(srcDir, destDir) {
  var self = this;
  self.debugLog('Running BroccoliSprite updateCache');

  var files = (self.options.src || []).map(function(file) {
    return srcDir+'/'+file;
  });
  self.debugLog('srcDir', srcDir);
  self.debugLog('destDir', destDir);
  self.debugLog('files', files);
  var spritePath = path.join(destDir, self.options.spritePath);
  var stylesheetPath = path.join(destDir, self.options.stylesheetPath);
  mkdirp.sync(path.dirname(spritePath));
  mkdirp.sync(path.dirname(stylesheetPath));
  var nsgOptions = JSON.parse(JSON.stringify(self.options)); //lazy way to deep clone
  nsgOptions.src = files;
  nsgOptions.spritePath = spritePath;
  nsgOptions.stylesheetPath = stylesheetPath;
  self.debugLog('Options: ', nsgOptions);
  self.debugLog('spritePath', spritePath);
  self.debugLog('stylesheetPath', stylesheetPath);
  var promise = new rsvp.Promise(function(resolvePromise, rejectPromise) {
    nodeSpriteGenerator(nsgOptions, function (err) {
        if (!err) {
          self.debugLog('Sprite generated!');
          resolvePromise(destDir);
        }
        else {
          self.debugLog('Sprite generation failed:', err);
          rejectPromise(err);
        }
    });
  });
  return promise;
};

module.exports = BroccoliSprite;
