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
const { exportVersion } = require('./utilities/exportVersion')
const { getCurrentVersion } = require('./utilities/getCurrentVersion')
const fs = require('fs')
const path = require('path')

program.name('ghp')
  .description('Script for publishing a project and creating a release')
  .version(readStoredVersion())
  .argument('[versionIncrement]', 'The version increment. Valid increments are: \'major\', \'minor\', \'patch\'')
  .option('-b, --branch <destinationBranch>', 'Branch where the release will be created', 'staging')
  .option('-r, --onlyRelease', 'Create only the release', false)
  .option('-e, --exportVersion <filePath>', 'Creates a simple file with the new version in the specified Path.')
  .option('-oe, --onlyExportVersion <filePath>', 'Creates ONLY a file in the new version in the specified Path.')
  .option('--ignoreUncommitted', 'Execute the command and ignores if any uncommitted file ', false)
  /**
   * @param {string} versionIncrement
   * @param {{branch: string, onlyRelease: boolean, ignoreUncommitted: boolean, exportVersion: string, onlyExportVersion: string}} options
   */
  .action((versionIncrement, options) => {
    const branches = options.branch.split(',')
    
    if (options.onlyExportVersion) {
      exportVersion(getCurrentVersion(), options.onlyExportVersion)
      
      return
    }
    
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
    const newVersion = incrementVersion(versionIncrement, options.exportVersion)
    
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

function readStoredVersion () {
  const versionFile = fs.readFileSync(path.resolve(__dirname, './version'), 'utf8')
  
  return versionFile
}
