# source repo for: formslider.github.io [![Build Status](https://travis-ci.org/formslider/formslider.github.io.src.svg?branch=master)](https://travis-ci.org/formslider/formslider.github.io.src)

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
npm install -g easy-website-generator yarn bower gulp coffeelint coffee-script

yarn install

bower install

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
  * [jquery.formslider](https://github.com/formslider/jquery.formslider/)
  * [Easy-Website-Generator](https://github.com/easy-website-generator/)
  * [Easy-Terminal-App](https://github.com/creative-workflow/easy-terminal-app)
  * [Creative-Workflow](https://github.com/creative-workflow)
  * [www.tomhanoldt.info](http://www.tomhanoldt.info)

# jquery.formslider [![Build Status](https://travis-ci.org/formslider/jquery.formslider.svg?branch=master)](https://travis-ci.org/formslider/jquery.formslider) [![Coverage Status](https://coveralls.io/repos/github/formslider/jquery.formslider/badge.svg)](https://coveralls.io/github/formslider/jquery.formslider) [![Code Climate](https://codeclimate.com/github/formslider/jquery.formslider/badges/gpa.svg)](https://codeclimate.com/github/formslider/jquery.formslider) [![npm](https://img.shields.io/npm/dt/jquery.formslider.svg)](https://www.npmjs.com/package/jquery.formslider) [![Beerpay](https://beerpay.io/formslider/jquery.formslider/badge.svg?style=flat)](https://beerpay.io/formslider/jquery.formslider)

[![NPM](https://nodei.co/npm/jquery.formslider.png)](https://nodei.co/npm/jquery.formslider/)

This jquery.formslider integrates a modified [Flexslider](https:gulp//github.com/formslider/FlexSlider) with logical slide pages that can have features and behaviors provided by plugins.

The main goal is to have different actions and policies triggered depending on what role the actual slide is. For example: You can stop going forward when a formula input is invalid.

The jquery.formslider runs in production, is performance optimized, full responsive and touch capable. You can easily write you own plugins and implement custom slide behaviors.

Check out the demo implementation: [formslider.github.io](https://formslider.github.io/).

## Installation
```bash
bower install jquery.formslider --save

# or

npm install -g bower
npm install jquery.formslider --save

# if you want to develop the source you also have to:

npm install gulp-cli -g

```

## Integration
Check out this guide: [INTEGRATION](docs/INTEGRATION.md).

Source code for a minmal setup without any styling: https://github.com/formslider/jquery.formslider.demo.

### Example use case
This is a typical use case for marketer customers journey:
  * you have a few **question slides** the user can answer and go forth and back
  * there is a **zipcode slide** the user can enter a 4-5 digit zipcode
  * the **loader slide** shows a loading animation while navigation is blocked
  * the **contact slide** collects contact information and submits them together with the answers
  * the **confirmation slide** shows error/success message and gives more deeplinks

This functionality is provided by core or optional plugins. You can also develop your own logical flow by extend, interact  or configure these plugins.

### List of bundeled (core-)plugins
```bash
# form plugins
  * AnswerClick                   # add answered classes and triggers track events
  * AnswerMemory                  # memorizes answers for later usage
  * FormSubmission                # submits a form if valid
  * InputFocus                    # focusses first input on current slide
  * InputNormalizer               # does some normalization on inputs
  * InputSync                     # syncs inputs with the same name
  * JqueryInputValidator          # Validates inputs, selects and textareas by html5 attributes.

# generic plugins
  * AddSlideClasses               # adds classes based on role and index
  * DoOnEvent                     # Generic plugin to for inline implementing a plugin.
  * DoOneTimeOnEvent              # run a callback first time a specific event occurs

# loader
  * SimpleLoader                  # controls a loading page with no user interaction allowed

# navigation controller           # controller can be stacked as they cancel the `controller.*` events when they succeed
  * BrowserHistoryController      # adds browser history entries and reacts on browser prev/next
  * NativeOrderController         # navigates prev/next by the native order of the slides
  * OrderByIdController           # navigates prev/next by next-id data attributes

# navigation plugins
  * DirectionPolicyByRole         # can prevent going forward or backward based on events and current/next roles
  * NavigateOnClick               # call next/prev if certain element clicked
  * NavigateOnKey                 # can trigger next/prev if enter or arrow keys pressed
  * TabIndexSetter                # fixes tab order on current visible slide, prevents jumping between slides

# progressbar  
  * ProgressBarPercent            # manages progress with percent progess
  * ProgressBarSteps              # manages progress with steps progress

# tracking
  * TrackSessionInformation       # triggers track events for useragent, device dimension etc.
  * TrackUserInteraction          # triggers track events for current/next page transition etc.

# view
  * EqualHeight                   # equalizes the height of elements
  * LazyLoad                      # load images from the next slides
  * LoadingState                  # manipulates loading classes on ready
  * ScrollUp                      # scrolls up if a question is not in viewport
  * SlideVisibility               # hides slides before and after current until transition is allowed
```

For a full list and detailed informations check out this guide: [PLUGINS](docs/PLUGINS.md)

### Write your own Plugin
Check out this guide: [EXTENDING](docs/EXTENDING.md)


### Advanced usage
Check out this guide: [FORMSLIDER](docs/FORMSLIDER.md)


### Dependencies
  * [jquery](https://jquery.com)
  * [jquery.debug](https://github.com/creative-workflow/jquery.debug)
  * [jquery-validation](https://github.com/jquery-validation/jquery-validation)
  * [js-cookie](https://github.com/js-cookie/js-cookie)
  * [js-url](https://github.com/websanova/js-url)
  * [Flexslider](https://github.com/formslider/FlexSlider)

### Resources
  * https://github.com/formslider/jquery.formslider
  * https://travis-ci.org/formslider/jquery.formslider
  * https://codeclimate.com/github/formslider/jquery.formslider
  * http://bower.io/search/?q=jquery.formslider


# Contributing

Check out the [Contributing Guidelines](docs/CONTRIBUTING.md)
