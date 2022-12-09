module.exports = {
  sectionStart (message) {
    console.log(`\n-- ${message}...`)
  },
  
  sectionEnd (message) {
    console.log(`| ${message}!`)
  },
  
  error (message) {
    console.error(`[ERROR]: ${message}\n`)
  }
}
