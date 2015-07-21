var canvas = document.getElementById('visual');
var ctx = canvas.getContext('2d');
var WIDTH = canvas.width = window.innerWidth / 2;
var HEIGHT = canvas.height = window.innerHeight / 2;

var audio = new Audio();
audio.src = '../music/song1.mp3';
audio.controls = true;
audio.autoplay = true;
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

        //var stream = audioCtx.createMediaElementSource(audio);

        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);

        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        analyser.getByteTimeDomainData(dataArray);
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        function draw() {
            drawVisual = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(0, 0, 0)';

            ctx.beginPath();

            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {

                var v = dataArray[i] / 128.0;
                var y = v * HEIGHT / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }

        draw();
    //}, function(){ console.log('bump') });
//}