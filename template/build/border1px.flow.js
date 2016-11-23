'use strict';
var path = require('path');
var vfs = require( 'vinyl-fs' );
var map = require('map-stream');

function Border1pxFlow(opts){
  this.src = opts.src;
  this.temp = opts.temp;
}
var Border1pxFlowProto = Border1pxFlow.prototype;
Border1pxFlowProto.run = function(){
  vfs.src([this.src], {buffer: true})
    .pipe(map(this.handler.bind(this)))
    .pipe(vfs.dest(this.temp));
}
Border1pxFlowProto.handler = function(file, callback){
  var extname  = path.extname(file.path);
  var handleFiles = ['.js', '.css', '.less', '.html', '.vue'];
  var borderRegExp = /border:\s*1px (solid|dashed) \S+;/g;

  if(handleFiles.indexOf(extname)>-1){
    var contents = file.contents.toString();
    var matchs = contents.match(borderRegExp);
    if(matchs){
      for (var i = 0; i < matchs.length; i++) {
        var match = matchs[i];
        var replace = match
        + "@media only screen and (-webkit-min-device-pixel-ratio: 2){"
        +     match.replace('1px','0.5px')
        + '}'
        + '@media only screen and (-webkit-min-device-pixel-ratio: 3){'
        +     match.replace('1px','0.3333px')
        + '}';
        contents = contents.replace(match, replace);
      }
      file.contents = new Buffer(contents);
      console.log('border 1px handled...'+file.path)
    }
  }
  callback(null, file);
}
new Border1pxFlow({
  src: './src/**',
  temp: './temp',
}).run();
