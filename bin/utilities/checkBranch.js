const logs = require('./logs')
const shell = require('shelljs')

module.exports.checkBranch = function (requiredBranch) {
  logs.sectionStart('Checking if branch is "dev"')
  
  const branch = shell.exec('git branch --show-current', { silent: true }).stdout.toString().trim()
  
  if (branch !== requiredBranch) {
    logs.error('You are not on the dev branch, please switch to it before running this script')
    
    shell.exit(1)
  }
}
