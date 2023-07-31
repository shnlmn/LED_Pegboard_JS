class pbAnimation extends Pegboard {
  constructor() {
    super();
    this.speed = 0.3 * this.scale;
    this.speed_floor = 20 * this.scale;
    this.circle_distance = 4 * this.scale;
    this.ball_diameter = 4 * this.board_peg_size;
    this.orbit_x = 0;
    this.orbit_y = 0;
    this.location = createVector(0, 0);
    this.travel_vector = createVector(0, 0);
    this.to_node = 0;
    this.start_point = 0;
    this.active_D_count = 0;
    this.active_A_count = 0;
    this.peg_coords = this.get_peg_coords();
    this.particles = new Group();
    this.particles.d = this.board_peg_size*3;
    this.particles.strokeWeight = 0;
    this.cannons = new Group();
    this.cannons.rotationSpeed = 5;
    this.cannons.color = "red";
    this.cannons.collider = "none";
    this.cannons.strokeWeight = 0;
    this.balls = new Group();
    this.balls.strokeWeight = 0;
    this.balls.d = this.board_peg_size * 6;
    this.cannonballs = new Group();
    this.cannonballs.mass = 1;
    this.cannonballs.strokeWeight = 0;
    this.cannonballs.d = this.board_peg_size * 8;
    world.gravity.y = 1;
    // for (let i = 0; i < 100; i++) {
    //   let x = ~~(Math.random() * this.display_w);
    //   let y = ~~(Math.random() * this.display_h);
    //   let ball = new this.balls.Sprite(x, y);
    //   ball.strokeWeight = 0;
    //   ball.friction = 0.01;
    // }
  }

  pop(ball) {
    for (let i = 0; i < 10; i++) {
      let p = new this.particles.Sprite(ball.x, ball.y);
      p.direction = random(360);
      p.speed = random(3, 5);
      p.life = 45;
    }
  }

  display() {
    background(60, 50);
    if (this.cannons.length > 0) {
    }
    for (const cannon of this.cannons) {
      if (cannon.rotation % 360 > 75 || cannon.rotation % 360 < -75) {
        cannon.rotationSpeed = -cannon.rotationSpeed;
      }
      if (frameCount % 50 == 0) {
        let cannonball = new this.cannonballs.Sprite(
          cannon.position.x,
          cannon.position.y
        );
        cannonball.direction = cannon.rotation - 90;
        cannonball.speed = (Math.random() + 4) * 8;
        cannonball.collides(this.balls, (cannonball, ball) => {
          this.pop(ball);
          ball.remove();
          cannonball.remove();
        });
      }
    }
    if (frameCount % 5 == 0) {
      new this.balls.Sprite(~~(Math.random() * this.display_w), -150);
    }
    this.cannonballs.draw();
    this.balls.draw();
    this.cannons.draw();
    this.particles.draw();
  }
  mouseClicked(e) {
    for (let index = 0; index < this.peg_D_inputs.length; index++) {
      const vD = this.peg_D_inputs[index];
      const actual_x = e.x - this.canvas_position[0];
      const actual_y = e.y - this.canvas_position[1];
      if (
        Math.abs(actual_x - vD[0]) <= this.board_peg_size / 2 &&
        Math.abs(actual_y - vD[1]) <= this.board_peg_size / 2
      ) {
        let cannon = new this.cannons.Sprite(vD[0], vD[1]);
        cannon.h = 10 * this.board_peg_size;
        cannon.w = 3 * this.board_peg_size;
        cannon.offset.y = -20;
      }
    }
  }
}
