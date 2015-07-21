var canvas = document.getElementById('visual');
var ctx = canvas.getContext('2d');
var WIDTH = canvas.width = window.innerWidth / 1.3;
var HEIGHT = canvas.height = window.innerHeight / 1.3;

console.log(WIDTH);
console.log(canvas.width);
console.log(HEIGHT);
console.log(canvas.height);


var audio = new Audio();
audio.src = '../music/song1.mp3';
audio.controls = true;
audio.autoplay = false;
document.body.appendChild(audio);


//
//navigator.getUserMedia = ( navigator.getUserMedia    || navigator.webkitGetUserMedia ||
//navigator.mozGetUserMedia || navigator.msGetUserMedia );
//
//if (navigator.getUserMedia) {
//    navigator.getUserMedia({audio: true}, function(stream) {

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var gainNode = audioCtx.createGain();

source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(gainNode);
gainNode.connect(audioCtx.destination);


analyser.fftSize = 256;

var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);

ctx.clearRect(0, 0, WIDTH, HEIGHT);


function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]/2;

        ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        ctx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
    }
}

draw();