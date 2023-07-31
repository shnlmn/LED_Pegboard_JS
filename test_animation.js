class Animation extends TestClass {
  constructor() {
    super();
    world.gravity.y = 1;
    this.balls = new Group();
    this.chaosBalls = new Group();
    for (let i = 0; i < 100; i++) {
      let x = ~~(Math.random() * this.display_w);
      let y = ~~(Math.random() * this.display_h);
      let ball = new this.balls.Sprite(x, y, this.board_peg_size * 4);
      ball.strokeWeight = 0;
      ball.friction = 0.01;
    }
  }

  display() {
     clear();
     this.balls.draw();
     this.chaosBalls.draw();
    if (frameCount % 10 == 0) {
     this.chaosBall = new this.chaosBalls.Sprite();
     this.chaosBall.x = Math.random() * this.display_w;
     this.chaosBall.y = Math.random() * this.display_h;
     this.chaosBall.d = 15;
     this.chaosBall.direction = Math.random() * 360;
     this.chaosBall.speed = 20;
    }
      if (frameCount % 5 == 0) {
      new this.balls.Sprite(~~(Math.random() * this.display_w), -150).d =
        this.board_peg_size * 4;
    }
  }
}
