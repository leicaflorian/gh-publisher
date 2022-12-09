const shell = require('shelljs')
const { program } = require('commander')
const { incrementVersion } = require('./utilities/incrementVersion')
const { createRelease } = require('./utilities/createRelease')

program.name('package-publisher')
  .description('Script for publishing a project and creating a release')
  .argument('[versionIncrement]', 'The version increment. Valid increments are: \'major\', \'minor\', \'patch\'')
  .option('-b, --branch [destinationBranch]', 'Branch where the release will be created', 'staging')
  .option('-r, --onlyRelease', 'Create only the release', false)
  /**
   * @param {string} versionIncrement
   * @param {{branch: string, onlyRelease: boolean}} options
   */
  .action((versionIncrement, options) => {
    
    // check if all is committed
    const status = shell.exec('git status --porcelain', { silent: true }).stdout.toString().trim()
    
    if (status) {
      console.error('You have uncommitted changes, please commit them before running this script')
      return
    }
    
    // check branch is dev
    const branch = shell.exec('git branch --show-current', { silent: true }).stdout.toString().trim()
    
    if (branch !== 'dev') {
      console.error('You are not on the dev branch, please switch to it before running this script')
      return
    }
    
    if (options.onlyRelease) {
      createRelease()
      return
    }
    
    // bump version
    const newVersion = incrementVersion(versionIncrement)
    
    // push to dev
    shell.exec('git push origin dev --follow-tags')
    
    // create release branch
    const releaseBranchName = `release/${newVersion}`
    shell.exec(`git checkout -b ${releaseBranchName}`)
    shell.exec(`git push origin ${releaseBranchName}`)
    
    // merge release branch to destination branch
    shell.exec(`git checkout ${options.branch}`)
    shell.exec(`git merge ${releaseBranchName} --no-ff`)
    shell.exec(`git push origin ${options.branch}`)
    
    // create release on GitHub if destination branch is main
    if (options.branch === 'main') {
      createRelease()
    }
    
    // return to dev
    shell.exec('git checkout dev')
  })

program.parse(process.argv)
