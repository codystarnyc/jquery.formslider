(function() {
  var $, EventManager, Logger, instance,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  this.DriverFlexslider = (function() {
    DriverFlexslider.config = {
      selector: '.formslider > .slide',
      animation: 'slide',
      animationSpeed: 200,
      smoothHeight: true,
      useCSS: true,
      directionNav: false,
      controlNav: false,
      slideshow: false,
      keyboard: false,
      animationLoop: false
    };

    function DriverFlexslider(container, config1, onBefore, onAfter, onReady) {
      this.container = container;
      this.config = config1;
      this.onBefore = onBefore;
      this.onAfter = onAfter;
      this.onReady = onReady;
      this._internOnAfter = bind(this._internOnAfter, this);
      this._internOnBefore = bind(this._internOnBefore, this);
      this._internOnReady = bind(this._internOnReady, this);
      this.index = bind(this.index, this);
      this.goto = bind(this.goto, this);
      this.config = ObjectExtender.extend({}, DriverFlexslider.config, this.config);
      this.config.after = this._internOnAfter;
      this.config.conditionalBefore = this._internOnBefore;
      this.config.start = this._internOnReady;
      this.slides = $(this.config.selector, this.container);
      this.container.flexslider(this.config);
      this.instance = this.container.data('flexslider');
    }

    DriverFlexslider.prototype.goto = function(indexFromZero) {
      return this.container.flexslider(indexFromZero, true, true);
    };

    DriverFlexslider.prototype.index = function() {
      return this.instance.currentSlide;
    };

    DriverFlexslider.prototype._internOnReady = function(slider) {
      return setTimeout((function(_this) {
        return function() {
          $(window).trigger('resize');
          return _this.onReady();
        };
      })(this), 10);
    };

    DriverFlexslider.prototype._internOnBefore = function(currentIndex, direction, nextIndex) {
      var result;
      result = this.onBefore(currentIndex, direction, nextIndex);
      if (result === false) {
        return result;
      }
      if (this.config.useCSS) {
        return this.start = +new Date();
      }
    };

    DriverFlexslider.prototype._internOnAfter = function(slider) {
      if (slider.lastSlide === slider.currentSlide) {
        return;
      }
      if (!this.config.useCSS) {
        return this.onAfter();
      }
      return setTimeout(this.onAfter, this.config.animationSpeed - ((+new Date()) - this.start));
    };

    return DriverFlexslider;

  })();

  this.AbstractFormsliderPlugin = (function() {
    function AbstractFormsliderPlugin(formslider, config) {
      this.formslider = formslider;
      this.slideById = bind(this.slideById, this);
      this.slideByRole = bind(this.slideByRole, this);
      this.slideByIndex = bind(this.slideByIndex, this);
      this.index = bind(this.index, this);
      this.track = bind(this.track, this);
      this.trigger = bind(this.trigger, this);
      this.isCanceled = bind(this.isCanceled, this);
      this.cancel = bind(this.cancel, this);
      this.off = bind(this.off, this);
      this.on = bind(this.on, this);
      this.configWithDataFrom = bind(this.configWithDataFrom, this);
      this.config = ObjectExtender.extend({}, this.constructor.config, config);
      this.container = this.formslider.container;
      this.slides = this.formslider.slides;
      this.events = this.formslider.events;
      this.logger = new Logger("jquery.formslider::" + this.constructor.name);
      this.init();
    }

    AbstractFormsliderPlugin.prototype.init = function() {
      return null;
    };

    AbstractFormsliderPlugin.prototype.configWithDataFrom = function(element) {
      var $element, config, data, key, value;
      config = ObjectExtender.extend({}, this.config);
      $element = $(element);
      for (key in config) {
        value = config[key];
        data = $element.data(key);
        if (data !== void 0) {
          config[key] = data;
        }
      }
      return config;
    };

    AbstractFormsliderPlugin.prototype.on = function(eventName, callback) {
      return this.events.on(eventName + "." + this.constructor.name, callback);
    };

    AbstractFormsliderPlugin.prototype.off = function(eventName) {
      return this.events.off(eventName + "." + this.constructor.name);
    };

    AbstractFormsliderPlugin.prototype.cancel = function(event) {
      return this.events.cancel(event);
    };

    AbstractFormsliderPlugin.prototype.isCanceled = function(event) {
      return this.events.isCanceled(event);
    };

    AbstractFormsliderPlugin.prototype.trigger = function() {
      var ref;
      return (ref = this.events).trigger.apply(ref, arguments);
    };

    AbstractFormsliderPlugin.prototype.track = function(source, value, category) {
      if (category == null) {
        category = null;
      }
      return this.events.trigger('track', source, value, category);
    };

    AbstractFormsliderPlugin.prototype.index = function() {
      return this.formslider.index();
    };

    AbstractFormsliderPlugin.prototype.slideByIndex = function(indexFromZero) {
      if (indexFromZero == null) {
        indexFromZero = null;
      }
      if (indexFromZero === null) {
        indexFromZero = this.index();
      }
      return this.slides.get(indexFromZero);
    };

    AbstractFormsliderPlugin.prototype.slideByRole = function(role) {
      return $(".slide-role-" + role, this.container);
    };

    AbstractFormsliderPlugin.prototype.slideById = function(id) {
      return $(".slide-id-" + id, this.container);
    };

    return AbstractFormsliderPlugin;

  })();

  this.AnswerClick = (function(superClass) {
    extend(AnswerClick, superClass);

    function AnswerClick() {
      this.onAnswerClicked = bind(this.onAnswerClicked, this);
      this.init = bind(this.init, this);
      return AnswerClick.__super__.constructor.apply(this, arguments);
    }

    AnswerClick.prototype.init = function() {
      return this.container.on('mouseup', this.config.answerSelector, this.onAnswerClicked);
    };

    AnswerClick.prototype.onAnswerClicked = function(event) {
      var $allAnswersinRow, $answer, $answerInput, $answerRow, $questionInput, $slide;
      event.preventDefault();
      $answer = $(event.currentTarget);
      $answerRow = $answer.closest(this.config.answersSelector);
      $allAnswersinRow = $(this.config.answerSelector, $answerRow);
      $allAnswersinRow.removeClass(this.config.answerSelectedClass);
      $answer.addClass(this.config.answerSelectedClass);
      $slide = this.slideByIndex();
      $questionInput = $(this.config.questionSelector, $slide);
      $answerInput = $('input', $answer);
      return this.trigger('question-answered', $questionInput.prop('id'), $answerInput.prop('id'), $answerInput.val(), this.index());
    };

    return AnswerClick;

  })(AbstractFormsliderPlugin);

  this.AnswerMemory = (function(superClass) {
    extend(AnswerMemory, superClass);

    function AnswerMemory() {
      this.memorize = bind(this.memorize, this);
      this.init = bind(this.init, this);
      return AnswerMemory.__super__.constructor.apply(this, arguments);
    }

    AnswerMemory.prototype.init = function() {
      this.on('question-answered', this.memorize);
      return this.memoryByQuestionId = {};
    };

    AnswerMemory.prototype.memorize = function(event, questionId, answerId, value) {
      this.memoryByQuestionId[questionId] = {
        id: answerId,
        value: value
      };
      return this.trigger('answer-memory-updated', this.memoryByQuestionId);
    };

    return AnswerMemory;

  })(AbstractFormsliderPlugin);

  this.FormSubmission = (function(superClass) {
    extend(FormSubmission, superClass);

    function FormSubmission() {
      this.onFail = bind(this.onFail, this);
      this.onDone = bind(this.onDone, this);
      this.onSubmit = bind(this.onSubmit, this);
      this.init = bind(this.init, this);
      return FormSubmission.__super__.constructor.apply(this, arguments);
    }

    FormSubmission.config = {
      submitOnEvents: ['validation.valid.contact'],
      successEventName: 'form-submitted',
      errorEventName: 'form-submission-error',
      loadHiddenFrameOnSuccess: null,
      formSelector: 'form',
      submitter: {
        "class": 'FormSubmitterSubmit'
      }
    };

    FormSubmission.prototype.init = function() {
      var SubmitterClass, eventName, j, len, ref;
      this.form = $(this.config.formSelector);
      ref = this.config.submitOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onSubmit);
      }
      SubmitterClass = window[this.config.submitter["class"]];
      return this.submitter = new SubmitterClass(this, this.config.submitter, this.form);
    };

    FormSubmission.prototype.onSubmit = function(event, currentSlide) {
      if (this.isCanceled(event)) {
        return;
      }
      return this.submitter.submit(event, currentSlide);
    };

    FormSubmission.prototype.onDone = function() {
      this.trigger(this.config.successEventName);
      this.loadHiddenFrameOnSuccess();
      return this.logger.debug('onDone');
    };

    FormSubmission.prototype.onFail = function() {
      this.logger.error('onFail', this.config.errorEventName);
      return this.trigger(this.config.errorEventName);
    };

    FormSubmission.prototype.loadHiddenFrameOnSuccess = function(url) {
      var ref;
      if (!((ref = this.config) != null ? ref.loadHiddenFrameOnSuccess : void 0)) {
        return;
      }
      return $('<iframe>', {
        src: this.config.loadHiddenFrameOnSuccess,
        id: 'formslider_conversion_frame',
        frameborder: 0,
        scrolling: 'no'
      }).css({
        width: 0,
        height: 0
      }).appendTo('body');
    };

    return FormSubmission;

  })(AbstractFormsliderPlugin);

  this.FormSubmitterAbstract = (function() {
    function FormSubmitterAbstract(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.supressNaturalFormSubmit = bind(this.supressNaturalFormSubmit, this);
      this.config = ObjectExtender.extend({}, this.constructor.config, this.config);
    }

    FormSubmitterAbstract.prototype.supressNaturalFormSubmit = function() {
      return this.form.submit(function(e) {
        e.preventDefault();
        return false;
      });
    };

    return FormSubmitterAbstract;

  })();

  this.FormSubmitterAjax = (function(superClass) {
    extend(FormSubmitterAjax, superClass);

    function FormSubmitterAjax(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.submit = bind(this.submit, this);
      FormSubmitterAjax.__super__.constructor.call(this, this.plugin, this.config, this.form);
      this.supressNaturalFormSubmit();
    }

    FormSubmitterAjax.prototype.submit = function(event, slide) {
      this.form.ajaxSubmit(this.config);
      return this.form.data('jqxhr').done(this.plugin.onDone).fail(this.plugin.onFail);
    };

    return FormSubmitterAjax;

  })(FormSubmitterAbstract);

  this.FormSubmitterCollect = (function(superClass) {
    extend(FormSubmitterCollect, superClass);

    FormSubmitterCollect.config = {
      visitedSlideSelector: '.slide-visited'
    };

    function FormSubmitterCollect(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.collectInputs = bind(this.collectInputs, this);
      this.submit = bind(this.submit, this);
      FormSubmitterCollect.__super__.constructor.call(this, this.plugin, this.config, this.form);
      this.supressNaturalFormSubmit();
    }

    FormSubmitterCollect.prototype.submit = function(event, slide) {
      return $.ajax({
        cache: false,
        url: this.config.endpoint,
        method: this.config.method,
        data: this.collectInputs()
      }).done(this.plugin.onDone).fail(this.plugin.onFail);
    };

    FormSubmitterCollect.prototype.collectInputs = function() {
      var $container, $input, $inputs, input, j, k, len, len1, result;
      result = {};
      $inputs = $("input.info", $container);
      for (j = 0, len = $inputs.length; j < len; j++) {
        input = $inputs[j];
        $input = $(input);
        result[$input.attr('name')] = $input.val();
      }
      $container = $(this.config.visitedSlideSelector, $container);
      $inputs = $('input, select, textarea', $container);
      for (k = 0, len1 = $inputs.length; k < len1; k++) {
        input = $inputs[k];
        $input = $(input);
        if ($input.is(':checkbox') || $input.is(':radio')) {
          if ($input.is(':checked')) {
            result[$input.attr('name')] = $input.val();
          }
        } else {
          result[$input.attr('name')] = $input.val();
        }
      }
      return result;
    };

    return FormSubmitterCollect;

  })(FormSubmitterAbstract);

  this.FormSubmitterSubmit = (function(superClass) {
    extend(FormSubmitterSubmit, superClass);

    function FormSubmitterSubmit() {
      return FormSubmitterSubmit.__super__.constructor.apply(this, arguments);
    }

    FormSubmitterSubmit.prototype.submit = function(event, slide) {
      return this.form.submit();
    };

    return FormSubmitterSubmit;

  })(FormSubmitterAbstract);

  this.InputFocus = (function(superClass) {
    extend(InputFocus, superClass);

    function InputFocus() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputFocus.__super__.constructor.apply(this, arguments);
    }

    InputFocus.config = {
      selector: 'input:visible',
      disableOnMobile: true
    };

    InputFocus.prototype.init = function() {
      return this.on('after', this.onAfter);
    };

    InputFocus.prototype.onAfter = function(e, currentSlide, direction, prevSlide) {
      var $input;
      if (this.config.disableOnMobile && FeatureDetector.isMobileDevice()) {
        return;
      }
      $input = $(this.config.selector, currentSlide);
      if (!$input.length) {
        if (indexOf.call(document, "activeElement") >= 0) {
          document.activeElement.blur();
        }
        return;
      }
      return $input.first().focus();
    };

    return InputFocus;

  })(AbstractFormsliderPlugin);

  this.InputForceMaxlength = (function(superClass) {
    extend(InputForceMaxlength, superClass);

    function InputForceMaxlength() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.init = bind(this.init, this);
      return InputForceMaxlength.__super__.constructor.apply(this, arguments);
    }

    InputForceMaxlength.config = {
      selector: 'input, textarea',
      forceMaxLengthJs: "javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
    };

    InputForceMaxlength.prototype.init = function() {
      return this.prepareInputs($(this.config.selector));
    };

    InputForceMaxlength.prototype.prepareInputs = function($inputs) {
      return $inputs.each((function(_this) {
        return function(index, input) {
          var $input;
          $input = $(input);
          if ($input.data('force-max-length')) {
            return $input.attr('oninput', _this.config.forceMaxLengthJs);
          }
        };
      })(this));
    };

    return InputForceMaxlength;

  })(AbstractFormsliderPlugin);

  this.InputNormalizer = (function(superClass) {
    extend(InputNormalizer, superClass);

    function InputNormalizer() {
      this.mormalizeInputs = bind(this.mormalizeInputs, this);
      this.init = bind(this.init, this);
      return InputNormalizer.__super__.constructor.apply(this, arguments);
    }

    InputNormalizer.config = {
      selector: 'input'
    };

    InputNormalizer.prototype.init = function() {
      return this.mormalizeInputs();
    };

    InputNormalizer.prototype.mormalizeInputs = function() {
      $(this.config.selector, this.container).each((function(_this) {
        return function(index, input) {
          var $input;
          $input = $(input);
          _this.normalizeRequired($input);
          _this.normalizeAutocomplete($input);
          _this.normalizeInputmode($input);
          return _this.normalizeXAttributes($input);
        };
      })(this));
    };

    InputNormalizer.prototype.normalizeRequired = function($input) {
      if (!$input.attr('required')) {
        return;
      }
      $input.data('required', 'required');
      return $input.data('aria-required', 'true');
    };

    InputNormalizer.prototype.normalizeAutocomplete = function($input) {
      var autocompleete;
      autocompleete = $input.attr('autocompletetype');
      if (!autocompleete) {
        autocompleete = $input.attr('autocomplete');
      }
      if (!autocompleete) {
        return;
      }
      $input.attr('autocompletetype', autocompleete);
      return $input.attr('autocomplete', autocompleete);
    };

    InputNormalizer.prototype.normalizeInputmode = function($input) {
      if ($input.attr('inputmode')) {
        return;
      }
      switch ($input.attr('type')) {
        case 'number':
          return $input.attr('inputmode', 'numeric');
        case 'tel':
          return $input.attr('inputmode', 'tel');
        case 'email':
          return $input.attr('inputmode', 'email');
        case 'url':
          return $input.attr('inputmode', 'url');
      }
    };

    InputNormalizer.prototype.normalizeXAttributes = function($input) {
      var attribute, j, len, ref;
      ref = ['inputmode', 'autocompletetype'];
      for (j = 0, len = ref.length; j < len; j++) {
        attribute = ref[j];
        if ($input.attr(attribute)) {
          $input.attr("x-" + attribute, $input.attr(attribute));
        }
      }
    };

    return InputNormalizer;

  })(AbstractFormsliderPlugin);

  this.InputSync = (function(superClass) {
    extend(InputSync, superClass);

    function InputSync() {
      this.writeInputs = bind(this.writeInputs, this);
      this.readInputs = bind(this.readInputs, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputSync.__super__.constructor.apply(this, arguments);
    }

    InputSync.config = {
      selector: 'input',
      attribute: 'name',
      syncGlobal: false
    };

    InputSync.prototype.init = function() {
      this.storage = {};
      return this.on('after', this.onAfter);
    };

    InputSync.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      var $inputsHere;
      $inputsHere = this.readInputs(prevSlide);
      return this.writeInputs(currentSlide, $inputsHere);
    };

    InputSync.prototype.readInputs = function(slide) {
      var $inputsHere;
      $inputsHere = $(this.config.selector, slide);
      return $inputsHere.each((function(_this) {
        return function(index, input) {
          var $input;
          $input = $(input);
          if ($input.is(':checkbox') || $input.is(':radio')) {
            if ($input.is(':checked')) {
              return _this.storage[$input.attr(_this.config.attribute)] = $input.val();
            }
          } else {
            return _this.storage[$input.attr(_this.config.attribute)] = $input.val();
          }
        };
      })(this));
    };

    InputSync.prototype.writeInputs = function(slide, $inputsHere) {
      var $inputsThere;
      if (this.config.syncGlobal) {
        $inputsThere = $(this.config.selector);
      } else {
        $inputsThere = $(this.config.selector, slide);
      }
      return $inputsThere.not($inputsHere).each((function(_this) {
        return function(index, input) {
          var $input, inputName;
          $input = $(input);
          inputName = $input.attr(_this.config.attribute);
          if (!_this.storage[inputName]) {
            return;
          }
          if ($input.is(':checkbox') || $input.is(':radio')) {
            if ($input.attr('value') === _this.storage[inputName]) {
              return $input.attr('checked', 'checked');
            }
          } else {
            return $input.val(_this.storage[inputName]);
          }
        };
      })(this));
    };

    return InputSync;

  })(AbstractFormsliderPlugin);

  this.JqueryInputValidator = (function(superClass) {
    extend(JqueryInputValidator, superClass);

    function JqueryInputValidator() {
      this.onNaturalFormSubmit = bind(this.onNaturalFormSubmit, this);
      this.validate = bind(this.validate, this);
      this.onValidate = bind(this.onValidate, this);
      this.init = bind(this.init, this);
      return JqueryInputValidator.__super__.constructor.apply(this, arguments);
    }

    JqueryInputValidator.config = {
      selectors: {
        elements: 'input, textarea, select',
        ignore: ':hidden, [readonly]'
      },
      validateOnEvents: ['leaving.next'],
      formSelector: 'form',
      messages: {
        generic: 'invalid',
        email: 'invalid email',
        tel: 'invalid phone number',
        number: 'invalid number',
        minlength: 'to short',
        maxlength: 'to long',
        required: 'required'
      }
    };

    JqueryInputValidator.prototype.init = function() {
      var eventName, j, len, ref;
      this.validator = this.container.iValidator(this.config);
      ref = this.config.validateOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onValidate);
      }
      if (this.config.formSelector) {
        this.form = $(this.config.formSelector);
        return this.form.submit(this.onNaturalFormSubmit);
      }
    };

    JqueryInputValidator.prototype.onValidate = function(event, currentSlide, direction, nextSlide) {
      var currentRole, errors;
      currentRole = $(currentSlide).data('role');
      errors = this.validate(currentSlide);
      if (errors === true) {
        this.trigger("validation.valid." + currentRole, currentSlide);
        return;
      }
      this.trigger("validation.invalid." + currentRole, currentSlide, errors);
      event.canceled = true;
      return setTimeout(function() {
        return $(window).trigger('resize');
      }, 400);
    };

    JqueryInputValidator.prototype.validate = function($inputs) {
      return this.validator.validate($inputs);
    };

    JqueryInputValidator.prototype.onNaturalFormSubmit = function(e) {
      if (this.validator.validate(this.form) !== true) {
        e.preventDefault();
        return false;
      }
    };

    return JqueryInputValidator;

  })(AbstractFormsliderPlugin);

  this.AddSlideClasses = (function(superClass) {
    extend(AddSlideClasses, superClass);

    function AddSlideClasses() {
      this.addVisitedClass = bind(this.addVisitedClass, this);
      this._addAnswerCountClasses = bind(this._addAnswerCountClasses, this);
      this._doWithSlide = bind(this._doWithSlide, this);
      this.init = bind(this.init, this);
      return AddSlideClasses.__super__.constructor.apply(this, arguments);
    }

    AddSlideClasses.config = {
      slideVisitedClass: 'slide-visited'
    };

    AddSlideClasses.prototype.init = function() {
      this.slides.each(this._doWithSlide);
      return this.on('after', this.addVisitedClass);
    };

    AddSlideClasses.prototype._doWithSlide = function(index, slide) {
      var $slide;
      $slide = $(slide);
      this._addAnswerCountClasses(index, $slide);
      this._addSlideNumberClass(index, $slide);
      this._addRoleClass($slide);
      return this._addSlideIdClass($slide);
    };

    AddSlideClasses.prototype._addAnswerCountClasses = function(index, $slide) {
      var answerCount;
      answerCount = $(this.config.answerSelector, $slide).length;
      return $slide.addClass("answer-count-" + answerCount).data('answer-count', answerCount);
    };

    AddSlideClasses.prototype._addRoleClass = function($slide) {
      var role;
      role = $slide.data('role');
      return $slide.addClass("slide-role-" + role);
    };

    AddSlideClasses.prototype._addSlideNumberClass = function(index, $slide) {
      return $slide.addClass("slide-number-" + index).data('slide-number', index);
    };

    AddSlideClasses.prototype._addSlideIdClass = function($slide) {
      var id;
      id = $slide.data('id');
      if (id === void 0) {
        id = $slide.data('role');
      }
      return $slide.addClass("slide-id-" + id);
    };

    AddSlideClasses.prototype.addVisitedClass = function(event, current, direction, prev) {
      $(prev).addClass(this.config.slideVisitedClass);
      return $(current).addClass(this.config.slideVisitedClass);
    };

    return AddSlideClasses;

  })(AbstractFormsliderPlugin);

  this.DoOnEvent = (function(superClass) {
    extend(DoOnEvent, superClass);

    function DoOnEvent() {
      this.init = bind(this.init, this);
      return DoOnEvent.__super__.constructor.apply(this, arguments);
    }

    DoOnEvent.prototype.init = function() {
      return $.each(this.config, (function(_this) {
        return function(eventName, callback) {
          if (typeof callback === 'function') {
            return _this.on(eventName, function() {
              return callback(_this);
            });
          }
        };
      })(this));
    };

    return DoOnEvent;

  })(AbstractFormsliderPlugin);

  this.DoOneTimeOnEvent = (function(superClass) {
    extend(DoOneTimeOnEvent, superClass);

    function DoOneTimeOnEvent() {
      this.init = bind(this.init, this);
      return DoOneTimeOnEvent.__super__.constructor.apply(this, arguments);
    }

    DoOneTimeOnEvent.prototype.init = function() {
      return $.each(this.config, (function(_this) {
        return function(eventName, callback) {
          if (typeof callback === 'function') {
            return _this.on(eventName, function() {
              _this.off(eventName);
              return callback(_this);
            });
          }
        };
      })(this));
    };

    return DoOneTimeOnEvent;

  })(AbstractFormsliderPlugin);

  this.AbstractFormsliderLoader = (function(superClass) {
    extend(AbstractFormsliderLoader, superClass);

    function AbstractFormsliderLoader() {
      this.stop = bind(this.stop, this);
      this.start = bind(this.start, this);
      this.onLeaving = bind(this.onLeaving, this);
      this.onLoaderStart = bind(this.onLoaderStart, this);
      this.init = bind(this.init, this);
      return AbstractFormsliderLoader.__super__.constructor.apply(this, arguments);
    }

    AbstractFormsliderLoader.config = {
      duration: 1000
    };

    AbstractFormsliderLoader.prototype.init = function() {
      this.on('after.loader', this.onLoaderStart);
      this.on('leaving.loader', this.onLeaving);
      this.locking = new Locking(false);
      return this.slide = this.slideByRole('loader');
    };

    AbstractFormsliderLoader.prototype.onLoaderStart = function(event, currentSlide, direction, nextSlide) {
      if (!this.locking.locked) {
        return this.start();
      }
    };

    AbstractFormsliderLoader.prototype.onLeaving = function(event, current, direction, next) {
      if (this.locking.locked) {
        return this.cancel(event);
      }
    };

    AbstractFormsliderLoader.prototype.start = function() {
      var ref, ref1;
      if (this.locking.locked) {
        return false;
      }
      this.locking.lock();
      this.logger.debug("start(" + (((ref = this.config) != null ? ref.duration : void 0) || 1000) + ")");
      return setTimeout(this.doAnimation, ((ref1 = this.config) != null ? ref1.duration : void 0) || 1000);
    };

    AbstractFormsliderLoader.prototype.doAnimation = function() {};

    AbstractFormsliderLoader.prototype.stop = function() {
      this.logger.debug('stop()');
      this.locking.unlock();
      return this.formslider.next();
    };

    return AbstractFormsliderLoader;

  })(AbstractFormsliderPlugin);

  this.SimpleLoader = (function(superClass) {
    extend(SimpleLoader, superClass);

    function SimpleLoader() {
      this.doAnimation = bind(this.doAnimation, this);
      return SimpleLoader.__super__.constructor.apply(this, arguments);
    }

    SimpleLoader.config = {
      duration: 1000
    };

    SimpleLoader.prototype.doAnimation = function() {
      return this.stop();
    };

    return SimpleLoader;

  })(AbstractFormsliderLoader);

  this.BrowserHistoryController = (function(superClass) {
    extend(BrowserHistoryController, superClass);

    function BrowserHistoryController() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return BrowserHistoryController.__super__.constructor.apply(this, arguments);
    }

    BrowserHistoryController.config = {
      updateHash: true,
      resetStatesOnLoad: true
    };

    BrowserHistoryController.prototype.init = function() {
      this.on('after', this.onAfter);
      this.dontUpdateHistoryNow = false;
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return $(window).bind('popstate', this.handleHistoryChange);
    };

    BrowserHistoryController.prototype.onAfter = function() {
      if (this.dontUpdateHistoryNow) {
        this.dontUpdateHistoryNow = false;
        return;
      }
      return this.pushCurrentHistoryState();
    };

    BrowserHistoryController.prototype.pushCurrentHistoryState = function() {
      var hash, index;
      index = this.index();
      hash = null;
      if (this.config.updateHash) {
        hash = "#" + index;
      }
      return history.pushState({
        index: index,
        time: this.time
      }, "index " + index, hash);
    };

    BrowserHistoryController.prototype.handleHistoryChange = function(event) {
      var ref, state;
      if (this.formslider.locking.locked) {
        return;
      }
      if (!((ref = event.originalEvent) != null ? ref.state : void 0)) {
        return;
      }
      state = event.originalEvent.state;
      if (this.config.resetStatesOnLoad) {
        if (state.time !== this.time) {
          return;
        }
      }
      this.logger.debug('handleHistoryChange', state.index);
      this.dontUpdateHistoryNow = true;
      return this.formslider.goto(state.index);
    };

    return BrowserHistoryController;

  })(AbstractFormsliderPlugin);

  this.NativeOrderController = (function(superClass) {
    extend(NativeOrderController, superClass);

    function NativeOrderController() {
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.init = bind(this.init, this);
      return NativeOrderController.__super__.constructor.apply(this, arguments);
    }

    NativeOrderController.prototype.init = function() {
      this.on('controller.prev', this.prev);
      return this.on('controller.next', this.next);
    };

    NativeOrderController.prototype.next = function(event) {
      if (this.isCanceled(event)) {
        return;
      }
      this.cancel(event);
      return this.formslider.goto(this.index() + 1);
    };

    NativeOrderController.prototype.prev = function(event) {
      if (this.isCanceled(event)) {
        return;
      }
      this.cancel(event);
      return this.formslider.goto(this.index() - 1);
    };

    return NativeOrderController;

  })(AbstractFormsliderPlugin);

  this.OrderByIdController = (function(superClass) {
    extend(OrderByIdController, superClass);

    function OrderByIdController() {
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.init = bind(this.init, this);
      return OrderByIdController.__super__.constructor.apply(this, arguments);
    }

    OrderByIdController.prototype.init = function() {
      this.on('controller.prev', this.prev);
      return this.on('controller.next', this.next);
    };

    OrderByIdController.prototype.onCalculateLongestPath = function(event) {
      return event.longest_path = 42;
    };

    OrderByIdController.prototype.next = function(event) {
      var currentSlide, nextId, nextIdFromAnswer, nextSlide, selectedAnswer;
      if (this.isCanceled(event)) {
        return;
      }
      currentSlide = this.slideByIndex();
      nextId = $(currentSlide).data('next-id');
      selectedAnswer = $("." + this.config.answerSelectedClass, currentSlide);
      if (selectedAnswer.length) {
        nextIdFromAnswer = selectedAnswer.data('next-id');
        if (nextIdFromAnswer !== void 0) {
          nextId = nextIdFromAnswer;
        }
      }
      if (nextId !== void 0) {
        nextSlide = this.slideById(nextId);
        nextSlide.data('prev-id', $(currentSlide).data('id'));
        return this.formslider.goto(nextSlide.index());
      }
    };

    OrderByIdController.prototype.prev = function(event) {
      var currentSlide, nextSlide, prevId;
      if (this.isCanceled(event)) {
        return;
      }
      currentSlide = this.slideByIndex();
      prevId = $(currentSlide).data('prev-id');
      if (prevId !== void 0) {
        nextSlide = this.slideById(prevId);
        this.cancel(event);
        $(currentSlide).data('prev-id', void 0);
        return this.formslider.goto(nextSlide.index());
      }
    };

    return OrderByIdController;

  })(AbstractFormsliderPlugin);

  this.DirectionPolicyByRole = (function(superClass) {
    extend(DirectionPolicyByRole, superClass);

    function DirectionPolicyByRole() {
      this.checkPermissions = bind(this.checkPermissions, this);
      this.init = bind(this.init, this);
      return DirectionPolicyByRole.__super__.constructor.apply(this, arguments);
    }

    DirectionPolicyByRole.config = {};

    DirectionPolicyByRole.prototype.init = function() {
      return this.on('leaving', this.checkPermissions);
    };

    DirectionPolicyByRole.prototype.checkPermissions = function(event, current, direction, next) {
      var currentRole, nextRole, permissions;
      currentRole = $(current).data('role');
      nextRole = $(next).data('role');
      if (!currentRole || !nextRole) {
        return;
      }
      if (currentRole in this.config) {
        permissions = this.config[currentRole];
        if ('goingTo' in permissions) {
          if (indexOf.call(permissions.goingTo, 'none') >= 0) {
            return this.cancel(event);
          }
          if (indexOf.call(permissions.goingTo, nextRole) < 0) {
            return this.cancel(event);
          }
        }
      }
      if (nextRole in this.config) {
        permissions = this.config[nextRole];
        if ('commingFrom' in permissions) {
          if (indexOf.call(permissions.commingFrom, 'none') >= 0) {
            return this.cancel(event);
          }
          if (indexOf.call(permissions.commingFrom, currentRole) < 0) {
            return this.cancel(event);
          }
        }
      }
    };

    return DirectionPolicyByRole;

  })(AbstractFormsliderPlugin);

  this.NavigateOnClick = (function(superClass) {
    extend(NavigateOnClick, superClass);

    function NavigateOnClick() {
      this.onClick = bind(this.onClick, this);
      this.init = bind(this.init, this);
      return NavigateOnClick.__super__.constructor.apply(this, arguments);
    }

    NavigateOnClick.config = {
      actions: [
        {
          selector: '.answer',
          action: 'next',
          wait: 200
        }, {
          selector: '.next-button',
          action: 'next',
          wait: 10
        }, {
          selector: '.prev-button',
          action: 'prev',
          wait: 10
        }
      ]
    };

    NavigateOnClick.prototype.init = function() {
      var $target, action, j, len, ref;
      ref = this.config.actions;
      for (j = 0, len = ref.length; j < len; j++) {
        action = ref[j];
        $target = $(action.selector, this.container);
        $target.on('mouseup', action, this.onClick);
      }
    };

    NavigateOnClick.prototype.onClick = function(event, action) {
      event.preventDefault();
      if (!this.timeout) {
        return this.timeout = setTimeout((function(_this) {
          return function() {
            _this.formslider[event.data.action].call();
            return _this.timeout = null;
          };
        })(this), event.data.wait);
      }
    };

    return NavigateOnClick;

  })(AbstractFormsliderPlugin);

  this.NavigateOnKey = (function(superClass) {
    extend(NavigateOnKey, superClass);

    function NavigateOnKey() {
      this.runTimeout = bind(this.runTimeout, this);
      this.onKey = bind(this.onKey, this);
      this.init = bind(this.init, this);
      return NavigateOnKey.__super__.constructor.apply(this, arguments);
    }

    NavigateOnKey.config = {
      actions: [
        {
          context: document,
          action: 'next',
          code: 39,
          wait: 100
        }, {
          selector: 'input',
          action: 'next',
          prevent: true,
          code: 13,
          wait: 100
        }, {
          context: document,
          action: 'prev',
          code: 37,
          wait: 100
        }
      ]
    };

    NavigateOnKey.prototype.init = function() {
      return $.each(this.config.actions, (function(_this) {
        return function(index, action) {
          var $target;
          if (action != null ? action.selector : void 0) {
            $target = $(action.selector, _this.container);
          } else {
            $target = $(action.context);
          }
          return $target.on('keydown', action, _this.onKey);
        };
      })(this));
    };

    NavigateOnKey.prototype.onKey = function(event) {
      var keyCode, ref;
      keyCode = event.keyCode || event.which;
      if (keyCode !== event.data.code) {
        return;
      }
      this.runTimeout(this.formslider[event.data.action], event.data.wait);
      if ((ref = event.data) != null ? ref.prevent : void 0) {
        return event.preventDefault();
      }
    };

    NavigateOnKey.prototype.runTimeout = function(callback, wait) {
      if (!this.timeout) {
        return this.timeout = setTimeout((function(_this) {
          return function() {
            callback();
            return _this.timeout = null;
          };
        })(this), wait);
      }
    };

    return NavigateOnKey;

  })(AbstractFormsliderPlugin);

  this.TabIndexSetter = (function(superClass) {
    extend(TabIndexSetter, superClass);

    function TabIndexSetter() {
      this.disableTabs = bind(this.disableTabs, this);
      this.enableTabs = bind(this.enableTabs, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return TabIndexSetter.__super__.constructor.apply(this, arguments);
    }

    TabIndexSetter.config = {
      selector: 'input, a, select, textarea, button, area, object'
    };

    TabIndexSetter.prototype.init = function() {
      this.disableTabs();
      this.enableTabs(this.slideByIndex(0));
      return this.on('after', this.onAfter);
    };

    TabIndexSetter.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      this.disableTabs();
      return this.enableTabs(currentSlide);
    };

    TabIndexSetter.prototype.enableTabs = function(slide) {
      return $(this.config.selector, slide).each(function(index, el) {
        return $(el).attr('tabindex', index + 1);
      });
    };

    TabIndexSetter.prototype.disableTabs = function() {
      return $(this.config.selector, this.container).attr('tabindex', '-1');
    };

    return TabIndexSetter;

  })(AbstractFormsliderPlugin);

  this.AbstractFormsliderProgressBar = (function(superClass) {
    extend(AbstractFormsliderProgressBar, superClass);

    function AbstractFormsliderProgressBar() {
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      this.shouldBeVisible = bind(this.shouldBeVisible, this);
      this._set = bind(this._set, this);
      this.doUpdate = bind(this.doUpdate, this);
      this.slidesThatCount = bind(this.slidesThatCount, this);
      this.setCountMax = bind(this.setCountMax, this);
      this.init = bind(this.init, this);
      return AbstractFormsliderProgressBar.__super__.constructor.apply(this, arguments);
    }

    AbstractFormsliderProgressBar.config = {
      selectorWrapper: '.progressbar-wrapper',
      selectorText: '.progress-text',
      selectorProgress: '.progress',
      animationSpeed: 300,
      initialProgress: null,
      animateHeight: true,
      dontCountOnRoles: ['loader', 'contact', 'confirmation'],
      hideOnRoles: ['zipcode', 'loader', 'contact', 'confirmation']
    };

    AbstractFormsliderProgressBar.prototype.init = function() {
      this.on('after.next', (function(_this) {
        return function() {
          return _this.currentIndex++;
        };
      })(this));
      this.on('after.prev', (function(_this) {
        return function() {
          return _this.currentIndex--;
        };
      })(this));
      this.on('after', this.doUpdate);
      this.on('ready', (function(_this) {
        return function() {
          _this.setCountMax();
          return _this._set(_this.currentIndex);
        };
      })(this));
      this.visible = true;
      this.wrapper = $(this.config.selectorWrapper);
      this.config = this.configWithDataFrom(this.wrapper);
      this.progressText = $(this.config.selectorText, this.wrapper);
      this.bar = $(this.config.selectorProgress, this.wrapper);
      this.bar.css('transition-duration', (this.config.animationSpeed / 1000) + 's');
      return this.currentIndex = 0;
    };

    AbstractFormsliderProgressBar.prototype.set = function(indexFromZero, percent) {};

    AbstractFormsliderProgressBar.prototype.setCountMax = function(slide) {
      var possibleCountMax, ref;
      if (slide == null) {
        slide = null;
      }
      if (!((ref = this.config) != null ? ref.dataKeyForMaxLength : void 0)) {
        this.countMax = this.slidesThatCount();
        return;
      }
      if (slide === null) {
        slide = this.slideByIndex();
      }
      possibleCountMax = $(slide).data(this.config.dataKeyForMaxLength);
      if (!possibleCountMax) {
        return;
      }
      possibleCountMax = parseInt(possibleCountMax, 10);
      return this.countMax = possibleCountMax;
    };

    AbstractFormsliderProgressBar.prototype.slidesThatCount = function() {
      var j, len, ref, role, substract;
      substract = 0;
      ref = this.config.dontCountOnRoles;
      for (j = 0, len = ref.length; j < len; j++) {
        role = ref[j];
        substract = substract + this.slideByRole(role).length;
      }
      return this.slides.length - substract;
    };

    AbstractFormsliderProgressBar.prototype.doUpdate = function(_event, current, direction, prev) {
      this.setCountMax(current);
      if (!this.shouldBeVisible(current)) {
        this._set(this.currentIndex);
        return this.hide();
      }
      this.show();
      return this._set(this.currentIndex);
    };

    AbstractFormsliderProgressBar.prototype._set = function(indexFromZero) {
      var percent;
      if (indexFromZero > this.countMax - 1) {
        indexFromZero = this.countMax - 1;
      }
      if (indexFromZero < 0) {
        indexFromZero = 0;
      }
      percent = ((indexFromZero + 1) / this.countMax) * 100;
      if (this.config.initialProgress && indexFromZero === 0) {
        percent = this.config.initialProgress;
      }
      this.bar.css('width', percent + '%');
      return this.set(indexFromZero, percent);
    };

    AbstractFormsliderProgressBar.prototype.shouldBeVisible = function(slide) {
      var ref;
      return !(ref = $(slide).data('role'), indexOf.call(this.config.hideOnRoles, ref) >= 0);
    };

    AbstractFormsliderProgressBar.prototype.hide = function() {
      if (!this.visible) {
        return;
      }
      this.visible = false;
      return this.wrapper.stop().animate({
        opacity: 0,
        height: 0
      }, this.config.animationSpeed);
    };

    AbstractFormsliderProgressBar.prototype.show = function() {
      var animationProperties, autoHeight, currentHeight;
      if (this.visible) {
        return;
      }
      this.visible = true;
      animationProperties = {
        opacity: 1
      };
      if (this.config.animateHeight) {
        currentHeight = this.wrapper.height();
        autoHeight = this.wrapper.css('height', 'auto').height();
        this.wrapper.css('height', currentHeight);
        animationProperties.height = autoHeight + "px";
      }
      return this.wrapper.stop().animate(animationProperties, this.config.animationSpeed);
    };

    return AbstractFormsliderProgressBar;

  })(AbstractFormsliderPlugin);

  this.ProgressBarPercent = (function(superClass) {
    extend(ProgressBarPercent, superClass);

    function ProgressBarPercent() {
      this._setPercentStepCallback = bind(this._setPercentStepCallback, this);
      this.set = bind(this.set, this);
      return ProgressBarPercent.__super__.constructor.apply(this, arguments);
    }

    ProgressBarPercent.prototype.set = function(indexFromZero, percent) {
      var startFrom;
      startFrom = parseInt(this.progressText.text()) || 1;
      return $({
        Counter: startFrom
      }).animate({
        Counter: percent
      }, {
        duration: this.config.animationSpeed,
        queue: false,
        easing: 'swing',
        step: this._setPercentStepCallback
      });
    };

    ProgressBarPercent.prototype._setPercentStepCallback = function(percent) {
      return this.progressText.text(Math.ceil(percent) + '%');
    };

    return ProgressBarPercent;

  })(AbstractFormsliderProgressBar);

  this.ProgressBarSteps = (function(superClass) {
    extend(ProgressBarSteps, superClass);

    function ProgressBarSteps() {
      this.set = bind(this.set, this);
      return ProgressBarSteps.__super__.constructor.apply(this, arguments);
    }

    ProgressBarSteps.prototype.set = function(indexFromZero, percent) {
      return this.progressText.text((indexFromZero + 1) + "/" + this.countMax);
    };

    return ProgressBarSteps;

  })(AbstractFormsliderProgressBar);

  this.TrackSessionInformation = (function(superClass) {
    extend(TrackSessionInformation, superClass);

    function TrackSessionInformation() {
      this.inform = bind(this.inform, this);
      this.onFirstInteraction = bind(this.onFirstInteraction, this);
      this.init = bind(this.init, this);
      return TrackSessionInformation.__super__.constructor.apply(this, arguments);
    }

    TrackSessionInformation.config = {
      onReady: null,
      onReadyInternal: function(plugin) {
        plugin.inform('url', location.href);
        plugin.inform('useragent', navigator.userAgent);
        plugin.inform('referer', document.referrer);
        plugin.inform('dimension', $(window).width() + 'x' + $(window).height());
        plugin.inform('jquery.formslider.version', plugin.formslider.config.version);
        if (plugin.formslider.plugins.isLoaded('JqueryTracking')) {
          plugin.inform('channel', $.tracking.channel());
          plugin.inform('campaign', $.tracking.campaign());
          return JqueryTrackingGHelper.getClientId(function(id) {
            return plugin.inform('clientId', id);
          });
        }
      },
      buildHiddenInput: function(name, value) {
        return $('<input>', {
          type: 'hidden',
          name: "info[" + name + "]",
          "class": 'info',
          value: value
        });
      }
    };

    TrackSessionInformation.prototype.init = function() {
      return this.on('first-interaction', this.onFirstInteraction);
    };

    TrackSessionInformation.prototype.onFirstInteraction = function() {
      if (this.config.onReadyInternal) {
        this.config.onReadyInternal(this);
      }
      if (this.config.onReady) {
        return this.config.onReady(this);
      }
    };

    TrackSessionInformation.prototype.inform = function(name, value) {
      this.track(name, value, 'info');
      return this.container.append(this.config.buildHiddenInput(name, value));
    };

    return TrackSessionInformation;

  })(AbstractFormsliderPlugin);

  this.TrackUserInteraction = (function(superClass) {
    extend(TrackUserInteraction, superClass);

    function TrackUserInteraction() {
      this.setupQuestionAnswerTracking = bind(this.setupQuestionAnswerTracking, this);
      this.setupTransportTracking = bind(this.setupTransportTracking, this);
      this.init = bind(this.init, this);
      return TrackUserInteraction.__super__.constructor.apply(this, arguments);
    }

    TrackUserInteraction.config = {
      questionAnsweredEvent: 'question-answered'
    };

    TrackUserInteraction.prototype.init = function() {
      this.setupQuestionAnswerTracking();
      return this.setupTransportTracking();
    };

    TrackUserInteraction.prototype.setupTransportTracking = function() {
      return this.on("after", (function(_this) {
        return function(event, currentSlide, direction, prevSlide) {
          var id, role;
          role = $(currentSlide).data('role');
          id = $(currentSlide).data('id');
          _this.track("slide-" + (_this.index()) + "-entered", direction);
          _this.track("slide-role-" + role + "-entered", direction);
          if (id) {
            return _this.track("slide-id-" + id + "-entered", direction);
          }
        };
      })(this));
    };

    TrackUserInteraction.prototype.setupQuestionAnswerTracking = function() {
      return this.on('question-answered', (function(_this) {
        return function(event, questionId, answerId, value, slideIndex) {
          var eventName;
          eventName = _this.config.questionAnsweredEvent;
          _this.track(eventName, slideIndex);
          return _this.track(eventName + "-" + slideIndex, value);
        };
      })(this));
    };

    return TrackUserInteraction;

  })(AbstractFormsliderPlugin);

  this.EqualHeight = (function(superClass) {
    extend(EqualHeight, superClass);

    function EqualHeight() {
      this.doEqualize = bind(this.doEqualize, this);
      this.equalizeAll = bind(this.equalizeAll, this);
      this.init = bind(this.init, this);
      return EqualHeight.__super__.constructor.apply(this, arguments);
    }

    EqualHeight.config = {
      selector: '.answer .text'
    };

    EqualHeight.prototype.init = function() {
      this.on('ready', this.equalizeAll);
      this.on('resize', this.equalizeAll);
      return this.on('do-equal-height', this.doEqualize);
    };

    EqualHeight.prototype.equalizeAll = function() {
      var i, j, ref;
      for (i = j = 0, ref = this.slides.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        this.doEqualize(null, this.slideByIndex(i));
      }
    };

    EqualHeight.prototype.doEqualize = function(event, slide) {
      var $element, $elements, element, j, len, maxHeight;
      $elements = $(this.config.selector, slide);
      if (!$elements.length) {
        return;
      }
      maxHeight = 0;
      for (j = 0, len = $elements.length; j < len; j++) {
        element = $elements[j];
        $element = $(element);
        $element.css('height', 'auto');
        maxHeight = Math.max(maxHeight, $element.outerHeight());
      }
      return $elements.css('height', maxHeight);
    };

    return EqualHeight;

  })(AbstractFormsliderPlugin);

  this.JqueryAnimate = (function(superClass) {
    extend(JqueryAnimate, superClass);

    function JqueryAnimate() {
      this.doAnimation = bind(this.doAnimation, this);
      this.prepareAnimations = bind(this.prepareAnimations, this);
      this.init = bind(this.init, this);
      return JqueryAnimate.__super__.constructor.apply(this, arguments);
    }

    JqueryAnimate.config = {
      dataPrefix: 'animate',
      defaultDuration: 600
    };

    JqueryAnimate.prototype.init = function() {
      return this.prepareAnimations(this.container);
    };

    JqueryAnimate.prototype.prepareAnimations = function(context) {
      var $elements, dataKey;
      dataKey = "" + this.config.dataPrefix;
      $elements = $("[data-" + dataKey + "]", context);
      if (!$elements.length) {
        return;
      }
      return $elements.each((function(_this) {
        return function(index, element) {
          var $element, data, event, j, len, ref;
          $element = $(element);
          data = $element.data(dataKey);
          if (!(data != null ? data.on : void 0)) {
            return;
          }
          ref = data.on.split(',');
          for (j = 0, len = ref.length; j < len; j++) {
            event = ref[j];
            _this.on(event.trim(), function(e, current, direction, next) {
              _this.doAnimation($element, data);
              if (data != null ? data.once : void 0) {
                return _this.off(event.trim());
              }
            });
          }
        };
      })(this));
    };

    JqueryAnimate.prototype.doAnimation = function($element, data) {
      var callback, duration;
      $element = (data != null ? data.selector : void 0) ? $(data.selector) : $element;
      duration = data.duration || this.config.defaultDuration;
      if (data != null ? data.stop : void 0) {
        $element.stop();
      }
      if (data != null ? data.delay : void 0) {
        $element.delay(data.delay);
      }
      if (data != null ? data.css : void 0) {
        $element.css(data.css);
      }
      if (data != null ? data.complete : void 0) {
        callback = (function(_this) {
          return function() {
            return _this.doAnimation($element, data.complete);
          };
        })(this);
      }
      return $element.animate(data.animate, duration, callback);
    };

    return JqueryAnimate;

  })(AbstractFormsliderPlugin);

  this.LazyLoad = (function(superClass) {
    extend(LazyLoad, superClass);

    function LazyLoad() {
      this._loadLazyCallback = bind(this._loadLazyCallback, this);
      this.doLazyLoad = bind(this.doLazyLoad, this);
      this.onBefore = bind(this.onBefore, this);
      this.init = bind(this.init, this);
      return LazyLoad.__super__.constructor.apply(this, arguments);
    }

    LazyLoad.config = {
      lazyClass: 'lazy-load',
      dataKey: 'src',
      waitBeforeLoad: 10
    };

    LazyLoad.prototype.init = function() {
      this.doLazyLoad(this.slideByIndex(0));
      return this.on('before', this.onBefore);
    };

    LazyLoad.prototype.onBefore = function(event, current, direction, next) {
      return this.doLazyLoad(next);
    };

    LazyLoad.prototype.doLazyLoad = function(slide) {
      return setTimeout((function(_this) {
        return function() {
          $("img." + _this.config.lazyClass, slide).each(_this._loadLazyCallback);
          return _this.trigger('do-equal-height', slide);
        };
      })(this), this.config.waitBeforeLoad);
    };

    LazyLoad.prototype._loadLazyCallback = function(index, el) {
      var $el;
      $el = $(el);
      return $el.attr('src', $el.data(this.config.dataKey)).removeData(this.config.dataKey).removeClass(this.config.lazyClass);
    };

    return LazyLoad;

  })(AbstractFormsliderPlugin);

  this.LoadingState = (function(superClass) {
    extend(LoadingState, superClass);

    function LoadingState() {
      this.onReady = bind(this.onReady, this);
      this.init = bind(this.init, this);
      return LoadingState.__super__.constructor.apply(this, arguments);
    }

    LoadingState.config = {
      selector: '.progressbar-wrapper, .formslider-wrapper',
      loadingClass: 'loading',
      loadedClass: 'loaded'
    };

    LoadingState.prototype.init = function() {
      return this.on('ready', this.onReady);
    };

    LoadingState.prototype.onReady = function() {
      return $(this.config.selector).removeClass(this.config.loadingClass).addClass(this.config.loadedClass);
    };

    return LoadingState;

  })(AbstractFormsliderPlugin);

  this.ScrollUp = (function(superClass) {
    extend(ScrollUp, superClass);

    function ScrollUp() {
      this.isOnScreen = bind(this.isOnScreen, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return ScrollUp.__super__.constructor.apply(this, arguments);
    }

    ScrollUp.config = {
      selector: '.headline',
      duration: 500,
      tolerance: 80,
      scrollUpOffset: 30,
      scrollTo: function(plugin, $element) {
        return Math.max(0, $element.offset().top - plugin.config.scrollUpOffset);
      },
      checkElement: function(plugin, slide) {
        return $(plugin.config.selector, slide);
      }
    };

    ScrollUp.prototype.init = function() {
      this.on('after', this.onAfter);
      return this.window = $(window);
    };

    ScrollUp.prototype.onAfter = function(e, current, direction, prev) {
      var $element;
      $element = this.config.checkElement(this, current);
      if (!$element.length) {
        this.logger.warn("no element found for selector " + this.config.selector);
        return;
      }
      if (this.isOnScreen($element)) {
        return;
      }
      return $("html, body").animate({
        scrollTop: this.config.scrollTo(this, $element)
      }, this.config.duration);
    };

    ScrollUp.prototype.isOnScreen = function($element) {
      var bounds, viewport;
      viewport = {
        top: this.window.scrollTop()
      };
      viewport.bottom = viewport.top + this.window.height();
      bounds = $element.offset();
      bounds.bottom = bounds.top + $element.outerHeight();
      return !(viewport.bottom < bounds.top - this.config.tolerance || viewport.top > bounds.bottom - this.config.tolerance);
    };

    return ScrollUp;

  })(AbstractFormsliderPlugin);

  this.SlideVisibility = (function(superClass) {
    extend(SlideVisibility, superClass);

    function SlideVisibility() {
      this.hideOtherSlides = bind(this.hideOtherSlides, this);
      this.showNextSlide = bind(this.showNextSlide, this);
      this.init = bind(this.init, this);
      return SlideVisibility.__super__.constructor.apply(this, arguments);
    }

    SlideVisibility.prototype.init = function() {
      this.on('before', this.showNextSlide);
      this.on('after', this.hideOtherSlides);
      this.hide(this.slides);
      return this.show(this.slideByIndex());
    };

    SlideVisibility.prototype.showNextSlide = function(event, current, direction, next) {
      return this.show(next);
    };

    SlideVisibility.prototype.hideOtherSlides = function(event, current, direction, prev) {
      return this.hide(this.slides.not(current));
    };

    SlideVisibility.prototype.hide = function(slide) {
      return $(slide).css('opacity', 0).data('slide-visibility', 0);
    };

    SlideVisibility.prototype.show = function(slide) {
      return $(slide).css('opacity', 1).data('slide-visibility', 1);
    };

    return SlideVisibility;

  })(AbstractFormsliderPlugin);

  EventManager = (function() {
    function EventManager(logger) {
      this.logger = logger;
      this.off = bind(this.off, this);
      this.on = bind(this.on, this);
      this.trigger = bind(this.trigger, this);
      this.listener = {};
    }

    EventManager.prototype.trigger = function() {
      var data, event, j, len, listener, name, ref, tags;
      data = slice.call(arguments);
      name = data.shift();
      tags = name.split('.');
      name = tags.shift();
      event = {
        type: name,
        tags: tags,
        canceled: false
      };
      if (this.listener[name] == null) {
        return event;
      }
      ref = this.listener[name];
      for (j = 0, len = ref.length; j < len; j++) {
        listener = ref[j];
        if (!listener.tags || this.allTagsInArray(listener.tags, tags)) {
          listener.callback.apply(listener, [event].concat(slice.call(data)));
        }
      }
      return event;
    };

    EventManager.prototype.on = function(name, callback) {
      var base, context, tags;
      tags = name.split('.');
      name = tags.shift();
      context = tags.pop();
      if ((base = this.listener)[name] == null) {
        base[name] = [];
      }
      return this.listener[name].push({
        name: name,
        tags: tags,
        context: context,
        callback: callback
      });
    };

    EventManager.prototype.off = function(name) {
      var context, tags;
      tags = name.split('.');
      name = tags.shift();
      context = tags.pop();
      if (this.listener[name] == null) {
        return;
      }
      return this.listener[name] = this.listener[name].filter((function(_this) {
        return function(listener) {
          if (listener.context !== context) {
            return true;
          }
          if (_this.allTagsInArray(tags, listener.tags)) {
            return false;
          }
        };
      })(this));
    };

    EventManager.prototype.allTagsInArray = function(tags, inputArray) {
      var j, len, tag;
      for (j = 0, len = tags.length; j < len; j++) {
        tag = tags[j];
        if (!(indexOf.call(inputArray, tag) >= 0)) {
          return false;
        }
      }
      return true;
    };

    EventManager.prototype.isCanceled = function(event) {
      return event.canceled === true;
    };

    EventManager.prototype.cancel = function(event) {
      event.canceled = true;
      return false;
    };

    return EventManager;

  })();

  this.FeatureDetector = (function() {
    function FeatureDetector() {}

    FeatureDetector.isMobileDevice = function() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    return FeatureDetector;

  })();

  this.Locking = (function() {
    function Locking(initial) {
      if (initial == null) {
        initial = true;
      }
      this.unlock = bind(this.unlock, this);
      this.lock = bind(this.lock, this);
      this.locked = initial;
    }

    Locking.prototype.lock = function() {
      return this.locked = true;
    };

    Locking.prototype.unlock = function() {
      return this.locked = false;
    };

    return Locking;

  })();

  Logger = (function() {
    function Logger(namespace) {
      this.namespace = namespace;
      this.error = bind(this.error, this);
      this.warn = bind(this.warn, this);
      this.debug = bind(this.debug, this);
      this.info = bind(this.info, this);
      if (!$.debug) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn('jquery.debug not loaded');
          }
        }
      }
    }

    Logger.prototype.info = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      return (ref = $.debug).info.apply(ref, arguments);
    };

    Logger.prototype.debug = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      return (ref = $.debug).debug.apply(ref, arguments);
    };

    Logger.prototype.warn = function() {
      var ref, ref1;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ((ref = $.debug) != null ? ref.isEnabled() : void 0) {
        return (ref1 = $.debug).warn.apply(ref1, arguments);
      }
      return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn.apply(console, arguments) : void 0 : void 0;
    };

    Logger.prototype.error = function() {
      var ref, ref1;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ((ref = $.debug) != null ? ref.isEnabled() : void 0) {
        return (ref1 = $.debug).error.apply(ref1, arguments);
      }
      return typeof console !== "undefined" && console !== null ? typeof console.error === "function" ? console.error.apply(console, arguments) : void 0 : void 0;
    };

    return Logger;

  })();

  this.ObjectExtender = (function() {
    function ObjectExtender() {}

    ObjectExtender.extend = function(obj) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        var prop, ref, ref1, results;
        if (!source) {
          return;
        }
        results = [];
        for (prop in source) {
          if (((ref = source[prop]) != null ? ref.constructor : void 0) === Object) {
            if (!obj[prop] || ((ref1 = obj[prop]) != null ? ref1.constructor : void 0) === Object) {
              obj[prop] = obj[prop] || {};
              results.push(ObjectExtender.extend(obj[prop], source[prop]));
            } else {
              results.push(obj[prop] = source[prop]);
            }
          } else {
            results.push(obj[prop] = source[prop]);
          }
        }
        return results;
      });
      return obj;
    };

    return ObjectExtender;

  })();

  this.PluginLoader = (function() {
    function PluginLoader(formslider, globalPluginConfig) {
      this.formslider = formslider;
      this.globalPluginConfig = globalPluginConfig;
      this.get = bind(this.get, this);
      this.isLoaded = bind(this.isLoaded, this);
      this.load = bind(this.load, this);
      this.loadAll = bind(this.loadAll, this);
      this.loaded = {};
    }

    PluginLoader.prototype.loadAll = function(plugins) {
      var j, len, plugin;
      for (j = 0, len = plugins.length; j < len; j++) {
        plugin = plugins[j];
        if (!window[plugin["class"]]) {
          this.formslider.logger.warn("loadAll(" + plugin["class"] + ") -> not found");
          continue;
        }
        this.load(plugin);
      }
    };

    PluginLoader.prototype.load = function(plugin) {
      var PluginClass, config, error, pluginInstance;
      PluginClass = window[plugin["class"]];
      if (plugin.config == null) {
        config = this.globalPluginConfig;
      } else {
        config = ObjectExtender.extend({}, this.globalPluginConfig, plugin.config);
      }
      try {
        pluginInstance = new PluginClass(this.formslider, config);
        this.loaded[plugin["class"]] = pluginInstance;
        return pluginInstance;
      } catch (error1) {
        error = error1;
        return this.formslider.logger.error("loadPlugin(" + plugin["class"] + ") -> error", error);
      }
    };

    PluginLoader.prototype.isLoaded = function(name) {
      return name in this.loaded;
    };

    PluginLoader.prototype.get = function(name) {
      if (!this.isLoaded(name)) {
        return;
      }
      return this.loaded[name];
    };

    return PluginLoader;

  })();

  this.FormSlider = (function() {
    FormSlider.config = null;

    function FormSlider(container, config) {
      this.container = container;
      this.goto = bind(this.goto, this);
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.index = bind(this.index, this);
      this.onResize = bind(this.onResize, this);
      this.onReady = bind(this.onReady, this);
      this.onAfter = bind(this.onAfter, this);
      this.onBefore = bind(this.onBefore, this);
      this.loadPlugins = bind(this.loadPlugins, this);
      this.setupDriver = bind(this.setupDriver, this);
      this.setupConfig = bind(this.setupConfig, this);
      this.logger = new Logger('jquery.formslider');
      if (!this.container.length) {
        this.logger.error('container is empty');
        return;
      }
      this.setupConfig(config);
      this.firstInteraction = false;
      this.ready = false;
      this.events = new EventManager(this.logger);
      this.locking = new Locking(true);
      this.setupDriver();
      this.slides = this.driver.slides;
      this.loadPlugins();
      $(window).resize(this.onResize);
    }

    FormSlider.prototype.setupConfig = function(config) {
      if ((config != null ? config.plugins : void 0) != null) {
        FormSlider.config.plugins = [];
      }
      return this.config = ObjectExtender.extend({}, FormSlider.config, config);
    };

    FormSlider.prototype.setupDriver = function() {
      var DriverClass;
      DriverClass = window[this.config.driver["class"]];
      return this.driver = new DriverClass(this.container, this.config.driver, this.onBefore, this.onAfter, this.onReady);
    };

    FormSlider.prototype.loadPlugins = function() {
      this.plugins = new PluginLoader(this, this.config.pluginsGlobalConfig);
      return this.plugins.loadAll(this.config.plugins);
    };

    FormSlider.prototype.onBefore = function(currentIndex, direction, nextIndex) {
      var current, currentRole, event, eventData, next, nextRole, ref, ref1;
      if (currentIndex === nextIndex) {
        return false;
      }
      if (this.locking.locked) {
        return false;
      }
      this.locking.lock();
      current = this.slides.get(currentIndex);
      currentRole = $(current).data('role');
      next = this.slides.get(nextIndex);
      nextRole = $(next).data('role');
      eventData = [current, direction, next];
      event = (ref = this.events).trigger.apply(ref, ["leaving." + currentRole + "." + direction].concat(slice.call(eventData)));
      if (event.canceled) {
        this.locking.unlock();
        return false;
      }
      (ref1 = this.events).trigger.apply(ref1, ["before." + nextRole + "." + direction].concat(slice.call(eventData)));
      this.lastCurrent = current;
      this.lastNext = next;
      this.lastCurrentRole = nextRole;
      return this.lastDirection = direction;
    };

    FormSlider.prototype.onAfter = function() {
      var eventData, ref, ref1;
      if (!this.locking.locked) {
        return;
      }
      eventData = [this.lastNext, this.lastDirection, this.lastCurrent];
      (ref = this.events).trigger.apply(ref, ["after." + this.lastCurrentRole + "." + this.lastDirection].concat(slice.call(eventData)));
      if (!this.firstInteraction) {
        this.firstInteraction = true;
        (ref1 = this.events).trigger.apply(ref1, ['first-interaction'].concat(slice.call(eventData)));
      }
      return setTimeout(this.locking.unlock, this.config.silenceAfterTransition);
    };

    FormSlider.prototype.onReady = function() {
      if (this.ready) {
        return;
      }
      this.ready = true;
      this.events.trigger('ready');
      return this.locking.unlock();
    };

    FormSlider.prototype.onResize = function() {
      return this.events.trigger('resize');
    };

    FormSlider.prototype.index = function() {
      return this.driver.index();
    };

    FormSlider.prototype.next = function() {
      return this.events.trigger("controller.next");
    };

    FormSlider.prototype.prev = function() {
      return this.events.trigger("controller.prev");
    };

    FormSlider.prototype.goto = function(indexFromZero) {
      if (this.locking.locked) {
        return;
      }
      if (indexFromZero < 0 || indexFromZero > this.slides.length - 1) {
        return;
      }
      return this.driver.goto(indexFromZero);
    };

    return FormSlider;

  })();

  this.FormSlider.config = {
    version: 1,
    silenceAfterTransition: 500,
    driver: {
      "class": 'DriverFlexslider',
      selector: '.formslider > .slide'
    },
    pluginsGlobalConfig: {
      questionSelector: '.question-input',
      answersSelector: '.answers',
      answerSelector: '.answer',
      answerSelectedClass: 'selected'
    },
    plugins: [
      {
        "class": 'BrowserHistoryController'
      }, {
        "class": 'NativeOrderController'
      }, {
        "class": 'SlideVisibility'
      }, {
        "class": 'LazyLoad'
      }, {
        "class": 'EqualHeight'
      }, {
        "class": 'ScrollUp'
      }, {
        "class": 'LoadingState'
      }, {
        "class": 'JqueryAnimate'
      }, {
        "class": 'ProgressBarPercent'
      }, {
        "class": 'AnswerMemory'
      }, {
        "class": 'AnswerClick'
      }, {
        "class": 'JqueryInputValidator'
      }, {
        "class": 'TabIndexSetter'
      }, {
        "class": 'InputSync'
      }, {
        "class": 'InputNormalizer'
      }, {
        "class": 'InputFocus'
      }, {
        "class": 'FormSubmission'
      }, {
        "class": 'InputForceMaxlength'
      }, {
        "class": 'NavigateOnClick'
      }, {
        "class": 'NavigateOnKey'
      }, {
        "class": 'TrackUserInteraction'
      }, {
        "class": 'TrackSessionInformation'
      }, {
        "class": 'SimpleLoader'
      }, {
        "class": 'AddSlideClasses'
      }
    ]
  };

  jQuery.fn.formslider = function(config) {
    var $this, instance;
    if (config == null) {
      config = null;
    }
    $this = $(this);
    instance = $this.data('formslider');
    if (!instance || config !== null) {
      $this.data('formslider', new FormSlider($this, config || {}));
      instance = $this.data('formslider');
    }
    return instance;
  };

  jQuery.fn.extend({
    animateCss: function(animationCssClass, duration, complete) {
      return this.each(function() {
        var $this, durationSeconds;
        durationSeconds = duration / 1000;
        $this = $(this);
        $this.css("animation-duration", durationSeconds + 's').addClass("animate " + animationCssClass);
        return setTimeout(function() {
          $this.removeClass("animate " + animationCssClass);
          if (complete) {
            return complete($this);
          }
        }, duration);
      });
    }
  });

  this.JqueryAnimate = (function(superClass) {
    extend(JqueryAnimate, superClass);

    function JqueryAnimate() {
      this.doAnimation = bind(this.doAnimation, this);
      this.init = bind(this.init, this);
      return JqueryAnimate.__super__.constructor.apply(this, arguments);
    }

    JqueryAnimate.config = {
      duration: 800,
      selector: '.answer',
      next: {
        inEffect: 'swingReverse',
        outEffect: 'swingReverse'
      },
      prev: {
        inEffect: 'swing',
        outEffect: 'swing'
      }
    };

    JqueryAnimate.prototype.init = function() {
      return this.on('before.question', this.doAnimation);
    };

    JqueryAnimate.prototype.doAnimation = function(event, currentSlide, direction, nextSlide) {
      var duration, inEffect, outEffect, selector;
      inEffect = this.config[direction].inEffect;
      outEffect = this.config[direction].outEffect;
      duration = this.config.duration;
      selector = this.config.selector;
      $(selector, currentSlide).animateCss(outEffect, duration);
      return $(selector, nextSlide).animateCss(outEffect, duration);
    };

    return JqueryAnimate;

  })(AbstractFormsliderPlugin);

  this.DramaticLoader = (function(superClass) {
    extend(DramaticLoader, superClass);

    function DramaticLoader() {
      this.doAnimationOnNextSlide = bind(this.doAnimationOnNextSlide, this);
      this.finishAnimation = bind(this.finishAnimation, this);
      this.doAnimation = bind(this.doAnimation, this);
      return DramaticLoader.__super__.constructor.apply(this, arguments);
    }

    DramaticLoader.config = {
      duration: 2500,
      finishAnimationDuration: 2500,
      hideElementsOnHalf: '.hide-on-half',
      showElementsOnHalf: '.show-on-half',
      bounceOutOnHalf: '.bounce-out-on-half',
      bounceDownOnNext: '.bounce-down-on-enter'
    };

    DramaticLoader.prototype.doAnimation = function() {
      var $elementsToBounceOut, $elementsToHide, $elementsToShow;
      this.on('leaving.next', this.doAnimationOnNextSlide);
      this.logger.debug("doAnimation(" + this.config.finishAnimationDuration + ")");
      $elementsToHide = $(this.config.hideElementsOnHalf, this.slide);
      $elementsToShow = $(this.config.showElementsOnHalf, this.slide);
      $elementsToBounceOut = $(this.config.bounceOutOnHalf, this.slide);
      $elementsToHide.fadeOut().animateCss('bounceOut', 400, function() {
        return $elementsToShow.css({
          display: 'block'
        }).fadeIn().animateCss('bounceIn', 500, function() {
          return $elementsToBounceOut.animateCss('bounceOut', 400).animate({
            opacity: 0
          }, 400);
        });
      });
      return setTimeout(this.finishAnimation, this.config.duration);
    };

    DramaticLoader.prototype.finishAnimation = function() {
      return setTimeout(this.stop, this.config.finishAnimationDuration);
    };

    DramaticLoader.prototype.doAnimationOnNextSlide = function(event, current, direction, next) {
      var $elementsToBounceDown;
      $elementsToBounceDown = $(this.config.bounceDownOnNext, next);
      return $elementsToBounceDown.css({
        opacity: 0
      }).animateCss('bounceInDown', 600).animate({
        opacity: 1
      }, 600);
    };

    return DramaticLoader;

  })(AbstractFormsliderLoader);

  this.JqueryTrackingGAnalyticsAdapter = (function() {
    function JqueryTrackingGAnalyticsAdapter(options1, controller) {
      this.options = options1;
      this.controller = controller;
      this.trackConversion = bind(this.trackConversion, this);
      this.trackClick = bind(this.trackClick, this);
      window.ga = window.ga || function() {
        return (ga.q = ga.q || []).push(arguments);
      };
      window.ga.l = +(new Date);
    }

    JqueryTrackingGAnalyticsAdapter.prototype.trackEvent = function(category, action, label, value) {
      return window.ga('send', 'event', category, action, label, value);
    };

    JqueryTrackingGAnalyticsAdapter.prototype.trackClick = function(source) {
      return this.trackEvent('button', 'click', source);
    };

    JqueryTrackingGAnalyticsAdapter.prototype.trackConversion = function() {
      var ref;
      if ((ref = this.options) != null ? ref.doNotTrackConversion : void 0) {
        return;
      }
      return this.trackEvent('advertising', 'conversion', 'conversion', 1);
    };

    return JqueryTrackingGAnalyticsAdapter;

  })();

  this.JqueryTrackingGTagmanagerAdapter = (function() {
    function JqueryTrackingGTagmanagerAdapter(options1, controller) {
      this.options = options1;
      this.controller = controller;
      this.trackConversion = bind(this.trackConversion, this);
      this.trackClick = bind(this.trackClick, this);
      window.dataLayer = window.dataLayer || [];
    }

    JqueryTrackingGTagmanagerAdapter.prototype.trackEvent = function(category, action, label, value) {
      return window.dataLayer.push({
        'event': 'gaEvent',
        'eventCategory': category,
        'eventAction': action,
        'eventLabel': label,
        'eventValue': value
      });
    };

    JqueryTrackingGTagmanagerAdapter.prototype.trackClick = function(source) {
      return this.trackEvent('button', 'click', source);
    };

    JqueryTrackingGTagmanagerAdapter.prototype.trackConversion = function() {
      var ref;
      if ((ref = this.options) != null ? ref.doNotTrackConversion : void 0) {
        return;
      }
      return this.trackEvent('advertising', 'conversion', 'conversion', 1);
    };

    return JqueryTrackingGTagmanagerAdapter;

  })();

  this.JqueryTrackingFacebookAdapter = (function() {
    function JqueryTrackingFacebookAdapter(options1, controller) {
      this.options = options1;
      this.controller = controller;
      this.available = bind(this.available, this);
      this.trackConversion = bind(this.trackConversion, this);
      this.trackClick = bind(this.trackClick, this);
      this.trackEvent = bind(this.trackEvent, this);
    }

    JqueryTrackingFacebookAdapter.prototype.trackEvent = function(category, action, label, value) {
      if (!this.available()) {
        return;
      }
      return window.fbq('trackCustom', 'CustomEvent', {
        category: category,
        action: action,
        label: label,
        value: value
      });
    };

    JqueryTrackingFacebookAdapter.prototype.trackClick = function(source) {
      return this.trackEvent('button', 'click', source);
    };

    JqueryTrackingFacebookAdapter.prototype.trackConversion = function() {
      var ref;
      if ((ref = this.options) != null ? ref.doNotTrackConversion : void 0) {
        return;
      }
      if (this.options.channelName != null) {
        if (this.controller.channel() !== this.options.channelName) {
          return;
        }
      }
      if (!this.available()) {
        return;
      }
      return this._trackConversion();
    };

    JqueryTrackingFacebookAdapter.prototype._trackConversion = function() {
      return window.fbq('track', 'Lead');
    };

    JqueryTrackingFacebookAdapter.prototype.available = function() {
      if (window.fbq == null) {
        this.controller.debug('JqueryTrackingFacebookAdapter', '"fbq" not loaded');
      }
      return window.fbq != null;
    };

    return JqueryTrackingFacebookAdapter;

  })();

  this.JqueryTrackingGHelper = (function() {
    function JqueryTrackingGHelper() {}

    JqueryTrackingGHelper.getClientId = function(callback, fallback) {
      if (fallback == null) {
        fallback = null;
      }
      if (typeof ga !== 'undefined') {
        return ga(function(tracker) {
          return callback(tracker.get('clientId'));
        });
      } else {
        return callback(fallback);
      }
    };

    JqueryTrackingGHelper.doGclidMatching = function(channel) {
      var possibleValue;
      if (channel == null) {
        channel = 'paid_search';
      }
      possibleValue = url("?gclid");
      if (possibleValue) {
        $.tracking.channel(channel);
        return $.tracking.campaign(possibleValue);
      }
    };

    return JqueryTrackingGHelper;

  })();

  this.JqueryTracking = (function() {
    JqueryTracking.options = {
      sessionLifeTimeDays: 1,
      cookiePrefix: 'tracking_',
      cookiePath: '.example.com',
      sourceParamName: 'src',
      campaignParamName: 'cmp',
      storageParams: {},
      adapter: []
    };

    function JqueryTracking(options) {
      this.restorParams = bind(this.restorParams, this);
      this.storeParams = bind(this.storeParams, this);
      this.triggerCampaignEvent = bind(this.triggerCampaignEvent, this);
      this.campaign = bind(this.campaign, this);
      this.triggerChannelEvent = bind(this.triggerChannelEvent, this);
      this.channel = bind(this.channel, this);
      this.conversion = bind(this.conversion, this);
      this.click = bind(this.click, this);
      this.event = bind(this.event, this);
      this.remember = bind(this.remember, this);
      this.wasAllreadyTracked = bind(this.wasAllreadyTracked, this);
      this.callAdapters = bind(this.callAdapters, this);
      this.trackBounce = bind(this.trackBounce, this);
      this.loadAdapter = bind(this.loadAdapter, this);
      this.config = bind(this.config, this);
      this.adapter = [];
      this.memory = [];
      this._channel = '';
      this._campaign = '';
      this.options = this.constructor.options;
    }

    JqueryTracking.prototype.init = function(options) {
      this.config(options);
      this.loadAdapter();
      this.storeParams();
      this.restorParams();
      if (this.options.trackBounceIntervalSeconds) {
        return this.trackBounce(this.options.trackBounceIntervalSeconds);
      }
    };

    JqueryTracking.prototype.config = function(options) {
      if (options) {
        this.options = jQuery.extend(true, {}, this.options, options);
      }
      return this.options;
    };

    JqueryTracking.prototype.debug = function() {
      var args, label, ref;
      label = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return (ref = jQuery.debug).log.apply(ref, ["jquery.tracking::" + label].concat(slice.call(args)));
    };

    JqueryTracking.prototype.loadAdapter = function() {
      var adapter, j, len, ref, results;
      ref = this.options.adapter;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        adapter = ref[j];
        if (adapter["class"] in window) {
          this.debug("loadAdapter", adapter["class"]);
          results.push(this.adapter.push(new window[adapter["class"]](adapter, this)));
        } else {
          results.push(this.debug("can not loadAdapter", adapter["class"]));
        }
      }
      return results;
    };

    JqueryTracking.prototype.trackBounce = function(durationInSeconds) {
      var poll, timerCalled;
      timerCalled = 0;
      return (poll = (function(_this) {
        return function() {
          var action;
          if (timerCalled) {
            action = (timerCalled * durationInSeconds).toString() + 's';
            _this.event('adjust bounce rate', action);
          }
          timerCalled++;
          return setTimeout(poll, 1000 * durationInSeconds);
        };
      })(this))();
    };

    JqueryTracking.prototype.callAdapters = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return jQuery.each(this.adapter, (function(_this) {
        return function(index, adapter) {
          _this.debug.apply(_this, [adapter.options["class"] + "::" + method].concat(slice.call(args)));
          return adapter[method].apply(adapter, args);
        };
      })(this));
    };

    JqueryTracking.prototype.wasAllreadyTracked = function(name, value) {
      return indexOf.call(this.memory, id) >= 0;
    };

    JqueryTracking.prototype.remember = function(id) {
      return this.memory.push(id);
    };

    JqueryTracking.prototype.event = function(category, action, label, value, once) {
      var id;
      id = category + "." + action + "." + label + "." + value;
      if (once && this.wasAllreadyTracked(id)) {
        return;
      }
      this.remember(id);
      return this.callAdapters('trackEvent', category, action, label, value);
    };

    JqueryTracking.prototype.click = function(source) {
      return this.callAdapters('trackClick', source);
    };

    JqueryTracking.prototype.conversion = function() {
      return this.callAdapters('trackConversion');
    };

    JqueryTracking.prototype.channel = function(name) {
      if (!name) {
        return this._channel;
      }
      return this._channel = name;
    };

    JqueryTracking.prototype.triggerChannelEvent = function() {
      return this.event('advertising', 'channel', this._channel);
    };

    JqueryTracking.prototype.campaign = function(name) {
      if (!name) {
        return this._campaign;
      }
      return this._campaign = name;
    };

    JqueryTracking.prototype.triggerCampaignEvent = function() {
      return this.event('advertising', 'campaign', this._campaign);
    };

    JqueryTracking.prototype.storeParams = function() {
      return jQuery.each(this.options.storageParams, (function(_this) {
        return function(param, fallback) {
          var possibleOldValue, value;
          possibleOldValue = Cookies.get("" + _this.options.cookiePrefix + param);
          value = url("?" + param) || possibleOldValue || fallback;
          if (possibleOldValue !== value) {
            _this.debug("storeParam::" + _this.options.cookiePrefix, param + "=" + value);
            return Cookies.set("" + _this.options.cookiePrefix + param, value, {
              path: _this.options.cookiePath,
              expires: _this.options.sessionLifeTimeDays
            });
          }
        };
      })(this));
    };

    JqueryTracking.prototype.restorParams = function() {
      return jQuery.each(this.options.storageParams, (function(_this) {
        return function(param, fallback) {
          var value;
          value = Cookies.get("" + _this.options.cookiePrefix + param) || fallback;
          if (value) {
            switch (param) {
              case _this.options.sourceParamName:
                return _this.channel(value);
              case _this.options.campaignParamName:
                return _this.campaign(value);
              default:
                return _this.event('parameter', param, value);
            }
          }
        };
      })(this));
    };

    return JqueryTracking;

  })();

  if (typeof jQuery !== 'undefined') {
    instance = new JqueryTracking();
    $ = jQuery;
    $.extend({
      tracking: function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (!args.length) {
          return instance.config();
        }
        return instance.init(args[0]);
      }
    });
    $.extend($.tracking, instance);
    $.tracking.instance = instance;
  }

  this.JqueryTracking = (function(superClass) {
    extend(JqueryTracking, superClass);

    function JqueryTracking() {
      this.onTrack = bind(this.onTrack, this);
      this.onTrackConversionError = bind(this.onTrackConversionError, this);
      this.init = bind(this.init, this);
      return JqueryTracking.__super__.constructor.apply(this, arguments);
    }

    JqueryTracking.config = {
      initialize: true,
      eventCategory: 'formslider',
      listenOnFormSubmissionPlugin: true,
      conversionErrorEvantName: 'conversion-error',
      sessionLifeTimeDays: 1,
      cookiePrefix: 'tracking_',
      cookiePath: '.example.com',
      sourceParamName: 'utm_source',
      campaignParamName: 'utm_campaign',
      storageParams: {
        'utm_source': 'organic',
        'utm_campaign': 'organic'
      },
      adapter: []
    };

    JqueryTracking.prototype.init = function() {
      var submissionPlugin;
      if (this.config.initialize) {
        $.tracking(this.config);
      }
      this.on('track', this.onTrack);
      if (!this.config.listenOnFormSubmissionPlugin) {
        return;
      }
      submissionPlugin = this.formslider.plugins.get('FormSubmission');
      if (submissionPlugin) {
        this.on(submissionPlugin.config.successEventName, this.onTrackConversion);
        return this.on(submissionPlugin.config.errorEventName, this.onTrackConversionError);
      }
    };

    JqueryTracking.prototype.onTrackConversion = function() {
      return $.tracking.conversion();
    };

    JqueryTracking.prototype.onTrackConversionError = function() {
      return $.tracking.event(this.config.eventCategory, this.config.conversionErrorEvantName);
    };

    JqueryTracking.prototype.onTrack = function(event, source, value, category) {
      if (category == null) {
        category = null;
      }
      return $.tracking.event(category || this.config.eventCategory, source, value, '', '');
    };

    return JqueryTracking;

  })(AbstractFormsliderPlugin);

  this.HistoryJsController = (function(superClass) {
    extend(HistoryJsController, superClass);

    function HistoryJsController() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return HistoryJsController.__super__.constructor.apply(this, arguments);
    }

    HistoryJsController.config = {
      updateUrl: false,
      resetStatesOnLoad: true
    };

    HistoryJsController.prototype.init = function() {
      this.on('after', this.onAfter);
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return History.Adapter.bind(window, 'statechange', this.handleHistoryChange);
    };

    HistoryJsController.prototype.onAfter = function() {
      return this.pushCurrentHistoryState();
    };

    HistoryJsController.prototype.pushCurrentHistoryState = function() {
      var hash, index;
      index = this.index();
      hash = null;
      if (this.config.updateUrl) {
        hash = "?slide=" + index;
      }
      return History.pushState({
        index: index,
        time: this.time
      }, null, hash);
    };

    HistoryJsController.prototype.handleHistoryChange = function(event) {
      var ref, state;
      if (this.formslider.locking.locked) {
        return;
      }
      state = History.getState();
      if (!((state != null ? (ref = state.data) != null ? ref.index : void 0 : void 0) > -1)) {
        return;
      }
      if (this.config.resetStatesOnLoad) {
        if (state.data.time !== this.time) {
          return;
        }
      }
      this.logger.debug('handleHistoryChange', state.data.index);
      return this.formslider.goto(state.data.index);
    };

    return HistoryJsController;

  })(AbstractFormsliderPlugin);

  (function($) {
    return Raven.context(function() {
      $.debug(1);
      return window.formslider = $('.formslider-wrapper').formslider({
        version: 1.1,
        silenceAfterTransition: 100,
        driver: {
          "class": 'DriverFlexslider',
          selector: '.formslider > .slide',
          animationSpeed: 600
        },
        pluginsGlobalConfig: {
          transitionSpeed: 600,
          answersSelector: '.answers',
          answerSelector: '.answer',
          answerSelectedClass: 'selected'
        },
        plugins: [
          {
            "class": 'HistoryJsController'
          }, {
            "class": 'OrderByIdController'
          }, {
            "class": 'NativeOrderController'
          }, {
            "class": 'JqueryAnimate'
          }, {
            "class": 'SlideVisibility'
          }, {
            "class": 'LazyLoad'
          }, {
            "class": 'EqualHeight'
          }, {
            "class": 'LoadingState'
          }, {
            "class": 'ScrollUp',
            config: {
              scrollUpOffset: 40
            }
          }, {
            "class": 'ProgressBarPercent'
          }, {
            "class": 'AnswerMemory'
          }, {
            "class": 'AnswerClick'
          }, {
            "class": 'JqueryInputValidator'
          }, {
            "class": 'TabIndexSetter'
          }, {
            "class": 'InputSync'
          }, {
            "class": 'InputNormalizer'
          }, {
            "class": 'InputFocus'
          }, {
            "class": 'FormSubmission'
          }, {
            "class": 'NavigateOnClick'
          }, {
            "class": 'NavigateOnKey'
          }, {
            "class": 'TrackUserInteraction'
          }, {
            "class": 'TrackSessionInformation'
          }, {
            "class": 'JqueryTracking',
            config: {
              initialize: true,
              cookiePath: 'formslider.github.io',
              adapter: [
                {
                  "class": 'JqueryTrackingGAnalyticsAdapter'
                }
              ]
            }
          }, {
            "class": 'DramaticLoader',
            config: {
              duration: 600
            }
          }, {
            "class": 'AddSlideClasses'
          }, {
            "class": 'DirectionPolicyByRole',
            config: {
              zipcode: {
                commingFrom: ['question'],
                goingTo: ['loader', 'question']
              },
              loader: {
                commingFrom: ['zipcode'],
                goingTo: ['contact']
              },
              contact: {
                commingFrom: ['loader'],
                goingTo: ['confirmation']
              },
              confirmation: {
                goingTo: ['none']
              }
            }
          }
        ]
      });
    });
  })(jQuery);

}).call(this);
