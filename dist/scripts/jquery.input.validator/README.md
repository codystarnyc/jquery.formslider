# jquery.input.validator [![Build Status](https://travis-ci.org/creative-workflow/jquery.input.validator.svg?branch=master)](https://travis-ci.org/creative-workflow/jquery.input.validator) [![Coverage Status](https://coveralls.io/repos/github/creative-workflow/jquery.input.validator/badge.svg)](https://coveralls.io/github/creative-workflow/jquery.input.validator) [![Contribute](https://img.shields.io/badge/Contribution-Open-brightgreen.svg)](CONTRIBUTING.md) [![Beerpay](https://beerpay.io/creative-workflow/jquery.input.validator/badge.svg?style=flat)](https://beerpay.io/creative-workflow/jquery.input.validator)

This [jquery](https://jquery.com) plugin helps to handle **html input validation** by applying rules to elements **based on html attributes**.

It is inspired by [jquery-validation](https://jqueryvalidation.org/) but has **less complexity**, **more comfort** and is easy adjustable for complex setups. Read more in the [Documentation](docs/DOCUMENTATION.md).

It has a high test coverage and is **tested with jquery >1.10, >2 and >3**

## Installation
```bash

bower install jquery.input.validator

# or

npm install jquery.input.validator

```    
## Integration
Insert the following dependencies into your html file:
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="[path_to_your_bower_components]/jquery.input.validator/dist/jquery.input.validator.min.js">
```

## Examples
### Local pattern
```js
$('form').iValidator({
  // custom configuration goes here
});

// validate all inputs in your form
var result = $('form').iValidator().validate();
if( result === true )
  console.log('all inputs valid');

// reset error hints
$('form').iValidator().reset();

// validate element
$('form').iValidator().validateOne(
                                    '<input type="email" value"invalid">'
                                  );
```

### Gobal pattern
```js
var validator = $('body').iValidator({
  // custom configuration goes here
});

// validate all inputs in your form
var result = validator.validate($('form'));
if( result === true )
  console.log('all inputs valid');

// reset the error messages
validator.reset($('form'));
```

### Builtin validators
Validators are triggered from one or more attributes on an input element.
```js
var validator = $('body').iValidator();

// validators by input type
validator.validateOne('<input type="email"  value"invalid">');
validator.validateOne('<input type="number" value"invalid">');
validator.validateOne('<input type="tel"    value"invalid">');

// validators by html5 attributes
validator.validateOne('<input type="text" required>');
validator.validateOne('<input type="text" minlength="1" maxlength="3">');
validator.validateOne('<input type="text" pattern="^\\d*$">');

// validators by data attributes
validator.validateOne('<input type="text" data-rule-decimal="true">');
validator.validateOne('<input type="text" data-has-class="hello" class="hello">');

// add a custom message for an validator
validator.validateOne('<input type="text" required data-msg-required="required!">');
```

# Customize it all :hearts:
All implementation specific logic can be replaced via config (see [Documentation](docs/DOCUMENTATION.md)).

# Resources
  * [Documentation](docs/DOCUMENTATION.md)
  * [Changelog](docs/CHANGELOG.md)
  * [Contributing](docs/CONTRIBUTING.md)

### Dependencies
  * [jquery](https://jquery.com) >=1.10.0 (also tested with >=2, >=3)

### Services
  * [on github.com](https://github.com/creative-workflow/jquery.input.validator)
  * [on bower.io](http://bower.io/search/?q=jquery.input.validator)
  * [on npmjs.org](https://www.npmjs.com/package/jquery.input.validator)
  * [build status](https://travis-ci.org/creative-workflow/jquery.input.validator)

### Authors
  [Tom Hanoldt](https://www.tomhanoldt.info)

## Support on Beerpay
Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/creative-workflow/jquery.input.validator/badge.svg?style=beer)](https://beerpay.io/creative-workflow/jquery.input.validator)  [![Beerpay](https://beerpay.io/creative-workflow/jquery.input.validator/make-wish.svg?style=flat)](https://beerpay.io/creative-workflow/jquery.input.validator?focus=wish)
