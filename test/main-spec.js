/*!
 * customize-engine-assets <https://github.com/bootprint/customize-engine-uglify>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global beforeEach */
/* global it */
// /* global xdescribe */
// /* global xit */

'use strict'

var chai = require('chai')
var expect = chai.expect
var deep = require('deep-aplus')(require('q').Promise)

var path = require('path')
var customize = require('customize')
var qfs = require('m-io/fs')
var _ = require('lodash')
var streamToString = require('stream-to-string')
var tmpDir = path.join(__dirname, 'tmp')

beforeEach(function () {
  return qfs.removeTree(tmpDir)
    .then(function () {
      return qfs.makeTree(tmpDir)
    })
})

/**
 * Convert all streams to strings
 * @param {{ assets: Object<stream.Readable>}} customizeResult the result of Customize using the assets-engine under the name "assets"
 */
function convertToStrings (customizeResult) {
  return deep(_.mapValues(customizeResult.assets, bufferStreamOrStringToString))
}

function bufferStreamOrStringToString (contents) {
  // Ignore undefined contents
  if (contents == null) {
    return
  }
  if (typeof contents === 'string' || Buffer.isBuffer(contents)) {
    return contents.toString('utf-8')
  } else if (typeof contents.pipe === 'function') {
    return streamToString(contents)
  } else {
    throw new Error('Invalid data type for contents of file: ' + contents)
  }
}

describe('customize-engine-assets:', function () {
  it('should copy files and directories', function () {
    return customize()
      .registerEngine('assets', require('../'))
      .merge({
        assets: {
          resources: {
            'a/a.txt': './test/fixtures/a.txt',
            'b.txt': './test/fixtures/b.txt',
            'dir1': './test/fixtures/dir1',
            'dir2': './test/fixtures/dir2'
          }
        }
      })
      .run()
      .then(convertToStrings)
      .then(function (tree) {
        return expect(tree, 'Checking directory tree').to.deep.equal({
          'a/a.txt': 'a',
          'b.txt': 'b',
          'dir1/eins.txt': 'eins',
          'dir1/einsA.txt': 'einsA',
          'dir2/zwei.txt': 'zwei',
          'dir2/zweiA.txt': 'zweiA'
        })
      })
  })

  it('should overrid files and directories', function () {
    return customize()
      .registerEngine('assets', require('../'))
      .merge({
        assets: {
          resources: {
            'a/a.txt': './test/fixtures/a.txt',
            'b.txt': './test/fixtures/b.txt',
            'dir1': './test/fixtures/dir1',
            'dir2': './test/fixtures/dir2'
          }
        }
      })
      .merge({
        assets: {
          resources: {
            'a/a.txt': './test/fixtures/a-override.txt',
            'dir1': './test/fixtures/dir1Override'
          }
        }
      })
      .run()
      .then(convertToStrings)
      .then(function (tree) {
        return expect(tree, 'Checking directory tree').to.deep.equal({
          'a/a.txt': 'a-override',
          'b.txt': 'b',
          'dir1/eins.txt': 'einsOverride',
          'dir1/einsA.txt': 'einsA',
          'dir2/zwei.txt': 'zwei',
          'dir2/zweiA.txt': 'zweiA'
        })
      })
  })
})
