const shell = require('shelljs')

const tags = shell.exec('git tag', { silent: true }).stdout.toString().split('\n')
const lastTag = tags[tags.length - 2]

console.log(tags, `Last tag: ${lastTag}`)

const title = process.argv[2] ?? lastTag

shell.exec(`gh release create ${lastTag} -d -t "${title}" bin`)
