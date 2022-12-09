const shell = require('shelljs')

// check if all is committed
const status = shell.exec('git status --porcelain', { silent: true }).stdout.toString().trim()
console.log(status)


// check branch is dev
const branch = shell.exec('git branch --show-current', { silent: true }).stdout.toString().trim()
