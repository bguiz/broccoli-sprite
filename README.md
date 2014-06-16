# A broccoli plugin for sprite generation

## tl;dr

- Inputs:
    - A list of image files
- Outputs:
    - An image sprite sheet
    - A CSS (support different varieties) file

## Installation

In your project directory, run this command:

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
      src: [
        'images/sprites/*.png'
      ],
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

    var app = new EmberApp(/* ... */);
    /* other ember-cli init for app */
    var broccoliSprite = require('broccoli-sprite');
    var spritesTree = broccoliSprite(/* ... */);
    var appTree = app.toTree();
    var broccoliMergeTrees = require('broccoli-merge-trees');
    module.exports = broccoliMergeTrees([spritesTree, appTree]);

Ideally, however, the plugin *should be* integrated into
`node_modules/ember-cli/lib/preprocessors.js`.
However, currently, [this is not possible](https://github.com/stefanpenner/ember-cli/issues/810),
until this `preprocessors.js` exposes its registry of BroccoliJs plugins.

## Configuration Options

`broccoli-sprite` wraps around the excellent
[`node-sprite-generator`](https://github.com/selaux/node-sprite-generator)
library.

When you call `broccoliSprite`, it accepts two arguments: `tree` and `options`.

### `tree`

This is any broccoli tree.
In an `ember-cli` app, this would most likely be `"public"`.

### `options`

These options are passed into `node-sprite-generator`,
so [follow the options specified here](https://github.com/selaux/node-sprite-generator#options "node-sprite-generator options").

File paths, however, are not passed in verabtim,
and are processed to enable them to work with BroccoliJs' trees.

`src` is is an array of file paths specified relative to the input tree.
Notice that in the example above,
the tree is `'public'`, and "public" is **not** repeated in the paths within `src`.

The same is also true for output paths though,
`spritePath` and `stylesheetPath`,
which must be specified relative to the tree.
Notice that "public" is not repeated within these paths.

## Licence

[GPL v3](http://opensource.org/licenses/GPL-3.0)
