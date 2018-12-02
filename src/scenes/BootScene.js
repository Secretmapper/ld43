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

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('TitleScene')
    })

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
    this.load.image('radar', 'assets/images/radar.png')
    this.load.image('hunt', 'assets/images/hunt.png')
    this.load.image('tile_bg', 'assets/images/tile_bg.png')
  }
}

export default BootScene
