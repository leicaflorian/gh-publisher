const shell = require('shelljs')

module.exports.createRelease = function (draft = false) {
  const tags = shell.exec('git tag', { silent: true }).stdout.toString().split('\n')
  const lastTag = tags[tags.length - 2]
  
  console.log(`Realising tag ${lastTag}`)
  
  // check if a release already exists
  const releases = shell.exec(`gh release view ${lastTag}`, { silent: true })
  
  if (releases.code === 0) {
    console.log('Release already exists')
    
    return
  }
  
  shell.exec(`gh release create ${lastTag}${draft ? ' -d' : ''} -t "${lastTag}"`)
}



