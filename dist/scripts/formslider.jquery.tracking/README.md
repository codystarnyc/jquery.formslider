# formslider.jquery.tracking
This plugin adds jquery.tracking capabilities to jquery.fromslider.
## Installation
```bash
bower install formslider.jquery.tracking

# or

npm install formslider.jquery.tracking
```

## Include js dependencies
Load the following dependencies:
  * `[path_to_you_bower_components]/jquery.tracking/dist/jquery.tracking.min.js`
  * `[path_to_you_bower_components]/formslider.jquery.tracking/dist/formslider.jquery.tracking.min.js`

## Load the plugin
See [formslider](https://github.com/formslider/jquery.formslider) for more infos.

```js

formslider = $('.formslider-wrapper').formslider(
  [...]
);

formslider.plugins.load({
  class: 'JqueryTrackingPlugin',
  config: {
    initialize: true ,                  // initialize $.tracking(config) or not
    eventCategory: 'formslider',        // default category
    cookiePath:    '.example.com',      // domain for cookie saving
    adapter: [                          // configuration for the jquery.tracking plugin
      {
        class: 'JqueryTrackingGTagmanagerAdapter'  
      }
    ]
  }
  })
```


### Resources
  * https://github.com/formslider/jquery.formslider
  * https://github.com/formslider/formslider.jquery.tracking
  * https://github.com/creative-workflow/jquery.tracking
  * http://bower.io/search/?q=formslider.jquery.tracking

### Authors

  [Tom Hanoldt](https://www.tomhanoldt.info)
