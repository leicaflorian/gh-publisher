const shell = require('shelljs')

module.exports.createRelease = function () {
  const tags = shell.exec('git tag', { silent: true }).stdout.toString().split('\n')
  const lastTag = tags[tags.length - 2]
  
  console.log(tags, `Last tag: ${lastTag}`)
  
  shell.exec(`gh release create ${lastTag} -d -t "${lastTag}" bin`)
}



