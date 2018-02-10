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
      this.index = bind(this.index, this);
      this.goto = bind(this.goto, this);
      this.config = ObjectExtender.extend({}, DriverFlexslider.config, this.config);
      this.config.after = this._internOnAfter;
      this.config.conditionalBefore = this._internOnBefore;
      this.config.start = this.onReady;
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
      return this.formslider.driver.index();
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
      var $answers;
      $answers = $(this.config.answerSelector, this.container);
      return $answers.on('mouseup', this.onAnswerClicked);
    };

    AnswerClick.prototype.onAnswerClicked = function(event) {
      var $allAnswersinRow, $answer, $answerRow;
      event.preventDefault();
      $answer = $(event.currentTarget);
      $answerRow = $answer.closest(this.config.answersSelector);
      $allAnswersinRow = $(this.config.answerSelector, $answerRow);
      $allAnswersinRow.removeClass(this.config.answerSelectedClass);
      $answer.addClass(this.config.answerSelectedClass);
      return this.trigger('question-answered', $answer, $('input', $answer).val(), this.index());
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
      return this.memoryBySlideId = {};
    };

    AnswerMemory.prototype.memorize = function(event, $answer, value, slideIndex) {
      var $slide, slideId;
      $slide = $(this.slides.get(slideIndex));
      slideId = $slide.data('id');
      return this.memoryBySlideId[slideId] = {
        id: $('input', $answer).prop('id'),
        value: value
      };
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
        "class": 'FormSubmitterCollect',
        endpoint: '#',
        method: 'POST'
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
      if (this.config.loadHiddenFrameOnSuccess == null) {
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
      var $input, $inputs, $other, $others, input, j, k, len, len1, other, result;
      result = {};
      $inputs = $('input', this.plugin.container);
      for (j = 0, len = $inputs.length; j < len; j++) {
        input = $inputs[j];
        $input = $(input);
        if ($input.is(':checkbox') || $input.is(':radio')) {
          if ($input.is(':checked')) {
            result[$input.attr('name')] = $input.val();
          }
        } else {
          result[$input.attr('name')] = $input.val();
        }
      }
      $others = $('select, textarea', this.plugin.container);
      for (k = 0, len1 = $others.length; k < len1; k++) {
        other = $others[k];
        $other = $(other);
        result[$other.attr('name')] = $other.val();
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

    FormSubmitterSubmit.prototype.submit = function(event, slide) {};

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
      waitBeforeFocus: 200,
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
      return setTimeout(function() {
        return $input.first().focus();
      }, this.config.waitBeforeFocus);
    };

    return InputFocus;

  })(AbstractFormsliderPlugin);

  this.InputNormalizer = (function(superClass) {
    extend(InputNormalizer, superClass);

    function InputNormalizer() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.init = bind(this.init, this);
      return InputNormalizer.__super__.constructor.apply(this, arguments);
    }

    InputNormalizer.config = {
      selector: 'input:visible'
    };

    InputNormalizer.prototype.init = function() {
      return this.prepareInputs();
    };

    InputNormalizer.prototype.prepareInputs = function() {
      $(this.config.selector, this.container).each(function(index, input) {
        var $input, attribute, j, len, ref;
        $input = $(input);
        if ($input.attr('required')) {
          $input.data('required', 'required');
          $input.data('aria-required', 'true');
        }
        ref = ['inputmode', 'autocompletetype'];
        for (j = 0, len = ref.length; j < len; j++) {
          attribute = ref[j];
          if ($input.attr(attribute)) {
            $input.data("x-" + attribute, $input.attr(attribute));
          }
        }
      });
    };

    return InputNormalizer;

  })(AbstractFormsliderPlugin);

  this.InputSync = (function(superClass) {
    extend(InputSync, superClass);

    function InputSync() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputSync.__super__.constructor.apply(this, arguments);
    }

    InputSync.config = {
      selector: 'input',
      attribute: 'name'
    };

    InputSync.prototype.init = function() {
      this.storage = {};
      return this.on('after', this.onAfter);
    };

    InputSync.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      var $inputsHere, $inputsThere;
      $inputsHere = $(this.config.selector, prevSlide);
      $inputsHere.each((function(_this) {
        return function(index, input) {
          var $input;
          $input = $(input);
          return _this.storage[$input.attr(_this.config.attribute)] = $input.val();
        };
      })(this));
      $inputsThere = $(this.config.selector, currentSlide);
      return $inputsThere.each((function(_this) {
        return function(index, input) {
          var $input, inputName;
          $input = $(input);
          inputName = $input.attr(_this.config.attribute);
          if (_this.storage[inputName]) {
            return $input.val(_this.storage[inputName]);
          }
        };
      })(this));
    };

    return InputSync;

  })(AbstractFormsliderPlugin);

  this.JqueryValidate = (function(superClass) {
    extend(JqueryValidate, superClass);

    function JqueryValidate() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.onValidate = bind(this.onValidate, this);
      this.init = bind(this.init, this);
      return JqueryValidate.__super__.constructor.apply(this, arguments);
    }

    JqueryValidate.config = {
      selector: 'input:visible',
      validateOnEvents: ['leaving.next'],
      forceMaxLengthJs: "javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);",
      messages: {
        required: 'Required',
        maxlength: 'To long',
        minlength: 'To short',
        email: 'Enter valid E-Mail'
      }
    };

    JqueryValidate.prototype.init = function() {
      var eventName, j, len, ref;
      ref = this.config.validateOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onValidate);
      }
      this.prepareInputs();
      return this.trigger("validation.prepared");
    };

    JqueryValidate.prototype.onValidate = function(event, currentSlide, direction, nextSlide) {
      var $inputs, currentRole;
      $inputs = $(this.config.selector, currentSlide);
      if (!$inputs.length) {
        return;
      }
      currentRole = $(currentSlide).data('role');
      if (!$inputs.valid()) {
        $inputs.filter('.error').first().focus();
        this.trigger("validation.invalid." + currentRole, currentSlide);
        event.canceled = true;
        return false;
      }
      return this.trigger("validation.valid." + currentRole, currentSlide);
    };

    JqueryValidate.prototype.prepareInputs = function() {
      return $(this.config.selector, this.container).each((function(_this) {
        return function(index, input) {
          var $input, attribute, j, len, ref;
          $input = $(input);
          if ($input.attr('required')) {
            $input.data('data-rule-required', 'true');
            $input.data('data-msg-required', _this.config.messages.required);
          }
          if ($input.data('type') === 'number') {
            $input.attr('pattern', '\\d*');
            $input.attr('inputmode', 'numeric');
          }
          if ($input.data('without-spinner')) {
            $input.addClass('without-spinner');
          }
          ref = ['maxlength', 'minlength'];
          for (j = 0, len = ref.length; j < len; j++) {
            attribute = ref[j];
            if ($input.attr(attribute)) {
              $input.data("data-rule-" + attribute, $input.attr(attribute));
              $input.data("data-msg-" + attribute, _this.config.messages[attribute]);
            }
          }
          if ($input.data('force-max-length')) {
            $input.attr('oninput', _this.config.forceMaxLengthJs);
          }
          if ($input.attr('type') === 'email') {
            return $input.data('data-msg-email', _this.config.messages.email);
          }
        };
      })(this));
    };

    return JqueryValidate;

  })(AbstractFormsliderPlugin);

  this.AddSlideClasses = (function(superClass) {
    extend(AddSlideClasses, superClass);

    function AddSlideClasses() {
      this._addAnswerCountClasses = bind(this._addAnswerCountClasses, this);
      this._doWithSlide = bind(this._doWithSlide, this);
      this.init = bind(this.init, this);
      return AddSlideClasses.__super__.constructor.apply(this, arguments);
    }

    AddSlideClasses.prototype.init = function() {
      return this.slides.each(this._doWithSlide);
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
      return this.locking = new Locking(false);
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
      if (this.locking.locked) {
        return false;
      }
      this.locking.lock();
      this.logger.debug("start(" + this.config.duration + ")");
      return setTimeout(this.doAnimation, this.config.duration);
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
      this.logger.debug('pushCurrentHistoryState', hash);
      return history.pushState({
        index: index,
        time: this.time
      }, "index " + index, hash);
    };

    BrowserHistoryController.prototype.handleHistoryChange = function(event) {
      var ref, state;
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
      var keyCode;
      keyCode = event.keyCode || event.which;
      if (keyCode !== event.data.code) {
        return;
      }
      return this.runTimeout(this.formslider[event.data.action], event.data.wait);
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
      this.on('after', this.doUpdate);
      this.visible = true;
      this.countMax = this.slidesThatCount();
      this.wrapper = $(this.config.selectorWrapper);
      this.config = this.configWithDataFrom(this.wrapper);
      this.progressText = $(this.config.selectorText, this.wrapper);
      this.bar = $(this.config.selectorProgress, this.wrapper);
      this.bar.css('transition-duration', (this.config.animationSpeed / 1000) + 's');
      return this._set(0);
    };

    AbstractFormsliderProgressBar.prototype.set = function(indexFromZero, percent) {};

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
      var index;
      index = this.index();
      if (!this.shouldBeVisible(current)) {
        this._set(index);
        return this.hide();
      }
      this.show();
      return this._set(index);
    };

    AbstractFormsliderProgressBar.prototype._set = function(indexFromZero) {
      var percent;
      if (indexFromZero > this.countMax) {
        indexFromZero = this.countMax;
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
          return plugin.inform('campaign', $.tracking.campaign());
        }
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
      return this.container.append($('<input>', {
        type: 'hidden',
        name: "info[" + name + "]",
        value: value
      }));
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
        return function(event, $answer, value, slideIndex) {
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
      this.hide = bind(this.hide, this);
      this.hideAdjescentSlides = bind(this.hideAdjescentSlides, this);
      this.showNextSlide = bind(this.showNextSlide, this);
      this.init = bind(this.init, this);
      return SlideVisibility.__super__.constructor.apply(this, arguments);
    }

    SlideVisibility.config = {
      hideAnimationDuration: 300
    };

    SlideVisibility.prototype.init = function() {
      this.on('before', this.showNextSlide);
      this.on('after', this.hideAdjescentSlides);
      this.hide(this.slides, 0);
      return this.show(this.slideByIndex());
    };

    SlideVisibility.prototype.showNextSlide = function(event, current, direction, next) {
      return this.show(next);
    };

    SlideVisibility.prototype.hideAdjescentSlides = function(event, current, direction, prev) {
      this.hide(this.slideByIndex(this.index() + 1));
      return this.hide(this.slideByIndex(this.index() - 1));
    };

    SlideVisibility.prototype.hide = function(slide, duration) {
      if (duration == null) {
        duration = null;
      }
      if (duration === null) {
        duration = this.config.hideAnimationDuration;
      }
      return $(slide).animate({
        opacity: 0
      }, duration).data('slide-visibility', 0);
    };

    SlideVisibility.prototype.show = function(slide) {
      return $(slide).finish().css('opacity', 1).data('slide-visibility', 1);
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
      if (this.listener[name] == null) {
        return;
      }
      event = {
        type: name,
        tags: tags,
        canceled: false
      };
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
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ($.debug.isEnabled()) {
        return (ref = $.debug).warn.apply(ref, arguments);
      }
      return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn.apply(console, arguments) : void 0 : void 0;
    };

    Logger.prototype.error = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ($.debug.isEnabled()) {
        return (ref = $.debug).error.apply(ref, arguments);
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
      this.onResize = bind(this.onResize, this);
      this.onReady = bind(this.onReady, this);
      this.onAfter = bind(this.onAfter, this);
      this.onBefore = bind(this.onBefore, this);
      this.loadPlugins = bind(this.loadPlugins, this);
      this.setupDriver = bind(this.setupDriver, this);
      this.setupConfig = bind(this.setupConfig, this);
      this.index = 0;
      this.logger = new Logger('jquery.formslider');
      if (!this.container.length) {
        this.logger.error('container is empty');
        return;
      }
      this.setupConfig(config);
      this.firstInteraction = false;
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
      this.ready = true;
      this.events.trigger('ready');
      return this.locking.unlock();
    };

    FormSlider.prototype.onResize = function() {
      return this.events.trigger('resize');
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
        "class": 'AddSlideClasses'
      }, {
        "class": 'AnswerClick'
      }, {
        "class": 'InputFocus'
      }, {
        "class": 'JqueryValidate'
      }, {
        "class": 'InputNormalizer'
      }, {
        "class": 'InputSync'
      }, {
        "class": 'NextOnKey'
      }, {
        "class": 'ArrowNavigation'
      }, {
        "class": 'TabIndexSetter'
      }, {
        "class": 'NextOnClick'
      }, {
        "class": 'LoadingState'
      }, {
        "class": 'ProgressBarPercent'
      }, {
        "class": 'TrackUserInteraction'
      }, {
        "class": 'SimpleLoader'
      }, {
        "class": 'ContactSlide'
      }, {
        "class": 'ConfirmationSlide'
      }, {
        "class": 'EqualHeight'
      }, {
        "class": 'ScrollUp'
      }, {
        "class": 'LazyLoad'
      }
    ]
  };

  jQuery.fn.formslider = function(config) {
    var $this;
    $this = $(this);
    if (config) {
      $this.data('formslider', new FormSlider($this, config));
    }
    return $this.data('formslider');
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
      if (this.options.doNotTrackConversion != null) {
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
      trackFormSubmission: true,
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
      if (!this.config.trackFormSubmission) {
        return;
      }
      submissionPlugin = this.formslider.plugins.get('FormSubmissionPlugin');
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
      this.logger.debug('pushCurrentHistoryState', "index:" + index);
      return History.pushState({
        index: index,
        time: this.time
      }, null, hash);
    };

    HistoryJsController.prototype.handleHistoryChange = function(event) {
      var ref, state;
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
            "class": 'BrowserHistoryController'
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
            "class": 'JqueryValidate'
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXNsaWRlci5qcyIsInNvdXJjZXMiOlsiZm9ybXNsaWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0E7QUFBQSxNQUFBLGlDQUFBO0lBQUE7Ozs7OztFQUFNLElBQUMsQ0FBQTtJQUNMLGdCQUFDLENBQUEsTUFBRCxHQUNFO01BQUEsUUFBQSxFQUFnQixzQkFBaEI7TUFDQSxTQUFBLEVBQWdCLE9BRGhCO01BRUEsY0FBQSxFQUFnQixHQUZoQjtNQUdBLFlBQUEsRUFBZ0IsSUFIaEI7TUFJQSxNQUFBLEVBQWdCLElBSmhCO01BS0EsWUFBQSxFQUFnQixLQUxoQjtNQU1BLFVBQUEsRUFBZ0IsS0FOaEI7TUFPQSxTQUFBLEVBQWdCLEtBUGhCO01BUUEsUUFBQSxFQUFnQixLQVJoQjtNQVNBLGFBQUEsRUFBZ0IsS0FUaEI7OztJQVdXLDBCQUFDLFNBQUQsRUFBYSxPQUFiLEVBQXNCLFFBQXRCLEVBQWlDLE9BQWpDLEVBQTJDLE9BQTNDO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFBWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsVUFBRDs7Ozs7TUFDdEQsSUFBQyxDQUFBLE1BQUQsR0FBVSxjQUFjLENBQUMsTUFBZixDQUFzQixFQUF0QixFQUEwQixnQkFBZ0IsQ0FBQyxNQUEzQyxFQUFtRCxJQUFDLENBQUEsTUFBcEQ7TUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBNEIsSUFBQyxDQUFBO01BQzdCLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsR0FBNEIsSUFBQyxDQUFBO01BQzdCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUE0QixJQUFDLENBQUE7TUFFN0IsSUFBQyxDQUFBLE1BQUQsR0FBNEIsQ0FBQSxDQUFFLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBVixFQUFvQixJQUFDLENBQUEsU0FBckI7TUFFNUIsSUFBQyxDQUFBLFNBQVMsQ0FB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ZWVsaW50OiBkaXNhYmxlPW1heF9saW5lX2xlbmd0aFxuIz0gaW5jbHVkZSAuLi8uLi8uLi9kaXN0L3NjcmlwdHMvanF1ZXJ5LmZvcm1zbGlkZXIvc3JjL2NvZmZlZS9qcXVlcnkuZm9ybXNsaWRlci5jb2ZmZWVcblxuIz0gaW5jbHVkZSAuLi8uLi8uLi9kaXN0L3NjcmlwdHMvanF1ZXJ5LmFuaW1hdGUuY3NzL3NyYy9qcXVlcnkuYW5pbWF0ZS5jc3MuY29mZmVlXG4jPSBpbmNsdWRlIC4uLy4uLy4uL2Rpc3Qvc2NyaXB0cy9mb3Jtc2xpZGVyLmFuaW1hdGUuY3NzL3NyYy9mb3Jtc2xpZGVyLmFuaW1hdGUuY3NzLmNvZmZlZVxuIz0gaW5jbHVkZSAuLi8uLi8uLi9kaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5kcmFtYXRpYy5sb2FkZXIvc3JjL2Zvcm1zbGlkZXIuZHJhbWF0aWMubG9hZGVyLmNvZmZlZVxuIz0gaW5jbHVkZSAuLi8uLi8uLi9kaXN0L3NjcmlwdHMvanF1ZXJ5LnRyYWNraW5nL3NyYy9qcXVlcnkudHJhY2tpbmcuY29mZmVlXG4jPSBpbmNsdWRlIC4uLy4uLy4uL2Rpc3Qvc2NyaXB0cy9mb3Jtc2xpZGVyLmpxdWVyeS50cmFja2luZy9zcmMvZm9ybXNsaWRlci5qcXVlcnkudHJhY2tpbmcuY29mZmVlXG4jPSBpbmNsdWRlIC4uLy4uLy4uL2Rpc3Qvc2NyaXB0cy9mb3Jtc2xpZGVyLmhpc3RvcnkuanMvc3JjL2Zvcm1zbGlkZXIuaGlzdG9yeS5qcy5jb2ZmZWVcblxuIyBjb2ZmZWVsaW50OiBlbmFibGU9bWF4X2xpbmVfbGVuZ3RoXG5cbigoJCkgLT5cblxuICBSYXZlbi5jb250ZXh0KCAtPlxuICAgICQuZGVidWcoMSlcblxuICAgIHdpbmRvdy5mb3Jtc2xpZGVyID0gJCgnLmZvcm1zbGlkZXItd3JhcHBlcicpLmZvcm1zbGlkZXIoXG4gICAgICB2ZXJzaW9uOiAxLjFcblxuICAgICAgc2lsZW5jZUFmdGVyVHJhbnNpdGlvbjogMTAwXG5cbiAgICAgIGRyaXZlcjpcbiAgICAgICAgY2xhc3M6ICAgICdEcml2ZXJGbGV4c2xpZGVyJ1xuICAgICAgICBzZWxlY3RvcjogJy5mb3Jtc2xpZGVyID4gLnNsaWRlJ1xuICAgICAgICBhbmltYXRpb25TcGVlZDogNjAwXG5cbiAgICAgIHBsdWdpbnNHbG9iYWxDb25maWc6XG4gICAgICAgIHRyYW5zaXRpb25TcGVlZDogNjAwXG4gICAgICAgIGFuc3dlcnNTZWxlY3RvcjogJy5hbnN3ZXJzJ1xuICAgICAgICBhbnN3ZXJTZWxlY3RvcjogICcuYW5zd2VyJ1xuICAgICAgICBhbnN3ZXJTZWxlY3RlZENsYXNzOiAnc2VsZWN0ZWQnXG5cbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgIyBwcmV2L25leHQgY29udHJvbGxlciBwbHVnaW5cbiAgICAgICAgeyBjbGFzczogJ0Jyb3dzZXJIaXN0b3J5Q29udHJvbGxlcicgfVxuICAgICAgICB7IGNsYXNzOiAnT3JkZXJCeUlkQ29udHJvbGxlcicgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdOYXRpdmVPcmRlckNvbnRyb2xsZXInICAgIH1cblxuICAgICAgICAjdmlld1xuICAgICAgICB7IGNsYXNzOiAnSnF1ZXJ5QW5pbWF0ZScgICAgICAgICAgICB9XG5cbiAgICAgICAgeyBjbGFzczogJ1NsaWRlVmlzaWJpbGl0eScgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnTGF6eUxvYWQnICAgICAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdFcXVhbEhlaWdodCcgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0xvYWRpbmdTdGF0ZScgICAgICAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdTY3JvbGxVcCdcbiAgICAgICAgICBjb25maWc6XG4gICAgICAgICAgICAgIHNjcm9sbFVwT2Zmc2V0OiA0MFxuICAgICAgICB9XG5cbiAgICAgICAgIyBwcm9ncmVzc2JhclxuICAgICAgICB7IGNsYXNzOiAnUHJvZ3Jlc3NCYXJQZXJjZW50JyAgICAgICB9XG5cbiAgICAgICAgIyBmb3JtXG4gICAgICAgIHsgY2xhc3M6ICdBbnN3ZXJNZW1vcnknICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0Fuc3dlckNsaWNrJyAgICAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnSnF1ZXJ5VmFsaWRhdGUnICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdUYWJJbmRleFNldHRlcicgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0lucHV0U3luYycgICAgICAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnSW5wdXROb3JtYWxpemVyJyAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdJbnB1dEZvY3VzJyAgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0Zvcm1TdWJtaXNzaW9uJyAgICAgICAgICAgfVxuXG4gICAgICAgICMgbmF2aWdhdGlvblxuICAgICAgICB7IGNsYXNzOiAnTmF2aWdhdGVPbkNsaWNrJyAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdOYXZpZ2F0ZU9uS2V5JyAgICAgICAgICAgIH1cblxuICAgICAgICAjIHRyYWNraW5nXG4gICAgICAgIHsgY2xhc3M6ICdUcmFja1VzZXJJbnRlcmFjdGlvbicgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ1RyYWNrU2Vzc2lvbkluZm9ybWF0aW9uJyAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdKcXVlcnlUcmFja2luZydcbiAgICAgICAgICBjb25maWc6XG4gICAgICAgICAgICBpbml0aWFsaXplOiB0cnVlXG4gICAgICAgICAgICBjb29raWVQYXRoOiAnZm9ybXNsaWRlci5naXRodWIuaW8nXG4gICAgICAgICAgICBhZGFwdGVyOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzczogJ0pxdWVyeVRyYWNraW5nR0FuYWx5dGljc0FkYXB0ZXInXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuXG4gICAgICAgICMgbG9hZGVyXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ0RyYW1hdGljTG9hZGVyJ1xuICAgICAgICAgIGNvbmZpZzpcbiAgICAgICAgICAgIGR1cmF0aW9uOiA2MDBcbiAgICAgICAgfVxuXG4gICAgICAgICMgZ2VuZXJpY1xuICAgICAgICB7IGNsYXNzOiAnQWRkU2xpZGVDbGFzc2VzJyAgICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ0RpcmVjdGlvblBvbGljeUJ5Um9sZSdcbiAgICAgICAgICBjb25maWc6XG4gICAgICAgICAgICB6aXBjb2RlOlxuICAgICAgICAgICAgICBjb21taW5nRnJvbTogWydxdWVzdGlvbiddXG4gICAgICAgICAgICAgIGdvaW5nVG86IFsnbG9hZGVyJywgJ3F1ZXN0aW9uJ11cblxuICAgICAgICAgICAgbG9hZGVyOlxuICAgICAgICAgICAgICBjb21taW5nRnJvbTogWyd6aXBjb2RlJ11cbiAgICAgICAgICAgICAgZ29pbmdUbzogWydjb250YWN0J11cblxuICAgICAgICAgICAgY29udGFjdDpcbiAgICAgICAgICAgICAgY29tbWluZ0Zyb206IFsnbG9hZGVyJ11cbiAgICAgICAgICAgICAgZ29pbmdUbzogWydjb25maXJtYXRpb24nXVxuXG4gICAgICAgICAgICBjb25maXJtYXRpb246XG4gICAgICAgICAgICAgIGdvaW5nVG86IFsnbm9uZSddXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICApXG5cblxuICApXG5cblxuKShqUXVlcnkpXG4iXX0=
