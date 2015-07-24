var canvas = document.getElementById('visual');
var ctx = canvas.getContext('2d');
var WIDTH = canvas.width = window.innerWidth / 1.3;
var HEIGHT = canvas.height = window.innerHeight / 1.3;
var xCenter = WIDTH / 2;
var yCenter = HEIGHT /2;


//console.log(WIDTH);
//console.log(canvas.width);
//console.log(HEIGHT);
//console.log(canvas.height);


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

ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, WIDTH, HEIGHT);


function draw() {

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]/2;

        var color = {
            r: Math.floor(Math.random() * 255),
            g:  Math.floor(Math.random() * 255),
            b:  Math.floor(Math.random() * 255),
            a: Math.random()
        };

        ctx.strokeStyle = 'rgba('+ 100 +','+ color.g +', 100, '+ color.a +')';
        ctx.lineWidth = 2;
        ctx.beginPath();

        //ctx.arc(xCenter, yCenter, Math.random() * barHeight * 2, 0, Math.PI * 2, false);

        ctx.moveTo(x, x);
        ctx.lineTo(x, HEIGHT-barHeight/2);
        ctx.closePath();
        ctx.stroke();
        ////

        //console.log();

        //ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        //ctx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
    }
}

draw();