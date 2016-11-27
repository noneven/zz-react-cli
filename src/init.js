let join = require('path').join
let basename = require('path').basename
let vfs = require('vinyl-fs')
let through = require('through2')
let emptyDir = require('empty-dir').sync
let info = require('./log').info
let error = require('./log').error
let success = require('./log').success

function init(commanders) {
  let install = commanders.install
  let cwd = join(__dirname, '../template')
  let dest = process.cwd()
  let projectName = basename(dest)

  if (!emptyDir(dest)) {
    error('Existing files here, please run init command in an empty folder!')
    process.exit(1)
  }

  console.log(`Creating a new zrc app in ${dest}.`)
  console.log()

  vfs.src(['./**', '!node_modules/**/*'], {cwd: cwd, cwdbase: true, dot: true})
    .pipe(template(dest, cwd))
    .pipe(vfs.dest(dest))
    .on('end', function() {
      if (install) {
        info('run', 'npm install')
        require('./install')(printSuccess)
      } else {
        printSuccess()
      }
    })
    .resume()

  function printSuccess() {
    success(`
      Success! Created ${projectName} at ${dest}.

      Inside that directory, you can run several commands:
        * npm start: Starts the development server.
        * npm run qa: Run test.
        * npm run ftp: ftp to the test server.
        * npm run build: Bundles the app into dist for production.

      We suggest that you begin by typing:
        cd ${dest}
        npm start

      Happy coding!`)
  }
}

function template(dest, cwd) {
  return through.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb()
    }

    info('create', file.path.replace(cwd + '/', ''))
    this.push(file)
    cb()
  })
}

module.exports = init
