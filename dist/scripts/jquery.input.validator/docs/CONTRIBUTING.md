# Contributing

## Issues
  * Report issues or feature requests on [GitHub Issues](https://github.com/creative-workflow/jquery.input.validator/issues).
  * If reporting a bug, please add a [simplified example](http://sscce.org/).

## Pull requests
  * Create a new topic branch for every separate change you make.
  * Create a test case if you are fixing a bug or implementing an important feature.
  * Make sure the build runs successfully.

## Development
### Tools
We use the following tools for development:

  * [Jasmine](http://jasmine.github.io) for tests.
  * [NodeJS](http://nodejs.org/download/) required to run grunt.
  * [Grunt](http://gruntjs.com/getting-started) for task management.

### Getting started
Install [NodeJS](http://nodejs.org/).  
Install globally grunt-cli using the following command:

    $ npm install -g grunt-cli bower

Browse to the project root directory and install the dev dependencies:

    $ npm install
    $ bower install

Check your installation with:

    $ npm run test


### Tasks
The following [Grunt](http://gruntjs.com/getting-started) tasks are available:

##### Run tests and linter
```bash
  * `npm run lint`
  * `npm run test`
  * `npm run test-all`            # runs tests agains jquery version >=1.10, >=2 and >=3
```

##### Generate build
```bash
  * `npm run build`               # creates a fresh `dist/` folder
  ```

##### Automatic release
```bash
  * `grunt release --tag=x.x.x`   # creates a fresh `dist/` folder
  * or `npm run release -- --tag=x.x.x` works also
```

### Resources
  * [Readme](../README.md)
  * [Documentation](DOCUMENTATION.md)
  * [Changelog](CHANGELOG.md)
