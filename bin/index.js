#!/usr/bin/env node
'use strict'

const shell = require('shelljs')
const { program } = require('commander')
const { incrementVersion } = require('./utilities/incrementVersion')
const { createRelease } = require('./utilities/createRelease')
const logs = require('./utilities/logs')
const { checkUncommittedChanges } = require('./utilities/checkUncommittedChanges')
const { checkBranch } = require('./utilities/checkBranch')
const { createReleaseBranch } = require('./utilities/createReleaseBranch')

program.name('ghp')
  .description('Script for publishing a project and creating a release')
  .argument('[versionIncrement]', 'The version increment. Valid increments are: \'major\', \'minor\', \'patch\'')
  .option('-b, --branch <destinationBranch>', 'Branch where the release will be created', 'staging')
  .option('-r, --onlyRelease', 'Create only the release', false)
  .option('--ignoreUncommitted', 'Execute the command and ignores if any uncommitted file ', false)
  /**
   * @param {string} versionIncrement
   * @param {{branch: string, onlyRelease: boolean, ignoreUncommitted: boolean}} options
   */
  .action((versionIncrement, options) => {
    const branches = options.branch.split(',')
    
    // check if all is committed only if not specified to ignore
    if (!options.ignoreUncommitted) {
      checkUncommittedChanges()
    }
    
    // check branch is dev
    checkBranch('dev')
    
    // if requested only release, create it and exit
    if (options.onlyRelease) {
      logs.sectionStart('Creating only release for the last tag without bumping version')
      
      createRelease()
      return
    }
    
    // bump version
    const newVersion = incrementVersion(versionIncrement)
    
    // create release branch
    createReleaseBranch(newVersion, branches)
    
    // create release on GitHub if destination branch is main
    if (branches.includes('main') || branches.includes('master')) {
      createRelease()
    }
    
    // return to dev
    logs.sectionStart('Returning to initial branch')
    shell.exec('git checkout dev', { silent: true })
    
    logs.sectionEnd('Done')
  })

program.parse(process.argv)
