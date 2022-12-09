const fs = require('fs')
const path = require('path')

module.exports.getCurrentVersion = function () {
  const jsonPath = path.resolve('package.json')
  const fileContent = fs.readFileSync(jsonPath, 'utf8')
  
  return 'v' + JSON.parse(fileContent).version
}
