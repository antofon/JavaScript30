document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM Content Loaded");

  const skip = document.querySelectorAll("[data-skip]");
  const playerVideo = document.querySelector(".player__video");
  const playerButton = document.querySelector(".toggle");
  const playerSlider = document.querySelectorAll(".player__slider");
  const progressFilled = document.querySelector(".progress__filled");
  let isPlaying = false;
  let icon;

  // Functions

  function handleProgress() {
    //  multiply by 100 to get a percentage (50% instead of 0.5)
    const percent = (playerVideo.currentTime / playerVideo.duration) * 100;
    progressFilled.style.flexBasis = `${percent}%`;
  }

  function scrub(e) {
    const scrubTime =
      (e.offsetX / progressFilled.offsetWidth) * playerVideo.duration;
    playerVideo.currentTime = scrubTime;
    console.log(e);
  }

  function togglePlay() {
    // not playing, then play video
    if (!isPlaying) {
      isPlaying = true;
      playerVideo.play();
      icon = "❚ ❚";
      playerButton.textContent = icon;
    } else {
      // playing video, then pause
      isPlaying = false;
      playerVideo.pause();
      icon = "►";
      playerButton.textContent = icon;
    }
  }

  function handleSliders(e) {
    // whenever the volume slider changes, update the volume accordingly
    if (this.getAttribute("name") === "volume") {
      playerVideo.volume = e.target.valueAsNumber;
    } else {
      // whenever the play back slider changes, update the play back rate accordingly
      playerVideo.playbackRate = e.target.valueAsNumber;
    }
  }

  function handleSkip(e) {
    playerVideo.currentTime += parseFloat(this.dataset.skip);
  }

  // Event Listeners
  skip.forEach(skipValue => skipValue.addEventListener("click", handleSkip));

  playerSlider.forEach(range => {
    range.addEventListener("change", handleSliders);
  });
  //check if timecode is being updated
  playerVideo.addEventListener("timeupdate", handleProgress);
  playerVideo.addEventListener("click", togglePlay);

  playerButton.addEventListener("click", togglePlay);

  let mousedown = false;
  //   first checks this variable, if it's true, it moves on to the next conditional. if it's false, it skips altogether. Short-circuiting evaluation
  progressFilled.addEventListener("click", scrub);
  progressFilled.addEventListener("mousemove", e => mousedown && scrub(e));
  progressFilled.addEventListener("mousedown", () => (mousedown = true));
  progressFilled.addEventListener("mouseup", () => (mousedown = false));
});
