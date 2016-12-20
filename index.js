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
var path = require('path')

module.exports = {
  schema: require('./schema.js'),

  defaultConfig: {
    resources: {}
  },

  preprocessConfig: function (config) {
    // Expand dirs into all recursive files
    return {
      resources: expandResources(config.resources)
    }
  },

  watched: function (config) {
    return _.values(config.resources)
  },

  /**
   * Run uglify and store the resulting JavaScript and Source-Map into the result object
   * @param config
   */
  run: function (config) {
    return _.mapValues(config.resources, function (filename) {
      return fs.createReadStream(filename)
    })
  }
}

/**
 * Expand resources that are directories into a file-resource for each file within this directory
 *
 * @param {Object<string>} resources
 * @returns {Array}
 */
function expandResources (resources) {
  var expanded = Object.keys(resources).map(function (prefix) {
    var basePath = path.normalize(resources[prefix])
    var result = readTreeOrFile(basePath)
      .then(function (files) {
        return files
          .map(path.normalize)
          .reduce(function (subresult, file) {
            subresult[prefix + file.substring(basePath.length)] = file
            return subresult
          }, {})
      })
    return result
  })
  // Merge expanded resources into a single array
  return Q.all(expanded)
    .then(function (fileSets) {
      return _.merge.apply(_, fileSets)
    })
}

/**
 * Return either a directory tree or the name of the file specified by the parameter
 */
function readTreeOrFile (filename) {
  return Q.ninvoke(fs, 'stat', filename)
    .then(function (stats) {
      if (stats.isFile()) {
        return [filename]
      } else if (stats.isDirectory()) {
        return qfs.listTree(filename, function (filename, stats) {
          return stats.isFile()
        })
      } else {
        throw new Error(filename + ' is neither a file nor a directory')
      }
    })
}
