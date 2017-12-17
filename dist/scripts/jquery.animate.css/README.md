# jquery.animate.css [![Build Status](https://travis-ci.org/creative-workflow/jquery.animate.css.svg?branch=master)](https://travis-ci.org/creative-workflow/jquery.animate.css) [![Code Climate](https://codeclimate.com/github/creative-workflow/jquery.animate.css/badges/gpa.svg)](https://codeclimate.com/github/creative-workflow/jquery.animate.css)

This package makes the usage of the beautiful [https://daneden.github.io/animate.css/](animate.css) very easy by bundling [animate-sass](https://github.com/tgdev/animate-sass) for selective animation style including and a jQuery plugin for easy usage on your website.

Save bandwith and time =)

## Installation
```bash
$ bower install jquery.animate.css --save
```
or
```
$ npm install jquery.animate.css --save
```

## Import into sass

You have to include the animate-sass into your sass sources and enable the animations you want to use later on your website.

A typical sass file looks like:
```sass
// $use-all: true

$use-bounce: true

@import "[path_to_bower_components]/creative-workflow.animate-sass/animate"
```

*Note: For all configurations look at the file [path_to_bower_components]/animate-sass/helpers/_settings.scss*

## Include in your website

Just load the javascript file  `[path_to_bower_components]/jquery.animate.css/dist/jquery.animate.css.js`.

*Note: Dont't forgett to include your compiled css file ^^.*

## Usage in javascript
```javascript
$('img').fadeOut(500)
        .animateCss('bounceOut', 500);
```

## methods
### animateCss: (animateCssAnimation, [duration=400], [complete=null])

Triggers an [animate.css](https://daneden.github.io/animate.css/) animation included by sass-animate.

  * **animateCssAnimation**: The animation that should be triggered.
  * **duration**: Animation duration in milli seconds.
  * **complete**: An optional callback function when animation finishes.

### Dependencies
  * [animate.css](https://github.com/daneden/animate.css/)
  * [creative-workflow/animate-sass](https://github.com/creative-workflow/animate-sass)
  * [sass](http://sass-lang.com/)
  * [jquery](https://jquery.com)

### Resources
  * https://github.com/creative-workflow/jquery.animate.css
  * https://travis-ci.org/creative-workflow/jquery.animate.css
  * https://codeclimate.com/github/creative-workflow/jquery.animate.css
  * http://bower.io/search/?q=jquery.animate.css
  * https://www.npmjs.com/search?q=jquery.animate.css

### Authors

  [Tom Hanoldt](https://www.tomhanoldt.info)

# Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)
