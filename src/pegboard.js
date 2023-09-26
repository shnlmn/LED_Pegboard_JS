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

    ///// Write the coordinates for the pegs into an array
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
    ///// designate certain coordinates for Digital Input
    this.peg_inputs = [];
    for (let i = 0; i < this.peg_coords.length; i++) {
      const v = this.peg_coords[i]; // get the coordinates of the peg
      if (v[1] > this.board_h * this.input_section + this.peg_spacing) {// only make lower half active
        this.peg_inputs.push(v);
      }
    }

    ////// set up state objects to check for active pegs
    this.peg_state = [];
    for (let i = 0; i < this.peg_inputs.length; i++) {
      this.peg_state.push(false);
    }

    /// setup fake sensor array for testing
    /// in practice, this will come from a controller reading the actual sensors
    this.sensor_state = [...this.peg_state]


  }

  ///// call preload from sketch.js: Pegboard.preload()
  static preload() {
    this.backgroundImg = loadImg("../assets/back.jpg");
  }

  ////// reads pixel data from animation and maps the colors to the pegs
  display_pegs() {
    let i = 0;
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
    return this.peg_state;
  }

  get_peg_coords() {
    return this.peg_coords;
  }

  ///// see if mouse click happened on a peg, fake the sensor active state
  check_clicked_peg(peg_state, peg_inputs) {
    let peg_number;
    let peg_coord;
    let found = false;
    for (let index = 0; index < peg_state.length; index++) {
      const vD = peg_inputs[index];
      // print(vD)
      const actual_x = mouseX;
      const actual_y = mouseY;
      if (
        Math.abs(actual_x - vD[0]) <= this.board_peg_size / 2 &&
        Math.abs(actual_y - vD[1]) <= this.board_peg_size / 2
      ) {
        print("PEG HIT");
        peg_state[index] = !peg_state[index]; /// UPDATE peg_state
        peg_number = index;
        peg_coord = { x: vD[0], y: vD[1] };
        found = true;
      }
    }
    if (found) {
      return [peg_number, peg_coord];
    } else {
      return [false, false];
    }
  }

  toggle_peg() {
    ///// takes peg state
    let peg_number, peg_coord, peg_obj;
    [peg_number, peg_coord] = this.check_clicked_peg( // this gets the peg number and coordinates but also updates the peg_state
      this.peg_state,
      this.peg_inputs
    );
    if (peg_number) {
      peg_obj = {
        number: peg_number,
        coord: peg_coord,
      };
    } else {
      peg_obj = false;
    }
    print(this.peg_state + " " + peg_number + " " + peg_coord)

    return peg_obj;
  }

  // mouseClicked(e) {
  ///// Check DIGITAL pegs to see if click happened there
  // this.toggle_peg(e);
  // }
}

class NeopixelDisplay {
  constructor(pixels) {
    this.pixels = pixels;
  }

  update_LED() {
    return true;
  }
}
