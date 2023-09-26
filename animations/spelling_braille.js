class pbAnimation extends Pegboard {
  constructor() {
    super();
    this.active_count = 0;
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
    this.alphabet = [..."abcdefghijklmnopqrstuvwxyz"];
    this.numbers = [..."0123456789"];
    this.animals = ["cat", "dog", "horse", "elephant", "mouse"];
    this.plants = ["tree", "flower", "bush", "mushroom"];
    this.key_width = this.display_w;
    this.key_height = 100;
    this.active_peg = {};
    this.search_timer = 0;
    this.timer_limit = 20;
    // prettier-ignore
    this.brailleAlphabet = {
    "a": [[1, 0], [0, 0], [0, 0]], "b": [[1, 0], [1, 0], [0, 0]],
    "c": [[1, 1], [0, 0], [0, 0]], "d": [[1, 1], [0, 1], [0, 0]],
    "e": [[1, 0], [0, 1], [0, 0]], "f": [[1, 1], [1, 0], [0, 0]],
    "g": [[1, 1], [1, 1], [0, 0]], "h": [[1, 0], [1, 1], [0, 0]],
    "i": [[0, 1], [1, 0], [0, 0]], "j": [[0, 1], [1, 1], [0, 0]],
    "k": [[1, 0], [0, 0], [1, 0]], "l": [[1, 0], [1, 0], [1, 0]],
    "m": [[1, 1], [0, 0], [1, 0]], "n": [[1, 1], [0, 1], [1, 0]],
    "o": [[1, 0], [0, 1], [1, 0]], "p": [[1, 1], [1, 0], [1, 0]],
    "q": [[1, 1], [1, 1], [1, 0]], "r": [[1, 0], [1, 1], [1, 0]],
    "s": [[0, 1], [1, 0], [1, 0]], "t": [[0, 1], [1, 1], [1, 0]],
    "u": [[1, 0], [0, 0], [1, 1]], "v": [[1, 0], [1, 0], [1, 1]],
    "w": [[0, 1], [1, 1], [0, 1]], "x": [[1, 1], [0, 0], [1, 1]],
    "y": [[1, 1], [0, 1], [1, 1]], "z": [[1, 0], [0, 1], [1, 1]]
    };
    this.braille_reservation_table = [...this.peg_state];
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
      this.alphabet_sprites = loadImg("../assets/alphabet.png", () => {
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
  // convert braille array into a letter
  brailleToLetter(braille) {
    // convert the input braille array o a string representation
    // convert true and false to 1 and 0
    for (let i = 0; i < braille.length; i++) {
      const row = braille[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (cell == true) {
          braille[i][j] = 1;
        } else {
          braille[i][j] = 0;
        }
      }
    }

    const brailleString = JSON.stringify(braille);
    print(brailleString);
    // search the brailleAlphabet object for the matching string
    for (const key in this.brailleAlphabet) {
      const letterBraille = JSON.stringify(this.brailleAlphabet[key]);
      if (letterBraille === brailleString) {
        return key;
      }
    }
  }

  preload(callback) {
    this.alphabet_sprites = loadImg("../assets/alphabet.png", () => {
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
    this.active_peg = {
      letter: this.alphabet[key],
      braille: this.brailleAlphabet[this.alphabet[key]],
    };
    print(this.active_peg);
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
    if (
      guess.slice(0, this.letter_sprites.length) ==
      this.current_word.slice(0, this.letter_sprites.length)
    ) {
      print("guess is good");
      if (guess == this.current_word) {
        print("guess is correct");
        this.correct_answer = true;
      } else {
        print("guess is partial", this.correct_to);
        this.correct_to = this.letter_sprites.length + 1;
      }
    } else {
      print("guess is bad", guess.slice(0, this.letter_sprites.length));
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

  ///// called by sketch.js to init the loop
  display() {
    background(60, 50);
    // draw elements to canvas
    this.letter_sprites.draw();
    this.jumble_sprites.draw();
    this.particles.draw();
    // check if the answer is correct
    if (this.correct_answer) {
      this.correct();
      this.correct_answer = false;
      this.frame = 0;
      this.animation_done = false;
    }
    // check if the animation is done and reset the board
    if (this.frame > 40 && this.animation_done != true) {
      this.letter_sprites.remove();
      this.jumble_sprites.remove();
      const j = this.words.indexOf(this.current_word);
      this.current_word = this.words[j + 1];
      this.show_jumble();
      this.animation_done = true;
    }

    this.frame++; // increment the frame counter for celebration animation

    //------------ countdown to check braille to allow all pegs to be sensed, this will need calibration at this.timer_limit
    //------------ this is reset in the mouseClicked function
    if (this.run_timer) {
      this.search_timer += 1;
      if (this.search_timer > this.timer_limit) {
        this.search_timer = 0;
        this.run_timer = false;
        this.check_braille();
      }
    }
  }

  ///// flip the braille array to check for the letter
  flip_2d_array(array) {
    print(array);
    const flipped_array = [];
    for (let i = 0; i < array[0].length; i++) {
      const row = [];
      for (let j = 0; j < array.length; j++) {
        row.push(array[j][i]);
      }
      flipped_array.push(row);
    }
    return flipped_array;
  }

  check_braille() {
    // look at pegs sequentially to find the upper-left peg
    for (let i = 0; i < this.peg_state.length; i++) {
      const current_peg_state = this.peg_state[i];
      // once found, check if the peg is already in the inserted_pegs and is not reserved
      if (
        current_peg_state == true &&
        this.braille_reservation_table[i] == false
      ) {
        // build test array for the braille letter
        let test_array = { addrs: [], state: [] };
        // build test array - [column:[row]]
        for (let j = -1; j < 2; j++) {
          test_array.addrs.push([i + j, i + this.w + j, i + 2 * this.w + j]);
          test_array.state.push([
            this.peg_state[i + j],
            this.peg_state[i + this.w + j],
            this.peg_state[i + 2 * this.w + j],
          ]);
        }
        // check if any values in test_col_1 are true
        if (!test_array.state[2].includes(true)) {
          //remove column 1 from test_array
          test_array.state.shift();
          test_array.addrs.shift();
        } else {
          // remove column 3
          test_array.state.pop();
          test_array.addrs.pop();
        }
        // make the rest of the braille points active
        test_array.state = this.flip_2d_array(test_array.state);
        test_array.addrs = this.flip_2d_array(test_array.addrs);
        const addrs = test_array.addrs.flat();
        const state = test_array.state.flat();
        const addrs_states = addrs.map(function (e, i) { return [e, state[i]]; });
        for (let i = 0; i < addrs_states.length; i++) {
          const braille_peg = addrs_states[i];
          this.peg_state[braille_peg[0]] = true;
          this.braille_reservation_table[braille_peg[0]] = true;
        }

        print("test_array.addrs",addrs_states);

        print(this.brailleToLetter(test_array.state));
      }
    }
  }

  mouseClicked() {
    let peg_obj;
    peg_obj = this.toggle_peg();
    // toggle_peg() updates the peg_state array and returns the peg number and coordinates
    print("peg_obj", peg_obj);
    // add letter to letter_sprites
    if (peg_obj) {
      let is_new_peg = true;
      print("inserted pegs", this.inserted_pegs);
      // Check if the peg is already in the inserted_pegs
      // Remove Peg if it's already in inserted_pegs
      for (let index = 0; index < this.inserted_pegs.length; index++) {
        const inserted_peg = this.inserted_pegs[index];
        if (inserted_peg.addr == peg_obj["number"]) { // if the peg is already in the inserted_pegs
          for (let i = 0; i < this.letter_sprites.length; i++) {
            const sprite = this.letter_sprites[i];
            if (sprite.addr == inserted_peg.addr) { // remove the letter sprite and the peg sprite
              sprite.remove();
              inserted_peg.remove();
            }
          }
          is_new_peg = false;
        }
      }
      if (!is_new_peg) {
        this.update_letters();
      }
      // add peg if it's not already in inserted_pegs
      if (is_new_peg) {
        // add letter to letter_sprites
        this.load_spelling_sprites(this.active_peg.letter, peg_obj["number"]);
        print(
          this.active_peg,
          this.correct_to,
          this.current_word[this.correct_to]
        );
        // add peg to inserted_pegs
        const new_peg = new this.inserted_pegs.Sprite();
        // add id and location for easy removal
        new_peg.addr = peg_obj["number"];
        new_peg.pos = peg_obj["coord"];
        this.check_answer();
        this.run_timer = true;
      }
    }
  }
}
