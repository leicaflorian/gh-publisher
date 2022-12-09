const logs = require('./bin/utilities/logs')
const shell = require('shelljs')

const mergeToBranches = ['main']
const workingBranch = process.argv[2]

mergeToBranches.forEach(branch => {
  logs.sectionStart(`Merging release branch to "${branch}"`)
  
  shell.exec(`git checkout ${branch}`, { silent: true })
  shell.exec(`git merge ${workingBranch} --no-commit`, { silent: true })
  shell.exec(`git push origin ${branch}`, { silent: true })
  
  // return to original branch
  shell.exec(`git checkout ${workingBranch}`, { silent: true })
})
