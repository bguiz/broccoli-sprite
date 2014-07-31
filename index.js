var path = require('path');
var mkdirp = require('mkdirp');
var nodeSpriteGenerator = require('node-sprite-generator');
var brocWriter = require('broccoli-writer');
var rsvp = require('rsvp');

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
  self.debugLog('Running BroccoliSprite');

  return readTree(this.inTree).then(function (srcDir) {
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
    // stylesheet can be a function which is lost in JSON.stringify
    nsgOptions.stylesheet = self.options.stylesheet;
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
            resolvePromise(true);
          }
          else {
            console.log('Sprite generation failed:', err);
            rejectPromise(err);
          }
      });
    });
    return promise;
  });
};

module.exports = BroccoliSprite;
