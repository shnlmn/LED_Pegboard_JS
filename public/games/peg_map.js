class pbAnimation extends Pegboard {
  constructor(serialPort) {
    super();
    this.location = createVector(0, 0);
    this.travel_vector = createVector(0, 0);
    this.active_count = 0;
    this.peg_coords = this.get_peg_coords();
    this.pegs = new Group();
    this.sensors = [];
    // this.socket.on("serialData", (data) => {
    //   this.process_serial_data(data);
    // });
  }

  display() {
    background(100, 100);
    this.pegs.draw();
    this.set_pegs_active();
    // print(port);
  }

  process_serial_data(data) {
    this.sensors = JSON.parse(data).map(function (bool) {
      return !bool;
    });
    // print(this.sensors);
  }
  preload() {}
  ///// detect mouse click, find closest peg, and add a sprite
  mouseClicked(e) {
    // let peg_obj;
    // peg_obj = this.get_peg_clicked();
    // if (peg_obj) {
    //   let new_peg = true;
    //   for (let index = 0; index < this.pegs.length; index++) {
    //     const peg = this.pegs[index];
    //     if (peg.peg_number == peg_obj["addr"]) {
    //       peg.remove();
    //       new_peg = false;
    //     }
    //   }
    //   if (new_peg) {
    //     const coords = peg_obj["coord"];
    //     let peg = new this.pegs.Sprite(coords.x, coords.y, 10, 10, "k");
    //     peg.color = "red";
    //     peg.strokeWeight = 0;
    //     peg.peg_number = peg_obj["addr"];
    //   }
    // }
  }
  set_pegs_active() {
    // iterate through sensor state
    for (let index = 0; index < this.sensors.length; index++) {
      let new_peg = true;
      // if the sensor is active....
      if (this.sensors[index]) {
        // loop through existing pegs
        for (let i = 0; i < this.pegs.length; i++) {
          const peg = this.pegs[i];
          // if the peg is already active, don't add it again
          if (peg.addr == index) {
            new_peg = false;
          }
        }
        if (new_peg) {
          let peg = new this.pegs.Sprite(
            this.peg_inputs[index][0],
            this.peg_inputs[index][1],
            10,
            10,
            "k"
          );
          peg.color = "red";
          peg.strokeWeight = 0;
          peg.addr = index;
        }
      } else {
        // if the sensor is not active, remove the peg
        for (let i = 0; i < this.pegs.length; i++) {
          const peg = this.pegs[i];
          if (peg.addr == index) {
            peg.remove();
          }
        }
      }
    }
  }
}
