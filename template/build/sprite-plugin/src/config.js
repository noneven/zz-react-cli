module.exports = {
    aPadding: 0,//默认值为空
    aExtname: '.png',//默认值为.png|.jpg
    aAlgorithm: 'binary-tree',//默认值为binary-tree

    aFolder: process.cwd()+ '/src/assets',
    styleFile: process.cwd()+ '/src/sprite.less',
    spriteFile: process.cwd()+ '/src/assets/sprite.png',

    pieces: '*@px',//默认值为空
    prefix: 'icon',//默认值为空
    connector: '-',//默认值为空
    processor: "less",//默认值为css
    fix4Pieces: '@px: 320/750/16*1rem;@percent: 100/750*1%;',//默认值为空
};
