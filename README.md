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
        spritePath: '/assets/sprites.png',
      },
    });

&hellip; and be sure to merge `spritesTree` into the main tree.

Note that it is important to specify `stylesheetOptions.spritePath`,
as otherwise a relative path will be used,
and this will not work with fingerprinting,
which is enabled by default in when building with `environment=production`.

### Usage in `ember-cli` apps

It used to be rather complicated, but now ember-cli's addon/ plugin system
has more features, and thus it is really as simple as `npm install`ing a module.

You will, however, need to install a different package: [ember-sprite](https://github.com/bguiz/ember-sprite).
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
- [x] Make it work as an ember-cli registry plugin, so that there is no need to extend `EmberApp` in `Brocfile.js`
  - [x] Dependent on ember-cli release where plugin registry is exposed. See [this issue](https://github.com/stefanpenner/ember-cli/issues/810),
    - Reference example: [ember-cli-esnext](https://github.com/rjackson/ember-cli-esnext/blob/master/index.js)
    - Landed with [ember-sprite](https://github.com/bguiz/ember-sprite)
- [x] Integrate into `EmberApp.styles()` such that CSS for sprites is concatenated and minifed together with CSS of app
  - [x] Generated sprite images exported into `style` tree
  - [x] Works in conjunction with registry plugin system, so that there is no need to extend `EmberApp` in `Brocfile.js`
    - Landed with [ember-sprite](https://github.com/bguiz/ember-sprite)

## Contributors

Maintained by [bguiz](http://github.com/bguiz).

Additional contributions from:

- [Connorhd](http://github.com/Connorhd)
- [harianus](http://github.com/harianus)

## Licence

[GPL v3](http://opensource.org/licenses/GPL-3.0)
