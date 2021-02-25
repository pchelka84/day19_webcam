const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(localMediaStream => {
    console.log(localMediaStream);
    // convert videoStream into something that video playercan understand
    video.srcObject = localMediaStream;
    video.play();
  })
  .catch(err => {
    console.log(`Oh, no!!`, err)
  })
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  // Make sure video and canvas are the same size
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // Take the pixels out of canvas
    let pixels = ctx.getImageData(0, 0, width, height);
    // Mess with pixels
    pixels = redEffect(pixels);
    // Put pixels back
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

function takePhoto() {
  // play the sound
  snap.curreTime = 0;
  snap.play();

  // Take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'pretty');
  link.innerHTML = `<img src="${data}" alt="Just me" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
 for (let i = 0; i < pixels.data.length; i+=4) {
   pixels.data[i + 0] = pixels.data[i + 0] + 100 // red
   pixels.data[i + 1] = pixels.data[i + 1] - 77 // green
   pixels.data[i + 2] = pixels.data[i + 1] * 0.7 //blue
 }
 return pixels;
}

getVideo(); 

video.addEventListener('canplay', paintToCanvas);
