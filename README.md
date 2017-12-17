# source repo for: jquery.formslider.github.io [![Build Status](https://travis-ci.org/creative-workflow/jquery.formslider.github.io.svg?branch=master)](https://travis-ci.org/creative-workflow/jquery.formslider.github.io)

###### Supports:
  * css styling with [sass](http://sass-lang.com/documentation/file.SASS_REFERENCE.html) and pre build helpers
  * javascript development with [coffee](http://coffeescript.org/)
  * html templating with a hacked [haml-coffee](https://github.com/easy-website-generator/haml-coffee)
  * custom and predefined haml helpers

###### Uses:
  * [Easy-Website-Generator](https://github.com/easy-website-generator/)
  * [Easy-Terminal-App](https://github.com/creative-workflow/easy-terminal-app)
  * [nodejs](https://nodejs.org/en/)
  * [gulp](https://github.com/gulpjs/gulp)
  * [browser-sync](https://browsersync.io/)


### Installation
First you need to install [nodeJs](https://nodejs.org/en/download/)

##### linux/osx instructions
Just run `./app setup` and `./app serve` to run the site in your webbrowser.

##### instructions for other plattforms
```
npm install -g easy-website-generator coffee-script yarn gulp coffeelint

yarn install

# see https://github.com/sass/node-sass/issues/1804
npm rebuild node-sass

ewg serve
```

### Commandline interface
```
Usage: ./app [command] [help|*]
Available commands:
 build                  build the docs files in production mode
 deploy                 deploy the docs folder to github.io
 help                   print help
 lint                   run code linter
 serve                  serve this repo in development mode
 setup                  setup dependencies for this application
```

### Ressources
> "[jquery.formslider](https://github.com/creative-workflow/jquery.formslider)"

> "[Easy-Website-Generator](https://github.com/easy-website-generator/)"

> "[Creative-Workflow](http://www.creative-workflow.berlin/company.html)"

> "[Easy-Terminal-App](https://github.com/creative-workflow/easy-terminal-app)"

> "[www.tomhanoldt.info](http://www.tomhanoldt.info)"
