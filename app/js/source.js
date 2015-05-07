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

function getFrequencyValue(frequency) {
    var nyquist = context.sampleRate/2;
    var index = Math.round(frequency/nyquist * freqDomain.length);
    return freqDomain[index];
}

function onError(err){
    var error = err || 'Error occurred';
    console.log(error);
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var source = context.createBufferSource();
var analyser = context.createAnalyser();

source.connect(analyser);
analyser.connect(context.destination);
source.connect(context.destination);

var request = new XMLHttpRequest();
request.open('GET', '../music/song1.mp3', true);
request.responseType = 'arraybuffer';

// Decode asynchronously
request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
        var loadedMusic = buffer;
        return buffer;
    }, onError);
};
request.send();
console.log('sfs');

var canvas = document.querySelector('#visual');
var drawContext = canvas.getContext('2d');

var freqDomain = new Uint8Array(analyser.frequencyBinCount);
drawContext.clearRect(0, 0, WIDTH, HEIGHT);
drawContext.fillStyle = 'rgb(0, 0, 0)';
drawContext.fillRect(0, 0, WIDTH, HEIGHT);
analyser.getByteFrequencyData(freqDomain);
for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var value = freqDomain[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH/analyser.frequencyBinCount;
    var hue = i/analyser.frequencyBinCount * 360;
    //console.log(hue);
    drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    drawContext.fillRect(i * barWidth, offset, barWidth, height);
    console.log(i * barWidth, offset, barWidth, height);
}
