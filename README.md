# A BroccoliJs plugin for sprite generation

Use this plugin in a project built using
[BroccoliJs](https://github.com/broccolijs/broccoli) to add
[CSS image sprites](http://css-tricks.com/css-sprites/) to it.
Includes instructions for how to integrate into an
[ember-cli](https://github.com/bguiz/broccoli-sprite) also included,
and [direct support is planned](#time-line).

Supported stylesheet formats: SCSS, SASS, LESS, Stylus, CSS

[![broccoli-sprite NPM](https://nodei.co/npm/broccoli-sprite.png?compact=true)](https://github.com/bguiz/broccoli-sprite)

    npm install --save broccoli-sprite

### Installation dependencies

You may optionally install one of the following (before installing `broccoli-sprite`)

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
        spritePath: '/assets/sprites.png',
      },
      optiping: (process.env.NODE_ENV === 'production'),
    });

&hellip; and be sure to merge `spritesTree` into the main tree.

Note that it is important to specify `stylesheetOptions.spritePath`,
as otherwise a relative path will be used,
and this will not work with fingerprinting,
which is enabled by default in when building with `environment=production`.

### Usage in `ember-cli` apps

It used to be rather complicated, but now ember-cli's addon/ plugin system
has more features, and thus it is really as simple as `npm install`ing a module.

You will, however, need to install a different package:
[ember-sprite](https://github.com/bguiz/ember-sprite).
Look for a one-liner installation instruction there!

## Configuration Options

`broccoli-sprite` wraps around the excellent
[`node-sprite-generator`](https://github.com/selaux/node-sprite-generator)
library.

When you call `broccoliSprite`, it accepts two arguments: `tree` and `options`.

### `tree`

This is any broccoli tree.
In an `ember-cli` app, this would most likely be `'public'`.

### `options`

These options are passed into `node-sprite-generator`, so
[follow the options specified here](https://github.com/selaux/node-sprite-generator#options "node-sprite-generator options").
You may also pass in `optiping`, which is read by
[broccoli-sprite](https://github.com/bguiz/broccoli-sprite).
If `true`, then [optiping](http://optipng.sourceforge.net)
compression will be applied to the generated sprites.
This adds considerable build time,
but can drastically reduce your sprite file size.

There are a few things to note:

`src` is the full path, not the path within the tree.
Notice that in the example above,
the tree is `'public'`, and "public" is repeated in the path within `src`.

The same is **not** true for output paths though,
`spritePath` and `stylesheetPath`,
which must be specified relative to the tree.
Notice that "public" is not repeated within these paths.

## Contributors

Maintained by [bguiz](http://github.com/bguiz).

Additional contributions from:

- [Connorhd](http://github.com/Connorhd)
- [harianus](http://github.com/harianus)
- [filippovdaniil](https://github.com/filippovdaniil)
- [jmonster](http://github.com/jmonster)
- [Dhaulagiri](https://github.com/Dhaulagiri)

## Licence

[GPL v3](http://opensource.org/licenses/GPL-3.0)
