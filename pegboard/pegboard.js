class Pegboard {
  constructor() {
    this.scale = 8;
    this.w = 144;
    this.h = 96;
    this.display_w = this.w * this.scale;
    this.display_h = this.h * this.scale;
    this.peg_spacing = 2;
    this.peg_size = 1;
    this.board_peg_spacing = this.peg_spacing * this.scale;
    this.board_peg_size = this.peg_size * this.scale;
    this.board_w = int(this.w * this.scale);
    this.board_h = int(this.h * this.scale);
    this.length =
      parseInt(this.w / this.peg_spacing) * parseInt(this.h / this.peg_spacing);
    this.num_list = [...Array(parseInt(this.length)).keys()];
    // print(this.num_list);
    this.input_section = 0.5; // percentage of bottom of board for inputs.;
    this.analog_inputs = (0, 4); //number of cols and rows for analog inputs, 0 is entire row/column;
    this.canvas_position = [50, 10];

    // write peg center coordinates
    this.peg_coords = {};
    for (let index = 0; index < this.num_list.length; index++) {
      let x_count = (this.board_peg_spacing * index) % this.board_w;
      let y_count =
        this.board_peg_spacing *
        Math.floor((this.board_peg_spacing * index) / this.board_w);
      this.peg_coords[index] = [
        x_count + this.board_peg_spacing / 2,
        y_count + this.board_peg_spacing / 2,
      ];
    }
    // print(this.peg_coords[20][0])

    //designate certain coordinates for Digital and Analog Input
    this.peg_D_inputs = Object.entries(this.peg_coords).filter(
      ([key, value]) =>
        value[1] > this.board_h * this.input_section + this.peg_spacing
    );
    this.peg_A_inputs = Object.entries(this.peg_coords).filter(
      ([key, value]) => value[0] > 670 && value[0] < 730
    );
    // print(this.peg_D_inputs)

    // set up state objects to check for active pegs
    this.peg_D_state = {};
    this.peg_A_state = {};
    for (let i = 0; i < this.num_list.length; i++) {
      this.peg_D_state[i] = false;
      this.peg_A_state[i] = false;
    }
  }
  display_pegs() {
	background(222,184,135)
    Object.entries(this.peg_coords).forEach((peg) => {
      //   print(peg);
      fill("#FFF");
      strokeWeight(0);
      circle(peg[1][0], peg[1][1], this.board_peg_size);
    });
  }

  get_D_state() {
    return this.peg_D_state;
  }
  mouseClicked(e) {
    for (const [k, v] of this.peg_D_inputs) {
      const actual_x = e.x - this.canvas_position[0];
      const actual_y = e.y - this.canvas_position[1];
      let vD = v;
      if (
        Math.abs(actual_x - vD[0]) <= this.board_peg_size &&
        Math.abs(actual_y - vD[1]) <= this.board_peg_size
      ) {
        this.peg_D_state[k] = !this.peg_D_state[k];
      }
    }

  }
}

class NeopixelDisplay {
  constructor(pixels) {
    this.pixels = pixels;
  }

  update_LED() {
    return true;
  }
}
