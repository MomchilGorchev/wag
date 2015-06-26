var WIDTH = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
var HEIGHT = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

window.requestAnimationFrame =  window.requestAnimationFrame  ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };

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
        var audioCtx = new AudioContext();
        var audio = document.getElementById('mySong');
        var audioSrc = audioCtx.createMediaElementSource(audio);
        var analyser = audioCtx.createAnalyser();
        // we have to connect the MediaElementSource with the analyser
        audioSrc.connect(analyser);
        //audioSrc.start(0);


        var canvas = document.getElementById('visual'), ctx = canvas.getContext('2d');
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);


        function draw() {
            drawVisual = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(frequencyData);

            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            var barWidth = (WIDTH / 128) * 2.5;
            var barHeight;
            var x = 0;

            for(var i = 0; i < 128; i++) {
                barHeight = frequencyData[i] / 2;

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
