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
var audio;
var inputURL = document.querySelector('#audio-src');
var submitURL = document.querySelector('#save-audio-src');

submitURL.addEventListener('click', function(e){

    e.preventDefault();

    var url = 'music/song1.mp3';

    audio = new Audio();
    audio.src = url;
    audio.controls = true;
    audio.autoplay = true;
    document.body.appendChild(audio);

    initMusicVisualization()

});


function initMusicVisualization(){

//
//navigator.getUserMedia = ( navigator.getUserMedia    || navigator.webkitGetUserMedia ||
//navigator.mozGetUserMedia || navigator.msGetUserMedia );
//
//if (navigator.getUserMedia) {
//    navigator.getUserMedia({audio: true}, function(stream) {

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();
    var gainNode = audioCtx.createGain();

    var source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);


    analyser.fftSize = 32;

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

            ctx.strokeStyle = 'rgba(255, '+ i* 10 % 255 +', '+ i* 10 % 255 +', '+ color.a +')';
            //ctx.strokeStyle = 'rgba('+ 0 +', '+ 100 +', '+ color.b +', '+ color.a +')';
            ctx.lineWidth = 4;
            ctx.beginPath();

            var radius = barHeight + barWidth / 2;
            ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();

            if(radius > 100){
                ctx.lineWidth = 1;
                ctx.moveTo(xCenter, yCenter);
                ctx.lineTo(Math.random() * WIDTH, Math.random() * HEIGHT);
                //ctx.stroke();
            }


            ////

            //console.log();

            //ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            //ctx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

            x += barWidth + 1;
        }
    }

    draw();
}
