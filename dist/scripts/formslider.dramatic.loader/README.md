# formslider.dramatic.loader
This plugin implements a very dramatic loader for jquery.formalider.
## Installation
```bash
bower install formslider.dramatic.loader

# or

npm install formslider.dramatic.loader
```

## Include js dependencies
Load the following dependencies:
  * `[path_to_you_bower_components]/jquery.animate.css/dist/jquery.animate.css.js`
  * `[path_to_you_bower_components]/formslider.dramatic.loader/dist/formslider.dramatic.loader.js`

In your sass file:
```sass
$use-bounce: true

@import "[path_to_bower_components]/creative-workflow.animate-sass/animate"
```

## Load the loader
See [formslider](https://github.com/formslider/jquery.formslider) for more infos.

```coffee
{
  class: 'DramaticLoader'
  config:
    duration: 2500
    finishAnimationDuration: 2500
    hideElementsOnHalf:      '.hide-on-half'
    showElementsOnHalf:      '.show-on-half'
    bounceOutOnHalf:         '.bounce-out-on-half'
    bounceDownOnNext:        '.bounce-down-on-enter'
}
```

### Changelog
##### 1.1.1
  * re publish

##### 1.1.0
  * loader are now direct subclasses of `AbstractFormsliderPlugin`
  * rename `DramaticLoaderIplementation` -> `DramaticLoader` follow formslider 1.1 naming style


### Resources
  * https://github.com/formslider/jquery.formslider
  * https://github.com/formslider/formslider.dramatic.loader
  * http://bower.io/search/?q=formslider.dramatic.loader

### Authors

  [Tom Hanoldt](https://www.tomhanoldt.info)
