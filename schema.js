/**
 * Returns a JSON-Schema for the configuration object.
 */
module.exports = {
  description: 'The configuration schema of the "customize-engine-assets"',
  type: 'object',
  properties: {
    'files': {
      description: 'A target-source mapping of files to copy to the target folder. The key is the path of the file in the target directory',
      additionalProperties: {
        type: 'string',
        description: 'The path to the source-file.'
      }
    },
    'directories': {
      description: 'A target-source mapping of directories to recursively copy to the target folder. The key is the base path within the target directory',
      additionalProperties: {
        type: 'string',
        description: 'The directory that should be copied to the target path.'
      }
    }
  }
}
