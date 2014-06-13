var path = require('path');
var mkdirp = require('mkdirp');
var nodeSpriteGenerator = require('node-sprite-generator');
var brocWriter = require('broccoli-writer');

var BroccoliSprite = function BroccoliSprite(inTree, options) {
  if (!(this instanceof BroccoliSprite)) {
    return new BroccoliSprite(inTree, options);
  }
  this.inTree = inTree;
  options = options || {};
  this.options = {};

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this.options[key] = options[key];
    }
  }
};

BroccoliSprite.prototype = Object.create(brocWriter.prototype);
BroccoliSprite.prototype.constructor = BroccoliSprite;
BroccoliSprite.prototype.description = 'sprite';
BroccoliSprite.prototype.debugLog = function() {
  if (this.options.debug) {
    console.log.apply(this, arguments);
  }
};
BroccoliSprite.prototype.write = function(readTree, destDir) {
  var self = this;
  return readTree(this.inTree).then(function (srcDir) {
    var files = self.options.src || [];
    var spritePath = path.join(destDir, self.options.spritePath);
    var stylesheetPath = path.join(destDir, self.options.stylesheetPath);
    mkdirp.sync(path.dirname(spritePath));
    mkdirp.sync(path.dirname(stylesheetPath));
    var nsgOptions = self.options;
    nsgOptions.src = files;
    nsgOptions.spritePath = spritePath;
    nsgOptions.stylesheetPath = stylesheetPath;
    self.debugLog('nsgOptions', nsgOptions);
    nodeSpriteGenerator(nsgOptions, function (err) {
        if (!err) {
          self.debugLog('Sprite generated!');
        }
        else {
          console.log('Sprite generation failed:', err);
        }
        self.debugLog('spritePath', spritePath);
        self.debugLog('stylesheetPath', stylesheetPath);
    });
  });
};

module.exports = BroccoliSprite;
