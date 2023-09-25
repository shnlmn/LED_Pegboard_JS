class pbAnimation extends Pegboard {
  constructor() {
    super();
    this.active_D_count = 0;
    this.active_A_count = 0;
    this.words = ["apple", "tiger", "house", "baseball", "kitchen", "running"];
    this.alphabet_sprites;
    this.jumble_sprites = new Group();
    this.current_word = this.words[0];
    this.correct_answer = false;
    this.correct_to = 0;
    this.incorrect_letters = [];
    this.frame = 0;
    this.animation_done = true;
    this.alphabet = [..."abcdefghijklmnopqrstuvwxyz?"];
    this.numbers = [..."0123456789"];
    this.animals = ["cat", "dog", "horse", "elephant", "mouse"];
    this.plants = ["tree", "flower", "bush", "mushroom"];
    this.key_width = this.display_w;
    this.key_height = 100;
    this.active_peg;

    ///// SETUP ALPHABET SPRITES AND BUTTONS
    for (const key in this.alphabet) {
      let display_letter = createButton(this.alphabet[key]);
      display_letter.position(
        key * 33 + (windowWidth / 2 - this.display_w / 2),
        this.display_h + 10
      );
      display_letter.size(30, 50);
      display_letter.addClass("inactive");
      display_letter.mousePressed(() => this.updateActivePeg(key));
      // display_letter.style("background-color:white; border-style:hidden");
    }
    this.letter_sprites = new Group(); // These sprites are for the letters that are inserted into the board
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

  updateActivePeg(key) {
    this.active_peg = this.alphabet[key];
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      // print(button.innerHTML);
      button.className = "inactive";
      if (button.innerHTML === this.alphabet[key]) {
        button.addEventListener("click", function (event) {
          event.target.className = "active";
          print("click", event.target.className);
        });
      }
    });
  }

  load_spelling_sprites(letter, addr) {
    // 1. create a sprite for the letter
    // 2. add the sprite to the letter_sprites group
    // 3. update the letters

    let letter_sprite = this.create_letter_sprite(letter);
    letter_sprite.addr = addr;
    this.letter_sprites.push(letter_sprite);
    print("load spelling sprites", this.letter_sprites);
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
    // check if the guess up to this letter is correct
    if (guess.slice(0, this.letter_sprites.length) == this.current_word.slice(0, this.letter_sprites.length)) {
      print("guess is good")
      if (guess == this.current_word) {
        print("guess is correct")
        this.correct_answer = true;
      } else {
        print("guess is partial", this.correct_to)
        this.correct_to = this.letter_sprites.length + 1;
      }
    } else {
      print("guess is bad", guess.slice(0, this.letter_sprites.length))
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

  mouseClicked() {
    let peg_D_obj, peg_A_obj;
    [peg_D_obj, peg_A_obj] = this.toggle_peg();
    // Check if peg is in D or A
    if (peg_A_obj) {
      let new_peg = true;
      // Check if peg is already in inserted_pegs
      // Remove peg if it's already in inserted_pegs
      for (let index = 0; index < this.inserted_pegs.length; index++) {
        const inserted_peg = this.inserted_pegs[index];
        if (inserted_peg.addr == peg_A_obj["number"]) {
          for (let i = 0; i < this.letter_sprites.length; i++) {
            const sprite = this.letter_sprites[i];
            if (sprite.addr == inserted_peg.addr) {
              sprite.remove();
            }
          }
          inserted_peg.remove();
          new_peg = false;
        }
        this.update_letters();
      }
      // Add peg if it didn't pass the above test
      if (new_peg) {
        // add letter to letter_sprites
        if (this.active_peg == "?") {
          this.active_peg = this.current_word[this.correct_to];
        }
        //this.load_spelling_sprites}
        print(this.active_peg,this.correct_to, this.current_word[this.correct_to])
        this.load_spelling_sprites(this.active_peg, peg_A_obj["number"]);
        // add peg to inserted_pegs
        const new_peg = new this.inserted_pegs.Sprite();
        new_peg.addr = peg_A_obj["number"];
        new_peg.pos = peg_A_obj["coord"];
      }
    }
    this.check_answer();
  }
}
