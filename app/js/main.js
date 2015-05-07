var WIDTH = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
var HEIGHT = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame  ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();
console.log(WIDTH);
console.log(HEIGHT);

// Constructor class
function MusicLoader(options, callback) {
    this.loadedMusic = null;
    this.url = options.url || null;
    this.init(this.url);
}

// Core class methods
MusicLoader.prototype = {
    init: function(url){
        var _this = this;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        _this.context = new AudioContext();
        _this.loadSound(url);
    },

    loadSound: function(url){
        'use strict';
        var _this = this;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function() {
            _this.context.decodeAudioData(request.response, function(buffer) {
                _this.loadedMusic = buffer;
                _this.playSound(_this.loadedMusic)
            }, _this.onError);
        };
        request.send();
    },

    playSound: function(buffer){
        var _this = this;
        var source = _this.context.createBufferSource();
        var analyser = _this.context.createAnalyser();
        source.buffer = buffer;
        source.connect(analyser);
        analyser.connect(_this.context.destination);

        source.start(0);
        analyser.maxDecibels = -10;
        analyser.minDecibels = -90;
        analyser.smoothingTimeConstant = 1;

        var canvas = document.getElementById('visual'), ctx = canvas.getContext('2d');
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        //console.log(bufferLength);
        var dataArray = new Float32Array(bufferLength);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        console.log(dataArray);

        console.log(bufferLength);



        function draw() {
            drawVisual = requestAnimationFrame(draw);

            analyser.getFloatFrequencyData(dataArray);

            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            var barWidth = (WIDTH / bufferLength) * 2.5;
            var barHeight;
            var x = 0;

            for(var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                //console.log(dataArray[i]);

                ctx.fillStyle = 'rgb(' + (barHeight+100) + ',150,50)';
                ctx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

                x += barWidth + 1;
            }
        }
        draw();
    },

    stopSound: function(){
        var _this = this;
        var source = _this.context.createBufferSource();
        source.buffer = _this.loadedMusic;                          // tell the source which sound to play
        source.connect(_this.context.destination);
        //source.start(2);
        source.stop(0);
    },

    onError: function(err){
        var error = err || 'Error occurred';
        console.log(error);
    }
};

document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('play-sound').addEventListener('click', function(){
        window.myPlayer = new MusicLoader({url: 'music/song1.mp3'});
    });

    document.getElementById('stop-sound').addEventListener('click', function(){
        myPlayer.stopSound();
    });
});
