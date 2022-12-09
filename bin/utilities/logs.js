const chalk = require('chalk')

module.exports = {
  sectionStart (message) {
    console.log(`\n-- ${message}...`)
  },
  
  sectionEnd (message) {
    console.log(`| ${message}!`)
  },
  
  error (message) {
    console.error(`${chalk.red('[ERROR]')}: ${message}\n`)
  }
}
