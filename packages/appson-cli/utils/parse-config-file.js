const fs = require('fs')

module.exports = rcPath => {
  let file

  try {
    file = JSON.parse(fs.readFileSync(rcPath, 'utf8'))
  } catch (error) {
    file = null
  }

  return file
}
