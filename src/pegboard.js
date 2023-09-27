class Pegboard {
  static backgroundImg;
  constructor() {
    this.scale = 8;
    this.w = 144;
    this.h = 96;
    this.display_w = this.w * this.scale;
    this.display_h = this.h * this.scale;
    this.peg_spacing = 2;
    this.peg_w = this.w / this.peg_spacing;
    this.peg_h = this.h / this.peg_spacing;
    this.peg_size = 1;
    this.board_peg_spacing = this.peg_spacing * this.scale;
    this.board_peg_size = this.peg_size * this.scale;
    this.board_w = int(this.w * this.scale);
    this.board_h = int(this.h * this.scale);
    this.length =
      parseInt(this.w / this.peg_spacing) * parseInt(this.h / this.peg_spacing); // length of peg array
    this.num_list = [...Array(parseInt(this.length)).keys()];
    this.input_section = 0.5; // percentage of bottom of board for inputs.;
    this.analog_inputs = (0, 4); //number of cols and rows for analog inputs, 0 is entire row/column;

    ///// MASTER ARRAYS
    ///// These arrays keep track of peg information
    this.peg_coords = []; // coordinates of all pegs
    this.peg_inputs = []; // coordinates of pegs that are inputs
    this.peg_state = []; // state of input pegs stored in memory
    this.sensor_state = []; // state of sensors, read from controller

    ///// Write the coordinates for the pegs into an array
    ///this.peg_coords = [];
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
    //this.peg_inputs = [];
    for (let i = 0; i < this.peg_coords.length; i++) {
      const Y = this.peg_coords[i][1]; // get the Y coordinates of the peg
      if (Y > this.board_h * this.input_section) {
        // only make lower half active
        this.peg_inputs.push(this.peg_coords[i]); // add the peg coords to the input array
      }
    }

    ////// set up state objects to check for active pegs
    // this.peg_state = [];
    for (let i = 0; i < this.peg_inputs.length; i++) {
      this.peg_state.push(0);
    }

    /// setup fake sensor array for testing
    /// in practice, this will come from a controller reading the actual sensors
    this.sensor_state = [...this.peg_state];
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
    const sensor_read = this.read_sensor_inputs();
    if (JSON.stringify(sensor_read) != JSON.stringify(this.peg_state)) {
      // check if sensors match peg_state
      this.peg_state = [...sensor_read]; // update peg_state
      return true
    } else {
      return false
    }

  }

  read_sensor_inputs() {
    // Stand-in for actual sensor reading
    return this.sensor_state;
  }

  get_peg_coords() {
    return this.peg_coords;
  }

  activate_pegs() {}

  /////// THESE FUNCTINS STAND IN FOR ACTUAL SENSOR READING ///////////
  get_peg_clicked() {
    // flip the state of the clicked peg and return an object with the peg number, state and coordinates
    ///// takes peg state
    let peg_number, peg_coord, peg_obj;
    [peg_number, peg_coord] = this.check_clicked_peg(); // this gets the peg number and coordinates but also updates the peg_state
    if (peg_number) {
      peg_obj = {
        number: peg_number,
        coord: peg_coord,
      };
    } else {
      peg_obj = false;
    }
    // print(this.peg_state + " " + peg_number + " " + peg_coord);

    return peg_obj;
  }

  ///// see if mouse click happened on a peg, fake the sensor active state
  check_clicked_peg() {
    let peg_number;
    let peg_coord;
    let found = false;
    for (let index = 0; index < this.sensor_state.length; index++) {
      const vD = this.peg_inputs[index];
      // print(vD)
      const actual_x = mouseX;
      const actual_y = mouseY;
      if (
        Math.abs(actual_x - vD[0]) <= this.board_peg_size / 2 &&
        Math.abs(actual_y - vD[1]) <= this.board_peg_size / 2
      ) {
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
}

class NeopixelDisplay {
  constructor(pixels) {
    this.pixels = pixels;
  }

  update_LED() {
    return true;
  }
}
