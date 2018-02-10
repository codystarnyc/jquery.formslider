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
  class: 'JqueryTracking',
  config: {
    initialize: true ,                  // initialize $.tracking(config) or not
    eventCategory: 'formslider',        // default category
    cookiePath:    '.example.com',      // domain for cookie saving
    adapter: [                          // configuration for the jquery.tracking plugin
      {
        class: 'JqueryTrackingGTagmanagerAdapter'  
      }
    ],

    trackFormSubmission: true,
    conversionErrorEvantName: 'conversion-error'
  }
  })
```

The Plugin will listen on 'track'-Events which will be triggerd from the plugins `TrackSessionInformationPlugin` and `TrackUserInteractionPlugin` (see [PLUGINS.md](https://github.com/formslider/jquery.formslider/blob/master/docs/PLUGINS.md#tracksessioninformationplugin)).

You can utilize this by simple doing:
```js
$('.my-formslider').formslider().events.trigger('track', name, value [, category=config.eventCategory]);
```

The plugin looks also for the plugin `FormSubmissionPlugin` and triggers conversion error or calls the `$.tracking.conversion()` method on success.

### Changelog
##### 1.1.0
  * rename `JqueryTrackingPlugin` -> `JqueryTracking` follow formslider 1.1 naming style
  * rename `listenOnFormSubmissionPlugin` -> `trackFormSubmission`

### Resources
  * https://github.com/formslider/jquery.formslider
  * https://github.com/formslider/formslider.jquery.tracking
  * https://github.com/creative-workflow/jquery.tracking
  * http://bower.io/search/?q=formslider.jquery.tracking

### Authors

  [Tom Hanoldt](https://www.tomhanoldt.info)
