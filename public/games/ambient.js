class pbAnimation extends Pegboard {
  constructor() {
    super();
    // this.video = createVideo(["assets/video1.mp4"]);
    //allow autoplay
    this.audio = createAudio();
    this.audio.volume(0);
    this.video;
    this.thumb_w = 120;
    this.thumb_h = 80;
    this.video_list = [
      "assets/videos/Fancy.mp4",
      "assets/videos/light projector effect.mp4",
      "assets/videos/StarfulSky.mp4",
      "assets/videos/YellowSwirl.mp4",
      "assets/videos/sailboatmovie.mp4",
      "assets/videos/GalaxyMarble.mp4",
      "assets/videos/JellyNebula.mp4",
    ];
    this.videos = [];
    this.thumbs = [];
    this.preload();
  }

  preload() {
    ///// load main video
    this.video = createVideo(this.video_list[0]);
    this.video.size(this.display_w, this.display_h);
    this.video.loop();
    this.video.hide();

    //// load other videos to make their thumbnails
    for (let i = 0; i < this.video_list.length; i++) {
      this.videos[i] = createVideo([this.video_list[i]]);
      this.videos[i].mousePressed(() => {
        this.change_video(this.videos[i].src);
        // this.videos[i].stop();
      });
      // this.videos[i].loop();
      this.videos[i].size(this.thumb_w, this.thumb_h);
      this.videos[i].position(
        this.thumb_w * i + (windowWidth/2 - this.display_w/2),
        this.display_h + 40
      );

      // this.videos[i].loadPixels();
      // this.videos[i].hide();
    }
  }

  change_video(videosrc) {
    print("change_video");
    let video = createVideo(videosrc);
    this.video = video;
    this.video.size(this.display_w, this.display_h);
    this.video.loop();
    this.video.hide();
  }

  display() {
    // print("display")
    this.video.loadPixels();
    image(this.video, 0, 0, this.display_w, this.display_h);
  }

  mouseClicked() {
    // print(this.videos);
    // for (let index = 0; index < Object.keys(this.videos).length; index++) {
    //   const vid = this.videos[index];
    //   print(vid);
    //   let img = vid.get(0, 0, this.display_w, this.display_h);
    //   print("IMG", img);
    // }
  }
}
