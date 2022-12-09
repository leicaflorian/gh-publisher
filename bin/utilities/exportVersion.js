const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const logs = require('./logs')

module.exports.exportVersion = function (newVersion, filePath) {
  logs.sectionStart(`Storing version in "${filePath}"`)
  
  fs.writeFileSync(path.resolve(filePath), newVersion)
  
  logs.sectionEnd('Version stored successfully!')
}
