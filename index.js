/*!
 * customize-engine-uglify <https://github.com/nknapp/customize-engine-uglify>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */
'use strict'

var _ = require('lodash')
var fs = require('fs')
var Q = require('q')
var qfs = require('m-io/fs')
var readFiles = require('customize/helpers-io').readFiles
var path = require('path')

module.exports = {
  schema: require('./schema.js'),

  defaultConfig: {
    files: {}
  },

  preprocessConfig: function (config) {
    // Expand dirs into all recursive files
    return {
      files: readFiles(config.directory, { stream: true, glob: config.glob })
    }
  },

  watched: function (config) {
    return [ config.directory ]
  },

  /**
   *
   * @param config
   */
  run: function (config) {
    return _.mapValues(config.files, _.property('contents'))
  }
}
