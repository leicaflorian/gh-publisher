const logs = require('./bin/utilities/logs')
const shell = require('shelljs')

const mergeToBranches = ['main']

const workingBranch = process.argv[2]

console.log(workingBranch)
mergeToBranches.forEach(branch => {
  logs.sectionStart(`Merging release branch to "${branch}"`)
  
  shell.exec(`git checkout ${branch}`, { silent: true })
  shell.exec(`git merge ${workingBranch} --no-ff`, { silent: true })
  shell.exec(`git push origin ${branch}`, { silent: true })
})
