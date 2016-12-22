var customize = require('customize')
var path = require('path')
var write = require('customize-write-files')

// Load files from one directory and merge with second
customize()
  .registerEngine('assets', require('../'))
  // Add one assets directory
  .merge({
    assets: {
      directory: path.join(__dirname, './directory1')
    }
  })
  .merge({
    assets: {
      directory: path.join(__dirname, './directory2')
    }
  })
  .run()
  .then(write('target'))
  .done(console.log)
