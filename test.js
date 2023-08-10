let thumbnailsContainer;

function setup() {
  noCanvas();
  thumbnailsContainer = select('#thumbnails-container');
  generateThumbnails();
}

async function generateThumbnails() {
  // Replace 'video_directory_path' with the actual path to your video directory
  const videoDirectoryPath = 'assets/videos';
  const response = await fetch(videoDirectoryPath);
  const videoFiles = await response.text();

  const filesArray = videoFiles.split('\n');

  for (const file of filesArray) {
    if (file.trim().endsWith('.mp4')) {
      const video = createVideo(videoDirectoryPath + file.trim(), onVideoLoad);
      video.hide();
    }
  }
}

function onVideoLoad() {
  const thumbnail = createImage(this.width, this.height);
  thumbnail.copy(this, 0, 0, this.width, this.height, 0, 0, thumbnail.width, thumbnail.height);
  thumbnail.size(120, 90); // Adjust thumbnail size as needed
  thumbnailsContainer.child(thumbnail);
}
