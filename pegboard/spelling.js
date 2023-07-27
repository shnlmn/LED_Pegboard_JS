class pbAnimation extends Pegboard {
  constructor() {
    super();
    this.active_D_count = 0;
    this.active_A_count = 0;
    this.text = "HI";
  }

  display() {
    fill(255);
    textSize(400);
    // text(this.text, 50, 50);
    const peg_D_state = this.get_D_state()
    for (let index = 0; index < Object.keys(peg_D_state).length; index++) {
      fill("#F00");
      stroke(0);
      if (this.peg_D_state[index]) {
        circle(this.peg_coords[index][0], this.peg_coords[index][1], this.peg_size*this.scale);
      }
    }
  }
  key_pressed(e) {
    if (e.get_native().getKeyCode() == 8) {
      this.text.pop();
    } else {
      this.text += e.get_key().upper();
    }
  }
}
