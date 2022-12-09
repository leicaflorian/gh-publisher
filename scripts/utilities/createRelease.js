const shell = require('shelljs')

module.exports.createRelease = function (draft = false) {
  const tags = shell.exec('git tag', { silent: true }).stdout.toString().split('\n')
  const lastTag = tags[tags.length - 2]
  
  console.log(`Realising tag ${lastTag}`)
  
  shell.exec(`gh release create ${lastTag}${draft ? ' -d' : ''} -t "${lastTag}"`)
}



