/**
 * Returns a JSON-Schema for the configuration object.
 */
module.exports = {
  description: 'The configuration schema of the "customize-engine-assets"',
  type: 'object',
  properties: {
    'directory': {
      description: 'A source directory from which files are copied recursively to the target directory',
      type: 'string'
    },
    'glob': {
      description: 'A glob pattern that filters the files that are copied',
      type: 'string'
    }
  }
}
