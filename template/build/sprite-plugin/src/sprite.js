var fs = require('fs');
var path = require('path');
var spritesmith = require('spritesmith');
var templater = require('spritesheet-templates');
//自定义template
templater.addTemplate('sprite', require(path.join(__dirname, 'templates/sprite.js')));

var util = require('./util');

function CreateSprite(options){
    this.initOptions(options);
}
var createProto = CreateSprite.prototype;
createProto.initOptions = function(options){
    this.aFolder = options.aFolder;
    this.aPadding = options.aPadding;
    this.aAlgorithm = options.aAlgorithm;
    this.aExtname = options.aExtname || '.png|.jpg';

    this.tStyleFile = options.target.styleFile;
    this.tSpriteFile = options.target.spriteFile;
    this.tStyleTemplate = options.target.styleTemplate;

    this.fix4Pieces = options.target.fix4Pieces;

    this.formatFileName = options.formatFileName || function(filename) {
        return filename.replace('@', ':');
    };
    console.log("\nstart\n");

    util.info("assets:", "folder: " + this.aFolder)
    util.info("target:", "styleFile: " + this.tStyleFile)
    util.info("target:", "spriteFile: " + this.tSpriteFile)
    console.log();
}
createProto.run = function(){
    var self = this;
    var items = fs.readdirSync(self.aFolder);
    var files = items.filter(function (item) {
        var sName = item.split('.')[0];
        var tName = self.tSpriteFile.split("/").pop().split(".")[0];
        return self.aExtname.indexOf(path.extname(item))>-1&&(item)&&sName!=tName;
    }).map(function (item) {
        return self.aFolder + '/' + item;
    });

    this.createSpriteImage(files);
};
createProto.createSpriteImage = function(files){
    var self = this;
    if(fs.existsSync(self.tSpriteFile)) fs.unlinkSync(self.tSpriteFile);
    spritesmith.run(Object.assign({
        src: files}, self.aAlgorithm, self.aExtname), function(err, result) {
        util.info('spriteFile:', JSON.stringify(result.properties));
        console.log()

        for (var k in result.coordinates) {
            util.info(path.basename(k)+":", JSON.stringify(result.coordinates[k]));
        }

        fs.writeFileSync(self.tSpriteFile, result.image);

        var imagemin = require('imagemin');
        // var imageminWebp = require('imagemin-webp');
        // var imageminGifsicle = require('imagemin-gifsicle');
        // var imageminMozjpeg = require('imagemin-mozjpeg');
        // var imageminOptipng = require('imagemin-optipng');
        // var imageminSvgo = require('imagemin-svgo');
        // var imageminPngquant = require('imagemin-pngquant');
        imagemin([self.tSpriteFile], path.join(self.tSpriteFile,"../"), {
            use: [
                // imageminGifsicle({
                //     interlaced: false
                // }),
                // imageminMozjpeg(),
                // imageminSvgo(),
                // imageminPngquant(),
                // imageminOptipng(),
                // imageminWebp({quality: 100})
            ]
        }).then(function() {
            console.log('Images optimized');
            console.log()
            util.info("create:", "spriteFile: "+self.tSpriteFile)

            self.createSpriteStyle(result);
        })

    });
};
createProto.createSpriteStyle = function(result){
    var self = this;
    var styles = templater({
        sprites: Object.keys(result.coordinates).map(function(key) {
            return {
                name: self.formatFileName(path.basename(key).split('.')[0]),
                x: result.coordinates[key].x,
                y: result.coordinates[key].y,
                width: result.coordinates[key].width,
                height: result.coordinates[key].height,
            }
        }),
        spritesheet: {
            image: path.relative(path.join(self.tStyleFile, "../"), self.tSpriteFile),
            width: result.properties.width,
            height: result.properties.height
        }
    }, self.tStyleTemplate);
    fs.writeFileSync(self.tStyleFile, this.fix4Pieces+ "\n" + styles);
    util.info('create:', "styleFile: " + self.tStyleFile);
    console.log("\nsuccess\n");
}
var config = {};
try {
    var CONFIG_PATH = process.argv[2].split("=")[1];
    config = require(CONFIG_PATH)
} catch (e) {
  util.info("warning: ", e.message+"!use the default config to create sprite");
}

config = Object.assign(require('./config'),config);
var targetOptions = {
    styleFile: config.styleFile,
    spriteFile: config.spriteFile,
    fix4Pieces: config.fix4Pieces,
    styleTemplate: {
        format: 'sprite',
        pieces: config.pieces,
        formatOpts: {
            'cssClass': config.prefix,
            'connector': config.connector,
            'processor': config.processor
        }
    },
};
var spriteInstance = new CreateSprite({
    aPadding: config.aPadding,
    aExtname: config.aExtname,
    aAlgorithm: config.aAlgorithm,
    aFolder: config.aFolder,
    target: targetOptions
});

// spriteInstance.run();

module.exports = spriteInstance
