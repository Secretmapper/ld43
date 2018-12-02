
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
  }

  update () {
    this.shadow.setScale(
      10 * ((-this.container.y-10) / -120)
      - (3 * (this.y / 240))
    )
  }

  comeDown () {
    this.scene.tweens.add({
      targets: this,
      delay: 1000,
      y: 240,
      duration: 200,
      ease: 'Bounce.easeOut',
      onComplete: () => {
        this.comeUp()
      }
    })
  }

  comeUp () {
    this.scene.tweens.add({
      targets: this,
      delay: 1000,
      y: 0,
      duration: 200,
      ease: 'Bounce.easeOut'
    })
  }
}
