const shell = require('shelljs')
const { incrementVersion } = require('./utilities/incrementVersion')

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

// bump version
incrementVersion(process.argv[2])
