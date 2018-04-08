# Documentation

### Validators
```js

// validators by input type
validator.validateOne('<input type="email"  value"invalid">');
validator.validateOne('<input type="number" value"invalid">');
validator.validateOne('<input type="tel"    value"invalid">');

// validators by html5 attributes
validator.validateOne('<input type="text" required>')
validator.validateOne('<input type="text" minlength="1" maxlength="3">')
validator.validateOne('<input type="text" pattern="^\\d*$">')

// validators by data attributes
validator.validateOne('<input type="text" data-rule-decimal="true">')
validator.validateOne('<input type="text" data-has-class="hello" class="hello">')

// add a custom message for an validator
validator.validateOne('<input type="text" required data-msg-required="required!">')
```

##### Custom valiators
```js
var validator = $('body').iValidator({
  rules: {
    helloWorld: function(validator, $element, value){
      if(!$element.data('rule-hello-world'))
        return true;

      return value == $element.data('rule-hello-world');
    }      
  },
  messages: {
    helloWorld: 'this is not "hello world"'    
  }
});

var invalidHelloWorld = '<input type="text" data-rule-hello-world="hello world" value="not hello world">';
$('body').append(invalidHelloWorld);

var result = validator.validateOne(invalidHelloWorld);
if(result !== true)
  console.log('invalid hello world from custom validator =)');

```

### Methods
##### validate(context = null)
  * calls `validateOne` for every element in `context`
  * `returns` array of erros or `true`
  * `context` can be a html string or jquery object
  * default `context` is the element you attached the `iValidator` to

##### validateOne(element)
  * `element` can be string or jquery object
  * `returns` array of erros or `true`
  * applies the `rules` on the element, this means:
    * adds handler for `keyup` and `focusout` etc. (detaches the old one)
    * adds class `valid` or `invalid` to element
    * if `invalid` it adds the error label to the parent element
    * if `valid` id removes the error label
    * sets a data attribute `data-invalid` after validation

##### reset(context = null) =>
  * calls `resetElement` for every element in `context`
  * `context` can be a html string or jquery object
  * default `context` is the element you attached the `iValidator` to

##### resetElement(element)
  * `element` can be string or jquery object
  * removes handler for `keyup` and `focusout`
  * removes `error`/`valid` class from element

##### elementsFor(context = null)
  * `returns` the elements that should be validated in `context`
  * uses `@config.selectors.elements`
  * ignores `@config.selectors.ignore`
  * `context` can be a html string or jquery object
  * default `context` is the element you attached the `iValidator` to

##### messageFor(name)
  * 1: look at `@config.messages[name]` for a message
  * 2: return `@config.messages.generic` as fallback
  _Note_: Only if a message is present a hint will be generated

### Configuration
```coffee
options:
  validateOnFocusOut: true
  validateOnKeyUp:    true    # validates only on key up when invalid before
  validateOnClick:    false
  focusOnInvalid:     true
  removeHintOnFocus:  false

selectors:
  elements: 'input, textarea, select'
  ignore:   ':hidden, [readonly]'

classes:
  invalid: 'invalid'
  valid:   'valid'
  hint:    'ivalidate-hint' # a hint gets also the valid or invalid class

messages:
  generic:   'invalid'
  email:     'invalid email'
  tel:       'invalid phone number'
  number:    'invalid number'
  minlength: 'to short'
  maxlength: 'to long'
  required:  'required'
  hasClass:  'missing class'

pattern:
  decimal: /^[\d\.]*$/
  number:  /^\d*$/
  tel:     /^[0-9/\-\+\s\(\)]*$/
  # coffeelint: disable
  email:   /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  # coffeelint: enable

rules:
  minlength: (validator, $element, value) ->
    return true unless $element.attr('minlength')
    ('' + value).length >= parseInt($element.attr('minlength'), 10)

  maxlength: (validator, $element, value) ->
    return true unless $element.attr('maxlength')
    ('' + value).length <= parseInt($element.attr('maxlength'), 10)

  required: (validator, $element, value) ->
    return true unless $element.attr('required')
    return false if value == undefined || value == null
    return !!value.length if typeof(value) in ['string', 'array' ]
    !!value

  number: (validator, $element, value) ->
    return true if $element.attr('type') != 'number' || !(''+value).length
    validator.config.pattern.number.test(value)

  tel: (validator, $element, value) ->
    return true if $element.attr('type') != 'tel' || !(''+value).length
    validator.config.pattern.tel.test(value)

  email: (validator, $element, value) ->
    return true if $element.attr('type') != 'email' || !(''+value).length
    validator.config.pattern.email.test(value)

  pattern: (validator, $element, value) ->
    return true if !$element.attr('pattern') || !(''+value).length
    (''+value).match($element.attr('pattern'))

  hasClass: (validator, $element, value) ->
    return true unless $element.data('rule-has-class')
    $element.hasClass($element.data('rule-has-class'))

  decimal: (validator, $element, value) ->
    return true unless $element.data('rule-decimal') || !(''+value).length
    validator.config.pattern.decimal.test(value)

handler:
  onReset:   null # (validator, $element) ->
  onValid:   null # (validator, $element) ->
  onInvalid: null # (validator, $element, errors) ->

  onGetValidMessage: (validator, $element) ->
    $element.data("msg-valid")

  onGetInvalidMessage: (validator, $element, errors) ->
    error   = errors[0]
    message = $element.data("msg-#{error.rule}")
    message || validator.messageFor(error.rule)

  onBuildHint: (validator, $element, result, message) ->
    classes    = validator.config.classes
    hintClass  = classes.hint
    validClass = if result == true then classes.valid else classes.invalid

    $("<label>", {
      class: hintClass + ' ' + validClass
      for:   $element.attr('id')
    }).html(message)

  onShowHint: (validator, $element, $newHint, $oldHint = null)  ->
    if $newHint
      $newHint.hide()
      $element.after($newHint)

    unless $oldHint
      $newHint.fadeIn() if $newHint
      return

    $oldHint.fadeOut(100, =>
      $newHint.fadeIn(100) if $newHint
      $oldHint.remove()
    )

```


### Override internal behaviour
It is very easy to override the internal behaviour as all specific logic is also implemented via `@config.handler`.

Have a look at the current implementation:
```coffee
@config.handler =
  onReset:   null # (validator, $element) ->
  onValid:   null # (validator, $element) ->
  onInvalid: null # (validator, $element, errors) ->

  onGetValidMessage: (validator, $element) ->
    $element.data("msg-valid")

  onGetInvalidMessage: (validator, $element, errors) ->
    error   = errors[0]
    message = $element.data("msg-#{error.rule}")
    message || validator.messageFor(error.rule)

  onBuildHint: (validator, $element, result, message) ->
    classes    = validator.config.classes
    hintClass  = classes.hint
    validClass = if result == true then classes.valid else classes.invalid

    $("<label>", {
      class: hintClass + ' ' + validClass
      for:   $element.attr('id')
    }).html(message)

  onShowHint: (validator, $element, $newHint, $oldHint = null)  ->
    if $newHint
      $newHint.hide()
      $element.after($newHint)

    unless $oldHint
      $newHint.fadeIn() if $newHint
      return

    $oldHint.fadeOut(100, =>
      $newHint.fadeIn(100) if $newHint
      $oldHint.remove()
    )

```

I think there is potential to implement this more elegant: [Contributing](CONTRIBUTING.md) =)

### Resources
  * [Readme](../README.md)
  * [Changelog](CHANGELOG.md)
  * [Contributing](CONTRIBUTING.md)
