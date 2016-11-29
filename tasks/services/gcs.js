const storage = require('@google-cloud/storage');
const async = require('async');
const path = require('path');
const merge = require('deepmerge');
const mime = require('mime-types');

module.exports = function(grunt) {

  grunt.registerMultiTask('gcs', 'Deploy files to Google Cloud Storage', function () {

    let asyncTasks = [];
    const done = this.async();

    const options = this.options({
      gzip: true,
      headers: {},
      metadata: {},
      concurrent: 20
    });

    // Checks
    if (!options.project) {
      grunt.fail.warn('No project has been specified');
    }

    if (!options.bucket) {
      grunt.fail.warn('No bucket has been specified');
    }

    let storageOptions = {
      projectId: options.project
    };

    // Setup authentication
    if (options.keyFilename) {
      storageOptions.keyFilename = options.keyFilename;
    } else if (options.credentials && typeof options.credentials === 'object') {
      storageOptions.credentials = options.credentials;
    } else if (options.clientEmail && options.privateKey) {
      storageOptions.credentials = {
        client_email: options.clientEmail, // eslint-disable-line camelcase
        private_key: options.privateKey // eslint-disable-line camelcase
      };
    }

    // Create metadata object containing headers and additional metadata
    options.metadata = merge(options.headers, {
      metadata: options.metadata
    });

    const gcs = storage(storageOptions);

    const bucket = gcs.bucket(options.bucket);

    // Normalize file array
    let files = [];
    this.files.forEach((file) => {

      const cwd = file.cwd || '';

      files = files.concat(file.src.map((src) => {

        const s = path.join(cwd, src);
        const d = (cwd || file.src.length > 1) ? ((file.dest || '') + src) : file.dest || src;

        return {
          src: s,
          dest: d
        };

      }));

    });

    // Skip directories
    files = files.filter((file) => {
      return !grunt.file.isDir(file.src);
    });

    // Upload files
    files.forEach((file) => {
      asyncTasks.push((callback) => {

        // Set corrent content type
        let metadata = merge(options.metadata, {
          contentType: mime.contentType(path.extname(file.src))  || 'application/octet-stream'
        });

        bucket.upload(file.src, {
          destination: file.dest,
          gzip: options.gzip,
          metadata
        }, (err, file) => {
          if (err) {
            grunt.fail.warn(err);
          }

          grunt.log.ok(`Uploaded: ${file.metadata.name}`);

          callback();
        });

      });
    });

    async.parallelLimit(asyncTasks, options.concurrent, () => {
      done();
    });

  });

};
