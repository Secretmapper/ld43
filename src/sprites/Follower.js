const MAX_SPEED = 80
const MAX_FORCE = 160
const MAX_SPEED_VECTOR = new Phaser.Math.Vector2(MAX_SPEED)
const MAX_FORCE_VECTOR = new Phaser.Math.Vector2(MAX_FORCE)
const MAX_WANDER_VECTOR = new Phaser.Math.Vector2(20)
const MAX_SPEED_SQ = MAX_SPEED * MAX_SPEED
const MAX_FORCE_SQ = MAX_FORCE * MAX_FORCE

class Follower extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, 'elder')
    config.scene.physics.world.enable(this)

    this.target = config.target
  }

  setTarget (target) {
    if (!target) {
      this.body.setVelocity(0)
    }
    this.target = target
  }

  update () {
    this.body.velocity.multiply(new Phaser.Math.Vector2(0.9))

    if (this.target) {
      const steeringForce = this.seek(this, this.target, 400)

      // vector(current velocity) + vector(steering force)
      this.body.velocity.add(steeringForce)

      // limit the magnitude of vector(new velocity) to maximum speed
      if (this.body.velocity.lengthSq() > MAX_SPEED_SQ){
        this.body.velocity.normalize().multiply(MAX_SPEED_VECTOR)
      }
    } else {
      if (this.body.velocity.lengthSq() > 20 * 20){
        this.body.velocity.normalize().multiply(MAX_WANDER_VECTOR)
      }
    }
  }

  seek (entity, target, spaceSq) {
    const distance = Phaser.Math.Distance.Squared(
      target.body.position.x,
      target.body.position.y,
      entity.body.position.x,
      entity.body.position.y
    )

    if (distance < spaceSq) {
      return entity.body.velocity.clone().negate()
    }

    // (target position) - (curr position) 
    const desiredVector = target.body.position.clone().subtract(entity.body.position)

    // normalize vector
    desiredVector.normalize()

    // scale vector(desired velocity) to maximum speed
    desiredVector.multiply(MAX_SPEED_VECTOR)

    // vector(desired velocity) - vector(current velocity)
    // WARNING: We are reusing desired vector here
    const steeringForce = desiredVector.subtract(entity.body.velocity)

    // limit the magnitude of vector(steering force) to maximum force
    if (steeringForce.lengthSq() > MAX_FORCE_SQ){
      steeringForce.normalize().multiply(MAX_FORCE_VECTOR)
    }

    return steeringForce
  }

  avoid (target) {
    const entity = this

    const steeringForce = this.seek(entity, target).negate()
    entity.body.velocity.add(steeringForce)
  }
}

export default Follower
