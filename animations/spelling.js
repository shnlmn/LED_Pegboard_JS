class pbAnimation extends Analog_pegs {
  constructor() {
    super();
    this.active_D_count = 0;
    this.active_A_count = 0;
    this.words = ["apple", "tiger", "house", "baseball", "kitchen", "running"];
    this.alphabet_sprites;

    ///// SETUP ALPHABET SPRITES AND BUTTONS
    for (const key in this.alphabet) {
      let display_letter = createButton(this.alphabet[key]);
      display_letter.position(key * 33 + 55, this.display_h + 20);
      display_letter.size(30, 50);
      display_letter.mousePressed(() => this.updateActivePeg(key));
      display_letter.style("background-color:white; border-style:hidden");
    }
    this.letter_sprites = new Group();
    this.preload(() => {
      this.alphabet_sprites = loadImg("./assets/alphabet.png", () => {
        this.load_sprites();
      });
    });
    this.inserted_pegs = new Group();
    this.inserted_pegs.d = this.board_peg_size + 1;
    this.inserted_pegs.strokeWeight = 0;
  }
  preload(callback) {
    this.alphabet_sprites = loadImg("./assets/alphabet.png", () => {
      if (callback) {
        callback();
      }
    });
  }

  load_sprites(letter, addr) {
    print(letter);
    const index = this.alphabet.indexOf(letter);
    let w = this.alphabet_sprites.width / 26;
    let h = this.alphabet_sprites.height;
    let letter_sprite = new this.letter_sprites.Sprite();
    letter_sprite.letter = index;
    letter_sprite.addr = addr;
    let letter_image = this.alphabet_sprites.get(index * w, 0, w, h);
    letter_sprite.img = letter_image;
    letter_sprite.color = "blue";
    letter_sprite.pos = { x: 50, y: 50 };
    letter_sprite.scale = this.scale * this.peg_spacing;
    letter_sprite.collider = "none";
    this.update_letters();
  }
  update_letters() {
    noSmooth();
    for (let index = 0; index < this.letter_sprites.length; index++) {
      const l_sprite = this.letter_sprites[index];
      l_sprite.x = index * (l_sprite.width + this.board_peg_spacing);
      l_sprite.y = this.board_peg_spacing * 28;
    }
  }

  display() {
    background(60, 50);
    this.letter_sprites.draw();
  }

  mouseClicked(e) {
    let peg_D_obj, peg_A_obj;
    [peg_D_obj, peg_A_obj] = this.toggle_peg(e);
    if (peg_A_obj) {
      let new_peg = true;
      for (let index = 0; index < this.inserted_pegs.length; index++) {
        const peg = this.inserted_pegs[index];
        print("DKDFKJD", peg.addr, peg_A_obj["number"]);
        if (peg.addr == peg_A_obj["number"]) {
          for (let i = 0; i < this.letter_sprites.length; i++) {
            const sprite = this.letter_sprites[i];
            if (sprite.addr == peg.addr) {
              sprite.remove();
            }
          }
          peg.remove();
          new_peg = false;
        }
        this.update_letters();
      }
      if (new_peg) {
        this.load_sprites(this.active_peg, peg_A_obj["number"]);
        const new_peg = new this.inserted_pegs.Sprite();
        new_peg.addr = peg_A_obj["number"];
        new_peg.pos = peg_A_obj["coord"];
        print(new_peg.addr, new_peg.pos);
      }
    }
  }
}
