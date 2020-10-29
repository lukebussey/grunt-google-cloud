# grunt-google-cloud

> A Grunt plugin which acts as a wrapper for [google-cloud](https://github.com/GoogleCloudPlatform/google-cloud-node).

## Getting Started
This plugin requires Grunt `^1.0.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-google-cloud --save-dev
```

Once the plugin has been installed, it may be enabled as so inside your Gruntfile:

```js
grunt.loadNpmTasks('grunt-google-cloud');
```

## Supported Services

The first version of this plugin current only supports [Google Cloud Storage](#google-cloud-storage).

## Google Cloud Storage

Uploads files to the specified bucket.

### Usage
In your project's Gruntfile, add a section named `gcs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gcs: {
    options: {
      keyFilename: 'googlecloud.json',
      project: 'my-project-id',
      bucket: 'my-bucket-name',
      gzip: true,
      headers: {
        cacheControl: 'public, max-age=600'
      },
      metadata: {
        'surrogate-key': 'gcs'
      }
    },
    dist: {
      cwd: 'dist',
      src: '**'
    },
  },
});
```

### Authentication

Authentication is provided by one of three methods. You can choose to provide either the path to your key file, the contents of your key file, or the `client_email` and `private_key` from within your key file. Please only use one of the three.

#### `options.keyFilename` (String)

The path to your key file. [More information on key files](https://github.com/GoogleCloudPlatform/google-cloud-node#authentication).

#### `options.credentials` (Object)

The contents of your key file. E.g.

```js
options: {
  credentials: grunt.file.readJSON('credentials.json'),`
}
```

#### `options.clientEmail` (String)

The `client_email` key from your key file.

#### `options.privateKey` (String)

The `private_key` key from your key file.

### Options

#### `options.project` (String)

The id of your project. Required.

#### `options.bucket` (String)

The name of your bucket. Required.

#### `options.gzip` (Boolean)

Automatically gzip the file. Default `true`.

#### `options.headers` (Object)

An object containing any of the following keys: `cacheControl`, `contentDisposition`, `contentEncoding` or `contentLanguage`. Default `{}`.

#### `options.metadata` (Object)

An object containing additional metadata to set. Default `{}`.

#### `options.concurrent` (Integer)

Concurrent uploads to run. Default `20`.

#### `options.resumable` (Boolean)

Defines if uploads should be resumable or not. Default `true`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

To aid in development, create a file named `local-options.json` with the following contents:

```json
{
  "project": "",
  "bucket": "",
  "keyFilename": "",
  "testFiles": ""
}
```
This file will be read by Grunt and not be tracked by Git.
