const shell = require('shelljs')

/**
 * @param {'major'|'minor'|'patch'} [versionIncrement]
 */
module.exports.incrementVersion = function (versionIncrement) {
  if (versionIncrement) {
    const validIncrements = ['major', 'minor', 'patch']
    
    if (!validIncrements.includes(versionIncrement)) {
      console.error(`Invalid version increment: ${versionIncrement}. Valid increments are: ${validIncrements.join(', ')}`)
      
      return
    }
    
    console.log(`Bumping "${versionIncrement}" version...`)
    
    //--git-tag-version=false prevents npm version from creating a new tag
    const res = shell.exec(`npm version ${versionIncrement} --force `, { silent: true })
    
    if (res.code !== 0) {
      console.error(res.stderr)
      
      throw new Error('Error bumping version')
    } else {
      newVersion = res.stdout.toString().replace(/\n/g, '').trim()
      console.log(`Version bumped successfully to ${newVersion}!`)
    }
  }
}
