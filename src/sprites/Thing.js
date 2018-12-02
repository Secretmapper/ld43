
export default class Thing extends Phaser.GameObjects.Sprite {
  constructor ({ scene }) {
    super(scene, 0, 0, 'thing')

    this.setScale(6)

    const container = scene.add.container(400, -140)
    container.add(this)
    container.setDepth(scene.depths.thing)
    this.shadow = this.scene.add.sprite(400, 300, 'shadow')
    this.shadow.setScale(8)
    this.shadow.setDepth(scene.depths.thingShadow)
    this.container = container

    this.msg = new Msg(this.scene, 0, 0)
    this.scene.add.existing(this.msg)

    this.scene.tweens.add({
      targets: container,
      props: {
        y: {
          value: "-=10",
          duration: 250,
        },
      },
      loop: -1,
      repeat: true,
      yoyo: true,
      ease: 'Sine.easeInOut'
    })

    this.bloodParticles = this.scene.add.particles('blood')
    this.bloodParticles.setDepth(this.scene.depths.blood)
    this.sfx = {
      bite: this.scene.sound.add('monsterBite'),
      growl: this.scene.sound.add('monsterGrowl'),
    }
  }

  update () {
    this.shadow.setScale(
      10 * ((-this.container.y-10) / -120)
      - (3 * (this.y / 240))
    )
  }

  comeDown (back = true) {
    this.msg.show(back)
    this.scene.tweens.add({
      targets: this,
      y: 240,
      duration: 200,
      ease: 'Bounce.easeOut',
      onComplete: () => {
        if (back) {
          this.comeUp()
        }
      }
    })
  }

  comeUp () {
    this.scene.tweens.add({
      targets: this,
      y: 0,
      delay: 500,
      duration: 200,
      ease: 'Bounce.easeOut'
    })
  }

  biteOff () {
    this.msg.setText('not satiated!')
    this.comeDown(false)
    this.sfx.bite.play()
    this.sfx.growl.play()
    this.bloodParticles.createEmitter({
      x: this.scene.player.x,
      y: this.scene.player.y,
      speed: { min: -100, max: 500 },
      gravityY: 50,
      scale: { start: 0.4, end: 0.1 },
      lifespan: 800,
    })
    this.bloodParticles.createEmitter({
      x: this.shadow.x,
      y: this.shadow.y - 50,
      speed: { min: -100, max: 500 },
      gravityY: 50,
      lifespan: 800,
    })

    this.resMsg = this.scene.add.text(
      400,
      300,
      'Press R to restart',
      { font: '20px Kremlin', fill: 'white', stroke: '#000', strokeThickness: 5 }
    )
    this.resMsg.setDepth(this.scene.depths.ui)
    this.resMsg.x = 400 - this.resMsg.width / 2
  }
}

class Msg extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, 0, 0)

    this.msg = scene.add.text(
      400,
      200,
      'Satiated!',
      { font: '80px Kremlin', fill: 'white', stroke: '#000', strokeThickness: 10 }
    )
    this.msg.x = 400 - this.msg.width / 2

    this.setDepth(this.scene.depths.ui)

    this.add(this.msg)
    this.alpha = 0
  }

  setText (msg) {
    this.msg.setText(msg)
    this.msg.x = 400 - this.msg.width / 2
  }

  show (back = true) {
    this.scene.tweens.add({
      targets: this,
      props: {
        alpha: 1
      },
      duration: 300,
      ease: 'Sine.easeIn',
      onComplete: back ? this.hide : null,
      onCompleteScope: this
    })
  }

  hide () {
    this.scene.tweens.add({
      targets: this,
      props: {
        alpha: 0
      },
      delay: 1000,
      duration: 300,
      ease: 'Sine.easeIn'
    })
  }
}
