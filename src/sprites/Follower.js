const MAX_SPEED = 80
const MAX_FORCE = 160
const MAX_SPEED_VECTOR = new Phaser.Math.Vector2(MAX_SPEED)
const MAX_FORCE_VECTOR = new Phaser.Math.Vector2(MAX_FORCE)
const MAX_SPEED_SQ = MAX_SPEED * MAX_SPEED
const MAX_FORCE_SQ = MAX_FORCE * MAX_FORCE

class Follower extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, 'elder')
    config.scene.physics.world.enable(this)

    this.target = config.target
  }

  update () {
    this.seek(this, this.target, 400)
  }

  setTarget (target) {
    this.target = target
  }

  seek (entity, target, spaceSq) {
    const distance = Phaser.Math.Distance.Squared(
      target.body.position.x,
      target.body.position.y,
      entity.body.position.x,
      entity.body.position.y
    )

    if (distance < spaceSq) {
      entity.body.velocity.set(0)
      return
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

    // vector(current velocity) + vector(steering force)
    entity.body.velocity.add(steeringForce)

    // limit the magnitude of vector(new velocity) to maximum speed
    if (entity.body.velocity.lengthSq() > MAX_SPEED_SQ){
      entity.body.velocity.normalize().multiply(MAX_SPEED_VECTOR)
    }
  }
}

export default Follower
