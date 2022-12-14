const shell = require('shelljs')
const { getCurrentVersion } = require('./getCurrentVersion')
const logs = require('./logs')
const { exportVersion } = require('./exportVersion')

/**
 * @param {'major'|'minor'|'patch'} [versionIncrement]
 * @param {string|undefined} [exportVersion]
 */
module.exports.incrementVersion = function (versionIncrement, exportVersionTo) {
  let newVersion = getCurrentVersion()
  
  if (!versionIncrement) {
    return newVersion
  }
  
  const validIncrements = ['major', 'minor', 'patch']
  
  if (!validIncrements.includes(versionIncrement)) {
    logs.error(`Invalid version increment: ${versionIncrement}. Valid increments are: ${validIncrements.join(', ')}`)
    
    return
  }
  
  logs.sectionStart(`Bumping "${versionIncrement}" version...`)
  
  //--git-tag-version=false prevents npm version from creating a new tag
  const res = shell.exec(`npm version ${versionIncrement} --force `, { silent: true })
  
  if (res.code !== 0) {
    logs.error(res.stderr)
    
    throw new Error('Error bumping version')
  } else {
    newVersion = res.stdout.toString().replace(/\n/g, '').trim()
    
    if (exportVersionTo) {
      exportVersion(newVersion, exportVersionTo)
    }
    
    // push to dev
    shell.exec('git push origin dev --follow-tags')
    
    logs.sectionEnd(`Version bumped successfully to ${newVersion}`)
  }
  
  return newVersion
}
