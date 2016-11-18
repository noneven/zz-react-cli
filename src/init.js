var join = require('path').join;
var basename = require('path').basename;
var vfs = require('vinyl-fs');
var renameSync = require('fs').renameSync;
var through = require('through2');
var emptyDir = require('empty-dir').sync;
var info = require('./log').info;
var error = require('./log').error;
var success = require('./log').success;

function init(commanders) {
    console.log(commanders)
  var install = commanders.install;
  const cwd = join(__dirname, '../template');
  const dest = process.cwd();
  const projectName = basename(dest);

  if (!emptyDir(dest)) {
    error('Existing files here, please run init command in an empty folder!');
    process.exit(1);
  }

  console.log(`Creating a new zzis app in ${dest}.`);
  console.log();

  vfs.src(['./**', '!node_modules/**/*'], {cwd: cwd, cwdbase: true, dot: true})
    .pipe(template(dest, cwd))
    .pipe(vfs.dest(dest))
    .on('end', function() {
      // info('rename', 'gitignore -> .gitignore');
      // renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'));
      if (install) {
        info('run', 'npm install');
        require('./install')(printSuccess);
      } else {
        printSuccess();
      }
    })
    .resume();

  function printSuccess() {
    success(`
Success! Created ${projectName} at ${dest}.

Inside that directory, you can run several commands:
  * npm start: Starts the development server.
  * npm run build: Bundles the app into dist for production.
  * npm test: Run test.

We suggest that you begin by typing:
  cd ${dest}
  npm start

Happy hacking!`);
  }
}

function template(dest, cwd) {
	console.log(dest)
	console.log(cwd)
  return through.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    info('create', file.path.replace(cwd + '/', ''));
    this.push(file);
    cb();
  });
}

module.exports = init;
