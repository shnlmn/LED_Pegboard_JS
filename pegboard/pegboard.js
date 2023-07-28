class Pegboard {
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
    // print(this.num_list);
    this.input_section = 0.5; // percentage of bottom of board for inputs.;
    this.analog_inputs = (0, 4); //number of cols and rows for analog inputs, 0 is entire row/column;
    this.canvas_position = [50, 10];
    this.peg_D_inputs = {};
    this.peg_A_inputs = {};
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
    for (const [k, v] of Object.entries(this.peg_coords)) {
      if (v[1] > this.board_h * this.input_section + this.peg_spacing) {
        this.peg_D_inputs[k] = v;
      }
    }
    for (const [k, v] of Object.entries(this.peg_coords)) {
      if (v[0] > 670 && v[0] < 730) {
        this.peg_A_inputs[k] = v;
      }
    }
    print("D input", this.peg_D_inputs);

    // set up state objects to check for active pegs
    this.peg_D_state = {};
    this.peg_A_state = {};
    for (const [k, v] of Object.entries(this.peg_D_inputs)) {
      this.peg_D_state[k] = false;
    }
    for (const [k, v] of Object.entries(this.peg_A_inputs)) {
      this.peg_A_state[k] = false;
    }
  }

  display_pegs() {
    let cnvMask = createGraphics(this.board_w, this.board_h);
    cnvMask.fill(222, 184, 135);
    cnvMask.rect(0, 0, this.board_w, this.board_h);
    cnvMask.erase();
    Object.entries(this.peg_coords).forEach((peg) => {
      //   print(peg);
      fill("#444");
      strokeWeight(0);
      cnvMask.circle(peg[1][0], peg[1][1], this.board_peg_size);
    });
    cnvMask.noErase();
    image(cnvMask, 0, 0);
  }

  display_pixels() {
    // circle(100, 100, 100)
    let pix_color = [];
    Object.entries(this.peg_coords).forEach((peg) => {
      pix_color.push(get(peg[1][0], peg[1][1]));
      //   print(pix_color);dd
    });
    // clear();
    for (
      let index = 0;
      index < Object.entries(this.peg_coords).length;
      index++
    ) {
		    fill("#Fff")
      circle(
        this.peg_coords[index][0],
        this.peg_coords[index][1],
        this.board_peg_size
      );
      fill(pix_color[index]);
      circle(
        this.peg_coords[index][0],
        this.peg_coords[index][1],
        this.board_peg_size
      );
    }
  }
    get_status() {
      last_hall_active = this.hall_active;
      this.hall_active = Object.values(this.read_sensor_inputs()).filter(
        (element) => element === false
      ).length;
  	if (this.hall_active != last_hall_active){
  		return(read_sensor_inputs())
  	} else {
  		return false
  	}
    }
    read_sensor_inputs() { // Stand-in for actual sensor reading
      return (this.peg_D_state, this.peg_A_state);
    }
  get_peg_coords() {
    return this.peg_coords;
  }
  get_D_state() {
    return this.peg_D_state;
  }
  mouseClicked(e) {
    print("CLICKY");
    // print(this.peg_D_inputs)
    for (const [k, v] of Object.entries(this.peg_D_inputs)) {
      const actual_x = e.x - this.canvas_position[0];
      const actual_y = e.y - this.canvas_position[1];
      let vD = v;
      if (
        Math.abs(actual_x - vD[0]) <= this.board_peg_size &&
        Math.abs(actual_y - vD[1]) <= this.board_peg_size
      ) {
        print(k, v);

        print("HIT A PEG");
        print(k, this.peg_D_inputs[k]);
        this.peg_D_state[k] = !this.peg_D_state[k];
      }
    }
    // print("AFTER CLICK: ",this.peg_D_inputs)
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
