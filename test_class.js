class TestClass {
  constructor() {
    this.scale = 8;
    this.w = 134;
    this.h = 88;
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
    this.canvas_position = [0, 0];

    this.board_background = createGraphics(this.display_w, this.display_h);
    this.peg_light = createGraphics(this.display_w, this.display_h);
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
    print(this.peg_coords);
  }
  clear_pegs() {
    this.peg_light.clear();
    this.board_background.clear();
  }
  display_pegs() {
    /// set up peg lights with p5
    let i = 0;
    this.board_background.clear();
    while (i < this.peg_coords.length) {
      // print(i, this.peg_coords[0], this.peg_coords)
      const coords = this.peg_coords[i];
      //   print(this.peg_coords[i])
      const index = (coords[0] + coords[1] * this.display_w) * 4;
      // print(i, index, coord[0], coord[1], pixels[index]);
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      this.peg_light.fill(r, g, b);
      this.peg_light.circle(coords[0], coords[1], this.board_peg_size);
      i++;
    }
    this.board_background.fill(40);
    this.board_background.rect(0, 0, this.display_w, this.display_h);

    image(this.board_background, 0, 0);
    image(this.peg_light, 0, 0);
  }
}
