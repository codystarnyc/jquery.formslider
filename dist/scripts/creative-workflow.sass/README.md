# creative-workflow/lib-sass

### Setup
```
bower install --save creative-workflow.sass

or

composer require creative-workflow/sass

or


git submodule add https://github.com/creative-workflow/lib-sass.git ./wordpress/wp-content/themes/child/lib/cw/sass
```


##### hallo-world/css/module.sass
```sass
@import "variables"

@import "mixins/css/css3"
@import "mixins/css/positioning"
@import "mixins/helper/helper"

@import "mixins/grid/mediaqueries"
@import "mixins/grid/grid"

@import "mixins/wordpress/divi"
@import "mixins/wordpress/post"


+custom-divi-module('cw-module-hallo-world')
  .image
    display: none
    +min-width-sm
      +block
      +absolute
      right: -40px
      bottom: 0

  .content-wrapper
    [...]
```
