const MAX_SPEED = 80
const MAX_FORCE = 160
const MAX_SPEED_VECTOR = new Phaser.Math.Vector2(MAX_SPEED)
const MAX_FORCE_VECTOR = new Phaser.Math.Vector2(MAX_FORCE)
const FORCE_FORCE_VECTOR = new Phaser.Math.Vector2(320)
const MAX_WANDER_VECTOR = new Phaser.Math.Vector2(100)
const MAX_SPEED_SQ = MAX_SPEED * MAX_SPEED
const MAX_FORCE_SQ = MAX_FORCE * MAX_FORCE

class Follower extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, 'elder')
    config.scene.physics.world.enable(this)

    this.target = config.target
    this.wanderTarget = {
      body: {
        position: new Phaser.Math.Vector2(0, 0)
      }
    }
    this.genRandomWanderTarget()
    this.elapsed = 0
    this.WANDER_TIME = this.getRandomWanderTime()
  }

  setTarget (target) {
    if (!target) {
      this.body.setVelocity(0)
    }
    this.target = target
  }

  taken () {
    this._taken = true
    this.body.setVelocity(0)
    this.body.setImmovable(true)
  }

  update (time, delta) {
    this.body.velocity.multiply(new Phaser.Math.Vector2(0.9))

    if (this._taken) return

    if (this.target) {
      const steeringForce = this.seek(this, this.target, 100)
      this.moveToForce(steeringForce)
    } else {
      const WANDER_TIME = this.WANDER_TIME

      this.elapsed += delta

      if (this.elapsed >= WANDER_TIME * 2) {
        // reset
        this.elapsed -= WANDER_TIME * 2
        this.WANDER_TIME = this.getRandomWanderTime()
        this.genRandomWanderTarget()
      } else if (this.elapsed >= WANDER_TIME) {
        // rest
        this.body.velocity.set(0)
      } else {
        this.moveToForce(
          this.seek(this, this.wanderTarget, 10).normalize().multiply({ x: 10, y: 10 })
        )
      }

      if (this.body.velocity.lengthSq() > 20 * 20){
        this.body.velocity.normalize().multiply(MAX_WANDER_VECTOR).multiply({ x: 0.8, y: 0.8 })
      }
    }
  }

  getRandomWanderTime () {
    return 1000 + Math.random() * 1000
  }

  genRandomWanderTarget () {
    const angle = Math.random() * Math.PI * 2
    const radius = 20

    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    this.wanderTarget.body.position.set(
      Phaser.Math.Clamp(this.x + x, 150, 400),
      Phaser.Math.Clamp(this.y + y, 150, 400),
    )
  }

  moveToForce (steeringForce) {
    // vector(current velocity) + vector(steering force)
    this.body.velocity.add(steeringForce)

    // limit the magnitude of vector(new velocity) to maximum speed
    if (this.body.velocity.lengthSq() > MAX_SPEED_SQ){
      this.body.velocity.normalize().multiply(MAX_SPEED_VECTOR)
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
    if (this._taken) return
    const entity = this

    const steeringForce = this.seek(entity, target).negate()
      .normalize().multiply(FORCE_FORCE_VECTOR)
    entity.body.velocity.add(steeringForce)
  }
}

export default Follower
