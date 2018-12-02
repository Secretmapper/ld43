import Table from 'sprites/Table'
const SPEED = 160
const SPEED_VECTOR = new Phaser.Math.Vector2(SPEED)

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
    this.carrying = null
    this.controls = config.controls
    this._pressedAction = false
    this.setDepth(this.scene.depths.follower)

    this.movementVector = new Phaser.Math.Vector2()
  }

  update () {
    this.callZone.x = this.x - this.callZone.body.radius - this.width / 2
    this.callZone.y = this.y - this.callZone.body.radius + this.height

    const { cursors, action, cancel } = this.controls

    this.body.setVelocity(0)

    if (cursors.left.isDown) {
      this.movementVector.set(-1, this.movementVector.y)
      this.flipX = true
    }
    else if (cursors.right.isDown) {
      this.movementVector.set(1, this.movementVector.y)
      this.flipX = false
    } else {
      this.movementVector.set(0, this.movementVector.y)
    }

    // TODO: Fix diagonal speed (sqrt) bug
    if (cursors.up.isDown) {
      this.movementVector.set(this.movementVector.x, -1)
    } else if (cursors.down.isDown) {
      this.movementVector.set(this.movementVector.x, 1)
    } else {
      this.movementVector.set(this.movementVector.x, 0)
    }

    this.movementVector.normalize()
    this.movementVector.multiply(SPEED_VECTOR)
    this.body.velocity.set(this.movementVector.x, this.movementVector.y)

    if (this.carrying) {
      this.carrying.x = this.x + this.carrying.width / 2
      this.carrying.y = this.y + this.carrying.height / 2
    }

    if (action.isDown) {
      if (!this._pressedAction) {
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
    } else {
      if (this.carrying) {
        this.scene.hideSpots(this.carrying)
        this.carrying = null
      }
    }

    this._pressedAction = action.isDown

    if (cancel.isDown) {
      this.clearFollowers()
    }

    this.hoveredBuilding = undefined
  }

  carry (itemPackage) {
    if (!this.carrying) {
      this.carrying = itemPackage
      this.scene.showSpots(this.carrying)
      this.clearFollowers()
    }
  }

  addFollower (follower) {
    if (!this.carrying) {
      this.followers.push(follower)
    }
  }

  clearFollowers () {
    this.followers.map(follower => {
      follower.setTarget(null)
    })
    this.followers.length = 0
  }

  setHoveredBuilding (building) {
    this.hoveredBuilding = building
  }
}

export default Player
