// Constructor class
function MusicLoader(options, callback) {
    this.loadedMusic = null;
    this.url = options.url || null
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
        var source = _this.context.createBufferSource(); // creates a sound source
        source.buffer = buffer;                          // tell the source which sound to play
        source.connect(_this.context.destination);       // connect the source to the context's destination (the speakers)
        source.start(0);
    },

    stopSound: function(){
        var _this = this;
        var source = _this.context.createBufferSource();
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
