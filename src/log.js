var leftPad = require('left-pad')
var chalk = require('chalk')

module.exports = {
	info: function info(type, message) {
	  console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message}`)
	},

	error: function error(message) {
	  console.error(chalk.red(message))
	},

	success: function success(message) {
	  console.error(chalk.green(message))
	}
}
