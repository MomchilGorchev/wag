/*
    global $:false
*/

if (typeof jQuery === 'undefined') {throw new Error('Include jQuery you fool!');}

var hello = 'Hello World';

jQuery(function() {
    'use strict';
    console.log(hello);
});