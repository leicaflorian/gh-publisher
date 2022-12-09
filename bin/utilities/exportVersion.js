const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const logs = require('./logs')

module.exports.exportVersion = function (newVersion, filePath) {
  logs.sectionStart(`Storing version in "${filePath}"`)
  
  fs.writeFileSync(path.resolve(filePath), newVersion)
  
  shell.exec(`git add ${filePath} --amend --no-edit`)
  
  logs.sectionEnd('Version stored successfully!')
}
