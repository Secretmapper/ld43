var WebFont = require('webfontloader')

class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    const progress = this.add.graphics()

    // Register a load progress event to show a load bar
    this.load.on('progress', value => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60
      )
    })
    WebFont.load({
      custom: {
        families: [ 'Kremlin' ]
      },
      active: () => {
        this.add.text(32, 32, '', { fontFamily: 'Kremlin', fontSize: 80, color: '#ff0000' }).setShadow(2, 2, "#333333", 2, false, true)
      }
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('TitleScene')
    })

    this.load.audio('theme', ['assets/ld43.ogg', 'assets/ld43.mp3'])
    this.load.audio('dispenser_sfx', ['assets/audio/dispenser.ogg', 'assets/audio/dispenser.mp3'])
    this.load.audio('aye_sfx', ['assets/audio/sfx/aye.ogg', 'assets/audio/sfx/aye.mp3'])
    this.load.audio('ok_sfx', ['assets/audio/sfx/ok.ogg', 'assets/audio/sfx/ok.mp3'])
    this.load.audio('where_sfx', ['assets/audio/sfx/where.ogg', 'assets/audio/sfx/where.mp3'])
    this.load.audio('monsterGrowl', ['assets/audio/sfx/monsterGrowl.ogg', 'assets/audio/sfx/monsterGrowl.mp3'])
    this.load.audio('monsterBite', ['assets/audio/sfx/monsterBite.ogg', 'assets/audio/sfx/monsterBite.mp3'])

    this.load.image('blood', 'assets/images/blood.png');
    this.load.image('player', 'assets/images/player.png')
    this.load.image('elder', 'assets/images/elder.png')
    this.load.image('table', 'assets/images/table.png')
    this.load.image('paste_dispenser', 'assets/images/paste_dispenser.png')

    this.load.image('tile', 'assets/images/tile.png')
    this.load.image('loading', 'assets/images/loading.png')
    this.load.image('picker', 'assets/images/picker.png')
    this.load.spritesheet('package', 'assets/images/package.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('bubble', 'assets/images/bubble.png', {
      frameWidth: 16,
      frameHeight: 16
    })
    this.load.image('antistress', 'assets/images/antistress.png')
    this.load.image('beaconpart', 'assets/images/beaconpart.png')
    this.load.image('radar', 'assets/images/radar.png')
    this.load.image('hunt', 'assets/images/hunt.png')
    this.load.image('tile_bg', 'assets/images/tile_bg.png')
    this.load.image('thing', 'assets/images/thing.png')
    this.load.image('shadow', 'assets/images/shadow.png')
  }
}

export default BootScene
