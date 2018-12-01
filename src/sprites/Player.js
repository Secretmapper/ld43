const SPEED = 160

class Player extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, 'player')
    config.scene.physics.world.enable(this)

    this.followers = []
    this.controls = config.controls
  }

  update () {
    const { cursors, action } = this.controls

    this.body.setVelocity(0)

    if (cursors.left.isDown) {
      this.body.setVelocityX(-SPEED)
    }
    else if (cursors.right.isDown) {
      this.body.setVelocityX(SPEED)
    } else {
      this.body.setVelocityX(0)
    }

    // TODO: Fix diagonal speed (sqrt) bug
    if (cursors.up.isDown) {
      this.body.setVelocityY(-SPEED)
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(SPEED)
    } else {
      this.body.setVelocityY(0)
    }

    if (action.isDown) {
      if (this.hoveredBuilding) {
        this.followers.map(follower => {
          follower.setTarget(this.hoveredBuilding)
        })
      }
    }
  }

  addFollower (follower) {
    this.followers.push(follower)
  }

  setHoveredBuilding (building) {
    this.hoveredBuilding = building
  }
}

export default Player
