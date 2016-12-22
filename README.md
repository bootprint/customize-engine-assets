# customize-engine-assets 

[![NPM version](https://badge.fury.io/js/customize-engine-assets.svg)](http://badge.fury.io/js/customize-engine-assets)
[![Travis Build Status](https://travis-ci.org/bootprint/customize-engine-assets.svg?branch=master)](https://travis-ci.org/bootprint/customize-engine-assets)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/customize-engine-assets.svg)](https://coveralls.io/r/bootprint/customize-engine-assets)


> Customize-engine to copy static assets to the target directory


# Installation

```
npm install customize-engine-assets
```

## Usage

The module makes only sense in combination with [customize-write-files](https://npmjs.com/package/customize-write-files)
Consider the following directory tree:

<pre><code>

├─┬ directory
│ ├── customize-logo-small.png
│ ├── file1.txt
│ └─┬ subdir
│   └── file2.txt
└─┬ directory2
  ├── file3.txt
  └─┬ subdir
    └── file2.txt
</code></pre>

The following example copies `directory1` to the `target` directory.

```js
var customize = require('customize')
var path = require('path')
var write = require('customize-write-files')

// Load files from one directory and merge with second
customize()
  .registerEngine('assets', require('customize-engine-assets'))
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
```

This examples copies the files from [examples/directory](examples/directory)
and [examples/directory2](examples/directory2) to [examples/target](examples/target)

The output of the example is 

```
[ 'target/file3.txt', 'target/subdir/file2.txt' ]
```

It's noteworthy that the example does not copy `directory1/subdir/file2.txt` and 
then overwrites the file with `directory2/subdir/file2.txt`. Instead, when
`.run()` is called, it is evaluated which file will actually be copied and then,
the engine returns a readable stream on the file, which is then used by
[customize-write-files](https://npmjs.com/package/customize-write-files) to copy to file to the target directory.



##  API-reference




## License

`customize-engine-assets` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).