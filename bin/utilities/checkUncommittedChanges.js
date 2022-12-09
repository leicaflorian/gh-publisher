const logs = require('./logs')
const shell = require('shelljs')

module.exports.checkUncommittedChanges = function () {
  logs.sectionStart('Checking if all is committed')
  
  const status = shell.exec('git status --porcelain', { silent: true }).stdout.toString().trim()
  
  if (status) {
    logs.error('You have uncommitted changes, please commit them before running this script')
    
    shell.exit(1)
  }
}
