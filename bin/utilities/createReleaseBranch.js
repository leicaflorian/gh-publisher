const logs = require('./logs')
const shell = require('shelljs')

/**
 * @param {string} newVersion
 * @param {string[]} mergeToBranches
 */
module.exports.createReleaseBranch = function (newVersion, mergeToBranches) {
  logs.sectionStart('Creating release branch for ' + newVersion)
  
  const releaseBranchName = `release/${newVersion}`
  shell.exec(`git branch ${releaseBranchName}`, { silent: true })
  shell.exec(`git push origin ${releaseBranchName}`, { silent: true })
  
  if (mergeToBranches) {
    // merge release branch to destination branch
    // for each branch, merge release branch
    mergeToBranches.forEach(branch => {
      logs.sectionStart(`Merging release branch to "${branch}"`)
      
      shell.exec(`git checkout ${branch}`, { silent: true })
      shell.exec(`git merge ${releaseBranchName} --no-ff`, { silent: true })
      shell.exec(`git push origin ${branch}`, { silent: true })
    })
  }
}
