import 'phaser'
import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'
import TitleScene from './scenes/TitleScene'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

const config = {
  // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  backgroundColor: '#f3cca3',
  width: 800,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  plugins: {
    global: [ NineSlicePlugin.DefaultCfg ],
  },
  scene: [BootScene, TitleScene, GameScene]
}

const game = new Phaser.Game(config) // eslint-disable-line no-unused-vars
