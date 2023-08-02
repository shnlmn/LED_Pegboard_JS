class Pegboard {
  static backgroundImg;
  constructor() {
    this.scale = 8;
    this.w = 144;
    this.h = 96;
    this.display_w = this.w * this.scale;
    this.display_h = this.h * this.scale;
    this.peg_spacing = 2;
    this.peg_size = 1;
    this.hall_active = 0;
    this.board_peg_spacing = this.peg_spacing * this.scale;
    this.board_peg_size = this.peg_size * this.scale;
    this.board_w = int(this.w * this.scale);
    this.board_h = int(this.h * this.scale);
    this.length =
      parseInt(this.w / this.peg_spacing) * parseInt(this.h / this.peg_spacing);
    this.num_list = [...Array(parseInt(this.length)).keys()];
    this.input_section = 0.5; // percentage of bottom of board for inputs.;
    this.analog_inputs = (0, 4); //number of cols and rows for analog inputs, 0 is entire row/column;
    this.canvas_position = [50, 10];

    this.peg_coords = [];

    for (let index = 0; index < this.length; index++) {
      let x_count = (this.board_peg_spacing * index) % this.board_w;
      let y_count =
        this.board_peg_spacing *
        Math.floor((this.board_peg_spacing * index) / this.board_w);
      this.peg_coords.push([
        x_count + this.board_peg_spacing / 2,
        y_count + this.board_peg_spacing / 2,
      ]);
    }

    //designate certain coordinates for Digital and Analog Input
    this.peg_D_inputs = [];
    this.peg_A_inputs = [];
    for (let i = 0; i < this.peg_coords.length; i++) {
      const v = this.peg_coords[i];
      if (v[1] > this.board_h * this.input_section + this.peg_spacing) {
        this.peg_D_inputs.push(v);
      }
    }
    for (let i = 0; i < this.peg_coords.length; i++) {
      const v = this.peg_coords[i];
      if (v[0] > 670 && v[0] < 730) {
        this.peg_A_inputs.push(v);
      }
    }
    print(this.peg_D_inputs);
    // set up state objects to check for active pegs
    this.peg_D_state = [];
    this.peg_A_state = [];

    for (let i = 0; i < this.peg_D_inputs.length; i++) {
      this.peg_D_state.push(false);
    }
    for (let i = 0; i < this.peg_A_inputs.length; i++) {
      this.peg_A_state.push(false);
    }
    print(this.peg_D_state);
    ///// create createGraphics object for the peg lights
    this.peg_light = createGraphics(this.display_w, this.display_h);
    this.peg_light.stroke(0, 0);
    this.peg_light.strokeWeight(0);
    this.peg_colors = [];
  }

  ///// call preload from sketch.js: Pegboard.preload()
  static preload() {
    this.backgroundImg = loadImg("./assets/back.jpg");
  }

  display_pegs() {
    /// set up peg lights with p5
    let i = 0;
    // fill("#974");
    // rect(0, 0, this.display_w, this.display_h);
    while (i < this.peg_coords.length) {
      const coords = this.peg_coords[i];
      const index = (coords[0] + coords[1] * this.display_w) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      fill(r, g, b);
      stroke(r, g, b);
      circle(coords[0], coords[1], this.board_peg_size);
      i++;
    }
  }

  ///// read the status of the input peg holes
  get_status() {
    last_hall_active = this.hall_active;
    this.hall_active = this.read_sensor_inputs().filter(
      (element) => element === false
    ).length;
    if (this.hall_active != last_hall_active) {
      return read_sensor_inputs();
    } else {
      return false;
    }
  }

  read_sensor_inputs() {
    // Stand-in for actual sensor reading
    print(this.peg_D_state)
    return [this.peg_D_state, this.peg_A_state];
  }

  get_peg_coords() {
    return this.peg_coords;
  }

  mouseClicked(e) {
    for (let index = 0; index < this.peg_D_inputs.length; index++) {
      const vD = this.peg_D_inputs[index];
      const actual_x = e.x - this.canvas_position[0];
      const actual_y = e.y - this.canvas_position[1];
      if (
        Math.abs(actual_x - vD[0]) <= this.board_peg_size &&
        Math.abs(actual_y - vD[1]) <= this.board_peg_size
      ) {
        print("HIT A PEG");
        this.peg_D_state[index] = !this.peg_D_state[index];
      }
    }
    print(this.peg_D_state);
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
