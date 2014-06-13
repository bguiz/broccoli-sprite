# A broccoli plugin for sprite generation

## tl;dr

- Inputs:
    - A list of image files
- Outputs:
    - An image sprite sheet
    - A CSS (support different varieties) file

## Usage

        var broccoliSprite = require('broccoli-sprite');
        var spritesTree = broccoliSprite('public', {
          src: [
            'public/images/sprites/*.png'
          ],
          spritePath: 'assets/sprites.png',
          stylesheetPath: 'assets/sprites.css',
          stylesheet: 'css',
          stylesheetOptions: {
            prefix: 'sprite-',
          },
        });

## Licence

GPLv3
