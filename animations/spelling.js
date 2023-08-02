class pbAnimation extends Analog_pegs {
  constructor() {
    super();
    this.active_D_count = 0;
    this.active_A_count = 0;
    this.words = [
      "apple",
      "tiger",
      "house",
      "baseball",
      "kitchen",
      "running",
    ];
    this.alphabet_sprites;
    this.jumble_sprites = new Group();
    this.current_word = this.words[0];
    this.correct_answer = false;
    this.frame = 0;
    this.animation_done = true;

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
        this.show_jumble();
        noSmooth();
        // this.load_spelling_sprites();
      });
    });
    //// Peg group
    this.inserted_pegs = new Group();
    this.inserted_pegs.d = this.board_peg_size + 1;
    this.inserted_pegs.strokeWeight = 0;
    this.inserted_pegs.collider = "none";

    //// Particles Group
    this.particles = new Group();
    this.particles.d = 10;
    this.particles.strokeWeight = 0;
  }

  preload(callback) {
    this.alphabet_sprites = loadImg("./assets/alphabet.png", () => {
      // this.load_spelling_sprites();
      if (callback) {
        callback();
      }
    });
  }

  create_letter_sprite(letter) {
    // print("create", this.alphabet_sprites.width);
    let w = this.alphabet_sprites.width / 26;
    let h = this.alphabet_sprites.height;
    let letter_sprite = new Sprite();
    letter_sprite.letter = letter;
    const index = this.alphabet.indexOf(letter);
    let letter_image = this.alphabet_sprites.get(index * w, 0, w, h);
    letter_sprite.img = letter_image;
    letter_sprite.scale = this.scale * this.peg_spacing;
    letter_sprite.collider = "none";
    return letter_sprite;
  }

  load_spelling_sprites(letter, addr) {
    // print("load", this.alphabet_sprites.width);
    let letter_sprite = this.create_letter_sprite(letter);
    letter_sprite.addr = addr;
    this.letter_sprites.push(letter_sprite);
    this.update_letters();
  }

  update_letters() {
    for (let index = 0; index < this.letter_sprites.length; index++) {
      const l_sprite = this.letter_sprites[index];
      l_sprite.x =
        index * (l_sprite.width + this.board_peg_spacing) +
        this.board_peg_spacing * 8;
      l_sprite.y = this.board_peg_spacing * 28;
    }
  }

  show_jumble() {
    this.jumble = this.shuffle(this.current_word);
    // print(this.jumble);
    for (let i = 0; i < this.jumble.length; i++) {
      // print("JUMBLE", this.alphabet_sprites.width);
      this.jumble_sprites.push(this.create_letter_sprite(this.jumble[i]));
    }
    for (let i = 0; i < this.jumble_sprites.length; i++) {
      const j_sprite = this.jumble_sprites[i];
      j_sprite.x =
        i * (j_sprite.width + this.board_peg_spacing) +
        this.board_peg_spacing * 8;
      j_sprite.y = this.board_peg_spacing * 8;
    }
    // print(this.jumble_sprites);
  }

  shuffle(letters) {
    // print(letters);
    letters = letters.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    // Join the characters back into a new jumbled word
    const jumbledWord = letters.join("");

    return jumbledWord;
  }

  check_answer() {
    let guess = "";
    for (let i = 0; i < this.letter_sprites.length; i++) {
      guess += this.letter_sprites[i].letter;
    }
    if (guess == this.current_word) {
      this.correct_answer = true;
    }
  }
  correct() {
    for (let i = 0; i < 40; i++) {
      let x = Math.random() * this.display_w;
      let y = Math.random() * this.display_h;
      this.fireworks(x, y);
    }
  }
  fireworks(x, y) {
    // print("BOOM?", x, y);
    for (let i = 0; i < 10; i++) {
      let p = new this.particles.Sprite(x, y);
      p.direction = random(360);
      p.speed = random(3, 5);
      p.life = 45;
      // print(p);
    }
  }
  display() {
    background(60, 50);
    this.letter_sprites.draw();
    this.jumble_sprites.draw();
    this.particles.draw();
    if (this.correct_answer) {
      this.correct();
      this.correct_answer = false;
      this.frame = 0;
      this.animation_done = false;
    }
    if (this.frame > 40 && this.animation_done != true) {
      this.letter_sprites.remove();
      this.jumble_sprites.remove();
      const j = this.words.indexOf(this.current_word);
      this.current_word = this.words[j + 1];
      this.show_jumble();
      this.animation_done = true;
    }
    this.frame++;
  }

  mouseClicked(e) {
    let peg_D_obj, peg_A_obj;
    [peg_D_obj, peg_A_obj] = this.toggle_peg(e);
    if (peg_A_obj) {
      let new_peg = true;
      for (let index = 0; index < this.inserted_pegs.length; index++) {
        const peg = this.inserted_pegs[index];
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
        this.load_spelling_sprites(this.active_peg, peg_A_obj["number"]);
        const new_peg = new this.inserted_pegs.Sprite();
        new_peg.addr = peg_A_obj["number"];
        new_peg.pos = peg_A_obj["coord"];
        // print(new_peg.addr, new_peg.pos);
      }
    }
    this.check_answer();
  }
}
