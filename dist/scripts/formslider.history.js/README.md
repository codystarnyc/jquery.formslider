# formslider.history.js
This plugin uses [history.js](https://github.com/browserstate/history.js/) for history manipulating and supports also older browsers and html4.
## Installation
```bash
bower install formslider.history.js

# or

npm install formslider.history.js
```

## Include js dependencies
Load the following dependencies:
  * `[path_to_you_bower_components]/history.js/scripts/bundled/html4+html5/native.history.js`
  * `[path_to_you_bower_components]/formslider.history.js/dist/formslider.history.js`

## Load the plugin
See [formslider](https://github.com/formslider/jquery.formslider) for more infos.

```coffee

formslider = $('.formslider-wrapper').formslider(
  ...
)

formslider.plugins.load({
  class: 'HistoryJsController',
  config:
    updateUrl: false
    resetStatesOnLoad: true
  })
```

### Changelog
##### 1.1.0
  * rename `HistoryJsPlugin` -> `HistoryJsController` follow formslider 1.1 naming style
  * memorize index

### Resources
  * https://github.com/formslider/jquery.formslider
  * https://github.com/formslider/formslider.history.js
  * http://bower.io/search/?q=formslider.history.js

### Authors

  [Tom Hanoldt](https://www.tomhanoldt.info)
