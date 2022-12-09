const shell = require('shelljs')
const { program } = require('commander')
const { incrementVersion } = require('./utilities/incrementVersion')
const { createRelease } = require('./utilities/createRelease')
const logs = require('./utilities/logs')

program.name('package-publisher')
  .description('Script for publishing a project and creating a release')
  .argument('[versionIncrement]', 'The version increment. Valid increments are: \'major\', \'minor\', \'patch\'')
  .option('-b, --branch [destinationBranch]', 'Branch where the release will be created', 'staging')
  .option('-r, --onlyRelease', 'Create only the release', false)
  .option('--ignoreUncommitted', 'Execute the command and ignores if any uncommitted file ', false)
  /**
   * @param {string} versionIncrement
   * @param {{branch: string, onlyRelease: boolean, ignoreUncommitted: boolean}} options
   */
  .action((versionIncrement, options) => {
    const branches = options.branch.split(',')
    
    // check if all is committed
    logs.sectionStart('Checking if all is committed')
    const status = shell.exec('git status --porcelain', { silent: true }).stdout.toString().trim()
    
    if (status && !options.ignoreUncommitted) {
      logs.error('You have uncommitted changes, please commit them before running this script')
      return
    }
    
    // check branch is dev
    logs.sectionStart('Checking if branch is "dev"')
    const branch = shell.exec('git branch --show-current', { silent: true }).stdout.toString().trim()
    
    if (branch !== 'dev') {
      logs.error('You are not on the dev branch, please switch to it before running this script')
      return
    }
    
    // if requested only release, create it and exit
    if (options.onlyRelease) {
      logs.sectionStart('Creating only release for the last tag without bumping version')
      
      createRelease()
      return
    }
    
    // bump version
    const newVersion = incrementVersion(versionIncrement)
    
    // push to dev
    shell.exec('git push origin dev --follow-tags')
    
    // create release branch
    logs.sectionStart('Creating release branch for ' + newVersion)
    
    const releaseBranchName = `release/${newVersion}`
    shell.exec(`git branch ${releaseBranchName}`, { silent: true })
    shell.exec(`git push origin ${releaseBranchName}`)
    
    // merge release branch to destination branch
    // for each branch, merge release branch
    branches.forEach(branch => {
      logs.sectionStart(`Merging release branch to "${branch}"`)
      
      shell.exec(`git checkout ${branch}`, { silent: true })
      shell.exec(`git merge ${releaseBranchName} --no-ff`, { silent: true })
      shell.exec(`git push origin ${branch}`, { silent: true })
    })
    
    // create release on GitHub if destination branch is main
    if (branches.includes('main')) {
      createRelease()
    }
    
    // return to dev
    logs.sectionStart('Returning to initial branch')
    shell.exec('git checkout dev', { silent: true })
    
    logs.sectionEnd('Done!')
  })

program.parse(process.argv)
