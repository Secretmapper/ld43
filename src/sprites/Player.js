import Table from 'sprites/Table'
const SPEED = 160

class Player extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, 'player')
    config.scene.physics.world.enable(this)

    this.callZone = config.scene.add.sprite(config.scene, this.x, this.y)
    config.scene.physics.world.enable(this.callZone)
    this.callZone.body.setCircle(25, 25, true)
    this.callZone.body.moves = false
    this.callZone.setVisible(false)
    this.callZone.player = this

    this.followers = []
    this.controls = config.controls
  }

  update () {
    this.callZone.x = this.x - this.callZone.body.radius - this.width / 2
    this.callZone.y = this.y - this.callZone.body.radius + this.height

    const { cursors, action, cancel } = this.controls

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
      if (this.hoveredBuilding instanceof Table) {
        if (this.hoveredBuilding.canMake) {
          this.scene.showShoppingList(this.hoveredBuilding)
        }
      }

      if (
        this.hoveredBuilding && !this.hoveredBuilding.isFilled
        && this.followers.length > 0
      ) {
        const follower = this.followers.pop()

        this.hoveredBuilding.approachedBy(follower)
        follower.setTarget(this.hoveredBuilding)
      }
    }

    if (cancel.isDown) {
      this.followers.map(follower => {
        follower.setTarget(null)
      })
      this.followers.length = 0
    }

    this.hoveredBuilding = undefined
  }

  addFollower (follower) {
    this.followers.push(follower)
  }

  setHoveredBuilding (building) {
    this.hoveredBuilding = building
  }
}

export default Player
