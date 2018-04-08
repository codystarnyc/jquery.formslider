(function() {
  var $,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.InputValidator = (function() {
    InputValidator.config = {
      options: {
        validateOnFocusOut: true,
        validateOnKeyUp: true,
        validateOnClick: false,
        focusOnInvalid: true,
        removeHintOnFocus: false
      },
      selectors: {
        elements: 'input, textarea, select',
        ignore: ':hidden, [readonly]'
      },
      classes: {
        invalid: 'invalid error',
        valid: 'valid',
        hint: 'ivalidate-hint'
      },
      messages: {
        generic: 'invalid',
        email: 'invalid email',
        tel: 'invalid phone number',
        number: 'invalid number',
        minlength: 'to short',
        maxlength: 'to long',
        required: 'required',
        hasClass: 'missing class'
      },
      pattern: {
        decimal: /^[\d\.]*$/,
        number: /^\d*$/,
        tel: /^[0-9\/\-\+\s\(\)]*$/,
        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      },
      rules: {
        minlength: function(validator, $element, value) {
          if (!$element.attr('minlength')) {
            return true;
          }
          return ('' + value).length >= parseInt($element.attr('minlength'), 10);
        },
        maxlength: function(validator, $element, value) {
          if (!$element.attr('maxlength')) {
            return true;
          }
          return ('' + value).length <= parseInt($element.attr('maxlength'), 10);
        },
        required: function(validator, $element, value) {
          var ref;
          if (!$element.attr('required')) {
            return true;
          }
          if (value === void 0 || value === null) {
            return false;
          }
          if ((ref = typeof value) === 'string' || ref === 'array') {
            return !!value.length;
          }
          return !!value;
        },
        number: function(validator, $element, value) {
          if ($element.attr('type') !== 'number' || !('' + value).length) {
            return true;
          }
          return validator.config.pattern.number.test(value);
        },
        tel: function(validator, $element, value) {
          if ($element.attr('type') !== 'tel' || !('' + value).length) {
            return true;
          }
          return validator.config.pattern.tel.test(value);
        },
        email: function(validator, $element, value) {
          if ($element.attr('type') !== 'email' || !('' + value).length) {
            return true;
          }
          return validator.config.pattern.email.test(value);
        },
        pattern: function(validator, $element, value) {
          if (!$element.attr('pattern') || !('' + value).length) {
            return true;
          }
          return ('' + value).match($element.attr('pattern'));
        },
        hasClass: function(validator, $element, value) {
          if (!$element.data('rule-has-class')) {
            return true;
          }
          return $element.hasClass($element.data('rule-has-class'));
        },
        decimal: function(validator, $element, value) {
          if (!($element.data('rule-decimal') || !('' + value).length)) {
            return true;
          }
          return validator.config.pattern.decimal.test(value);
        }
      },
      handler: {
        onReset: null,
        onValid: null,
        onInvalid: null,
        onGetValidMessage: function(validator, $element) {
          return $element.data("msg-valid");
        },
        onGetInvalidMessage: function(validator, $element, errors) {
          var error, message;
          error = errors[0];
          message = $element.data("msg-" + error.rule);
          return message || validator.messageFor(error.rule);
        },
        onBuildHint: function(validator, $element, result, message) {
          var classes, hintClass, validClass;
          classes = validator.config.classes;
          hintClass = classes.hint;
          validClass = result === true ? classes.valid : classes.invalid;
          return $("<label>", {
            "class": hintClass + ' ' + validClass,
            "for": $element.attr('id')
          }).html(message);
        },
        onShowHint: function(validator, $element, $newHint, $oldHint) {
          if ($oldHint == null) {
            $oldHint = null;
          }
          if ($newHint) {
            $newHint.hide();
            $element.after($newHint);
          }
          if (!$oldHint) {
            if ($newHint) {
              $newHint.fadeIn();
            }
            return;
          }
          return $oldHint.fadeOut(100, function() {
            if ($newHint) {
              $newHint.fadeIn(100);
            }
            return $oldHint.remove();
          });
        },
        onShowHintForTesting: function(validator, $element, $newHint, $oldHint) {
          if ($oldHint == null) {
            $oldHint = null;
          }
          if ($newHint) {
            $element.after($newHint);
          }
          if ($oldHint) {
            return $oldHint.remove();
          }
        }
      }
    };

    function InputValidator(context1, config) {
      this.context = context1;
      if (config == null) {
        config = {};
      }
      this.onProcessHints = bind(this.onProcessHints, this);
      this.onInvalid = bind(this.onInvalid, this);
      this.onValid = bind(this.onValid, this);
      this.shouldBeValidated = bind(this.shouldBeValidated, this);
      this.isSingle = bind(this.isSingle, this);
      this.messageFor = bind(this.messageFor, this);
      this.elementsFor = bind(this.elementsFor, this);
      this.resetElement = bind(this.resetElement, this);
      this.reset = bind(this.reset, this);
      this.validateOne = bind(this.validateOne, this);
      this.validate = bind(this.validate, this);
      this.prepareElements = bind(this.prepareElements, this);
      this.init = bind(this.init, this);
      this.config = this.constructor.config;
      this.init(config, this.context);
      this.version = '1.0.15';
    }

    InputValidator.prototype.init = function(config, context) {
      if (context == null) {
        context = null;
      }
      if (config) {
        this.config = jQuery.extend(true, {}, this.config, config);
      }
      this.elementsSelector = this.config.selectors.elements;
      this.ns = 'ivalidator';
      return this.prepareElements(context);
    };

    InputValidator.prototype.prepareElements = function(context) {
      var $elements;
      if (context == null) {
        context = null;
      }
      if (context == null) {
        context = this.context;
      }
      $elements = this.elementsFor(context);
      if (this.config.options.validateOnFocusOut) {
        $elements.off("focusout." + this.ns).on("focusout." + this.ns, (function(_this) {
          return function(e) {
            return _this.validateOne(e.target);
          };
        })(this));
      }
      if (this.config.options.removeHintOnFocus) {
        $elements.off("focus." + this.ns).on("focus." + this.ns, (function(_this) {
          return function(e) {
            return _this.resetElement(e.target);
          };
        })(this));
      }
      if (this.config.options.validateOnKeyUp) {
        $elements.off("keyup." + this.ns).on("keyup." + this.ns, (function(_this) {
          return function(e) {
            if ($(e.target).data('invalid')) {
              return _this.validateOne(e.target);
            }
          };
        })(this));
      }
      if (this.config.options.validateOnClick) {
        return $elements.off("click." + this.ns).on("click." + this.ns, (function(_this) {
          return function(e) {
            return _this.validateOne(e.target);
          };
        })(this));
      }
    };

    InputValidator.prototype.validate = function(context) {
      var $elements, element, errors, i, len, ref, result;
      if (context == null) {
        context = null;
      }
      errors = [];
      $elements = this.elementsFor(context);
      ref = $elements.get();
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        result = this.validateOne(element);
        if (result !== true) {
          errors = errors.concat(result);
        }
      }
      if (errors.length) {
        if (this.config.options.focusOnInvalid) {
          $elements.first().focus();
        }
        return errors;
      }
      return true;
    };

    InputValidator.prototype.validateOne = function(element) {
      var $element, errors, name, ref, rule, value;
      $element = $(element);
      value = $element.val();
      errors = [];
      ref = this.config.rules;
      for (name in ref) {
        rule = ref[name];
        if (!rule(this, $element, value)) {
          errors.push({
            element: $element,
            rule: name,
            value: value
          });
        }
      }
      if (errors.length === 0) {
        this.onValid($element);
        return true;
      }
      this.onInvalid($element, errors);
      return errors;
    };

    InputValidator.prototype.reset = function(context) {
      var element, i, len, ref, results;
      if (context == null) {
        context = null;
      }
      ref = this.elementsFor(context);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        results.push(this.resetElement(element));
      }
      return results;
    };

    InputValidator.prototype.resetElement = function(element) {
      var $element, base;
      $element = $(element);
      if (typeof (base = this.config.handler).onReset === "function") {
        base.onReset(this, $element);
      }
      $element.removeClass(this.config.classes.invalid + " " + this.config.classes.valid);
      $($element.data('ivalidator-hint')).remove();
      return $element.data('ivalidator-hint', null);
    };

    InputValidator.prototype.elementsFor = function(context) {
      if (context == null) {
        context = null;
      }
      if (context == null) {
        context = this.context;
      }
      if (this.isSingle(context)) {
        return $(context);
      }
      return $(this.elementsSelector, context).not(this.config.selectors.ignore);
    };

    InputValidator.prototype.messageFor = function(name) {
      var ref;
      if ((ref = this.config.messages) != null ? ref[name] : void 0) {
        return this.config.messages[name];
      }
      return this.config.messages.generic;
    };

    InputValidator.prototype.isSingle = function(input) {
      return $(input).is(this.elementsSelector);
    };

    InputValidator.prototype.shouldBeValidated = function(input) {
      return $(input).is(this.elementsSelector) && !$(input).is(this.ignoreSelector);
    };

    InputValidator.prototype.onValid = function($element) {
      var base;
      $element.data('invalid', false).data('errors', null).attr('aria-invalid', 'false').removeClass(this.config.classes.invalid).addClass(this.config.classes.valid);
      this.onProcessHints($element, true);
      return typeof (base = this.config.handler).onValid === "function" ? base.onValid(this, $element) : void 0;
    };

    InputValidator.prototype.onInvalid = function($element, errors) {
      var base;
      $element.data('invalid', true).data('errors', errors).attr('aria-invalid', 'true').removeClass(this.config.classes.valid).addClass(this.config.classes.invalid);
      this.onProcessHints($element, errors);
      return typeof (base = this.config.handler).onInvalid === "function" ? base.onInvalid(this, $element, errors) : void 0;
    };

    InputValidator.prototype.onProcessHints = function($element, result) {
      var $newHint, $oldHint, message;
      $oldHint = $element.data('ivalidator-hint');
      $newHint = null;
      if (result === true) {
        message = this.config.handler.onGetValidMessage(this, $element);
      } else {
        message = this.config.handler.onGetInvalidMessage(this, $element, result);
      }
      if (message) {
        $newHint = this.config.handler.onBuildHint(this, $element, result, message);
      }
      $element.data('ivalidator-hint', $newHint);
      return this.config.handler.onShowHint(this, $element, $newHint, $oldHint);
    };

    return InputValidator;

  })();

  if (typeof jQuery !== 'undefined') {
    $ = jQuery;
    jQuery.fn.iValidator = function(config) {
      var $this, instance;
      if (config == null) {
        config = null;
      }
      $this = $(this);
      instance = $this.data('ivalidator');
      if (!instance || config !== null) {
        $this.data('ivalidator', new InputValidator($this, config || {}));
        instance = $this.data('ivalidator');
      }
      return instance;
    };
  }

}).call(this);

//# sourceMappingURL=jquery.input.validator.js.map
