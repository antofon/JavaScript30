const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  // navigator object - how to get video.
  //   NOTE: In wesbos video, his parameter for .then() is localmediastream, but this is not obsolute. MDN says that getUserMedia() returns a MediaStream object
  //MDN Sources: https://developer.mozilla.org/en-US/docs/Web/API/LocalMediaStream
  //Another resourcehttps://www.html5rocks.com/en/tutorials/getusermedia/intro/
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(MediaStream => {
      console.log(MediaStream);
      //need to turn media stream object into a URL that the video element understands
      video.srcObject = MediaStream;
      // allows video to keep playing, instead of showing one frame
      video.play();
    })
    .catch(err => {
      console.error("You blocked the webcam, please enable :)");
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // every certain milliseconds, take image from webcam and put in canvas
  //   start at top left hand corner of canvas (0,0) and paint width and height
  // every 16 milliseconds, taking frame from video elt
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    // stacking 10% transparency on top of rgb split
    // ctx.globalAlpha = 0.1;
    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // play the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  // text based representation of photo when you console.log(data) called Base 64
  // so we can use the data and turn it into a link
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" alt="Handsome Man"/> `;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //BLUE
  }
  return pixels;
}

// pulling apart red green blues and moving to the side to see what we're working with
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //RED
    pixels.data[i + 100] = pixels.data[i + 1]; //GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; //BLUE
  }
  return pixels;
}

function greenScreen(pixels) {
  // holds our min/max green
  // green screen: "give me all the colors between RGB value and take them around". so it's like you take some special greens out
  const levels = {};

  document.querySelectorAll(".rgb input").forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!, 4th pixel is the alpha is the transparent pixel and 0 is totally transparent
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

//canplay is an event on the video elt
//once video is played, it will emit an event called canplay, running paintToCanvas
video.addEventListener("canplay", paintToCanvas);
