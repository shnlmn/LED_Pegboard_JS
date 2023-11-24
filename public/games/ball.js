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
  }

  preload() {}
  orbit() {
    this.orbit_x =
      Math.sin(frameCount * this.speed * 0.15) * this.circle_distance;
    this.orbit_y =
      Math.cos(frameCount * this.speed * 0.15) * this.circle_distance;
  }

  random_color() {
    colors = [
      "#90BE6D",
      "#43AA8B",
      "#4D908E",
      "#577590",
      "#277DA1",
      "#F94144",
      "#F3722C",
      "#F8961E",
      "#F9844A",
      "#0099FF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  display() {
    let scaling = 1 / (this.scale * this.peg_spacing);
    // let scaling = 1 / (this.scale * this.peg_spacing);
    let animCanvas = createGraphics(
      this.display_w * scaling,
      this.display_h * scaling
    );
    let active_pegs = createGraphics(this.display_w, this.display_h);
    clear();
    animCanvas.background(55);

    ///// count active pegs to determine animation.
    this.active_D_count = Object.values(this.peg_D_state).filter(
      (el) => el === true
    ).length;
    this.active_nodes = {};

    ///// create list of active nodes
    for (const [k, v] of Object.entries(this.peg_D_state)) {
      if (v === true) {
        this.active_nodes[k] = this.peg_D_inputs[k];
      }
    }
    animCanvas.stroke(0, 0);

    ///// light up active peg - this ignores scaling using active_pegs canvas
    for (const [k, v] of Object.entries(this.active_nodes)) {
      active_pegs.fill("#fff");
      active_pegs.stroke(0, 0);
      active_pegs.circle(
        this.peg_D_inputs[k][0],
        this.peg_D_inputs[k][1],
        this.board_peg_size
      );
    }

    if (this.active_D_count == 1) {
      ///// create orbit if only one peg is selected
      for (const [k, v] of Object.entries(this.peg_D_inputs)) {
        if (this.peg_D_state[k]) {
          let peg_coords = this.peg_D_inputs[k];
          this.location = createVector(
            peg_coords[0] * scaling,
            peg_coords[1] * scaling
          );

          this.orbit();

          animCanvas.fill("#0f0");
          animCanvas.circle(
            this.location.x + this.orbit_x * scaling,
            this.location.y + this.orbit_y * scaling,
            this.ball_diameter * scaling
          );
        }
      }

      // this.peg_display(animCanvas);
    } else if (this.active_D_count > 1) {
      ///// pass the ball
      let to_coord; // next coord
      let active_keys = Object.keys(this.active_nodes);
      let movement_speed = this.speed * active_keys.length * scaling;

      ///// pick the node to travel to
      if (this.to_node < this.active_D_count - 1) {
        to_coord = this.active_nodes[active_keys[this.to_node + 1]];
      } else {
        to_coord = this.active_nodes[active_keys[0]];
      }

      ///// scale to_coord
      to_coord = [to_coord[0] * scaling, to_coord[1] * scaling];

      ///// create a vector from the current location to the next node
      let travel_vector = animCanvas.createVector(
        to_coord[0] - this.location.x,
        to_coord[1] - this.location.y
      );

      ///// check distance from target node and switch to next node if close
      if (travel_vector.mag() < movement_speed) {
        if (this.to_node < Object.keys(this.active_nodes).length - 1) {
          this.to_node += 1;
        } else {
          this.to_node = 0;
        this.active_nodes = this.shuffle(this.active_nodes)
        }
      }

      ///// prepare vector for movement
      travel_vector.normalize();
      travel_vector.setMag(movement_speed);

      ///// update ball location by travel vector
      this.location.add(travel_vector);

      animCanvas.fill("#0f0");
      animCanvas.circle(
        this.location.x,
        this.location.y,
        this.ball_diameter * scaling
      );
      // this.peg_display(animCanvas);
    }
    image(animCanvas, 0, 0, this.display_w, this.display_h);
    image(animCanvas, 0, 0);
    image(active_pegs, 0, 0);
  }
  mouseClicked(e) {
    let peg_D_obj, peg_A_obj;
    [peg_D_obj, peg_A_obj] = this.toggle_peg(e);
    this.active_pegs = this.shuffle(this.active_pegs)
  }
}
