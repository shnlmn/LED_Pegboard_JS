class Analog_pegs extends Pegboard {
//   static alphabet_sprites;
  constructor(alphabet_sprites) {
    super();
    this.alphabet = [..."abcdefghijklmnopqrstuvwxyz❌"];
    this.numbers = [..."0123456789"];
    this.animals = ["cat", "dog", "horse", "elephant", "mouse"];
    this.plants = ["tree", "flower", "bush", "mushroom"];
    this.key_width = this.display_w;
    this.key_height = 100;
    this.active_peg;

  }
//   preload(callback) {
//     this.alphabet_sprites = loadImg("./assets/alphabet.png", () => {
//       if (callback) {
//         callback();
//       }
//     });
//   }
//   get_alpha_sprites(){
//     return this.leter_sprites;
//   }
//   load_sprites() {
//     let w = this.alphabet_sprites.width / 26;
//     let h = this.alphabet_sprites.height;
//     for (let x = 0; x < 26; x++) {
//       let letter_sprite = new this.letter_sprites.Sprite();
//       letter_sprite.width = this.scale * 7;
//       letter_sprite.height = this.scale * 7;
//       letter_sprite.letter = this.alphabet[x];
//       letter_sprite.img = this.alphabet_sprites.get(x * w, 7, w, 7);
//     }
//     return(this.letter_sprites)
//   }
  updateActivePeg(key) {
    this.active_peg = this.alphabet[key];
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
      button.style.backgroundColor = "white";
      button.style.borderStyle = "hidden";
      if (button.innerHTML === this.alphabet[key]) {
        button.addEventListener("click", function () {
          button.style.backgroundColor = "orange";
        });
      }
    });
  }
  display() {
    fill("grey");
    rect(-1, this.display_h, this.key_width, this.key_height);

  }
}
