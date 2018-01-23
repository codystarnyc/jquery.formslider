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
      this.moveSlide = bind(this.moveSlide, this);
      this.addSlide = bind(this.addSlide, this);
      this.removeSlide = bind(this.removeSlide, this);
      this._internOnAfter = bind(this._internOnAfter, this);
      this.index = bind(this.index, this);
      this.get = bind(this.get, this);
      this.goto = bind(this.goto, this);
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.config = ObjectExtender.extend({}, DriverFlexslider.config, this.config);
      this.config.after = this._internOnAfter;
      this.config.conditionalBefore = this.onBefore;
      this.config.start = this.onReady;
      this.slides = $(this.config.selector, this.container);
      this.container.flexslider(this.config);
      this.instance = this.container.data('flexslider');
    }

    DriverFlexslider.prototype.next = function() {
      return this.container.flexslider("next");
    };

    DriverFlexslider.prototype.prev = function() {
      return this.container.flexslider("prev");
    };

    DriverFlexslider.prototype.goto = function(indexFromZero) {
      return this.container.flexslider(indexFromZero, true);
    };

    DriverFlexslider.prototype.get = function(indexFromZero) {
      if (indexFromZero === void 0) {
        indexFromZero = this.index();
      }
      return this.slides.get(indexFromZero);
    };

    DriverFlexslider.prototype.index = function() {
      return this.instance.currentSlide;
    };

    DriverFlexslider.prototype._internOnAfter = function(slider) {
      if (slider.lastSlide === slider.currentSlide) {
        return;
      }
      return this.onAfter(slider);
    };

    DriverFlexslider.prototype.removeSlide = function(slide) {
      return this.instance.removeSlide(slide);
    };

    DriverFlexslider.prototype.addSlide = function(slide, position) {
      return this.instance.addSlide(slide, position);
    };

    DriverFlexslider.prototype.moveSlide = function(slide, position) {
      return this.instance.moveSlide(slide, position);
    };

    return DriverFlexslider;

  })();

  this.AbstractFormsliderPlugin = (function() {
    function AbstractFormsliderPlugin(formslider, config) {
      this.formslider = formslider;
      this.slideByIndex = bind(this.slideByIndex, this);
      this.slideById = bind(this.slideById, this);
      this.slideByRole = bind(this.slideByRole, this);
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

    AbstractFormsliderPlugin.prototype.slideByRole = function(role) {
      return $(".slide-role-" + role, this.container);
    };

    AbstractFormsliderPlugin.prototype.slideById = function(id) {
      return $(".slide-id-" + id, this.container);
    };

    AbstractFormsliderPlugin.prototype.slideByIndex = function(indexFromZero) {
      return this.slides.get(indexFromZero);
    };

    return AbstractFormsliderPlugin;

  })();

  this.AnswerClickPlugin = (function(superClass) {
    extend(AnswerClickPlugin, superClass);

    function AnswerClickPlugin() {
      this.onAnswerClicked = bind(this.onAnswerClicked, this);
      this.init = bind(this.init, this);
      return AnswerClickPlugin.__super__.constructor.apply(this, arguments);
    }

    AnswerClickPlugin.prototype.init = function() {
      var $answers;
      $answers = $(this.config.answerSelector, this.container);
      return $answers.on('mouseup', this.onAnswerClicked);
    };

    AnswerClickPlugin.prototype.onAnswerClicked = function(event) {
      var $allAnswersinRow, $answer, $answerRow;
      event.preventDefault();
      $answer = $(event.currentTarget);
      $answerRow = $answer.closest(this.config.answersSelector);
      $allAnswersinRow = $(this.config.answerSelector, $answerRow);
      $allAnswersinRow.removeClass(this.config.answerSelectedClass);
      $answer.addClass(this.config.answerSelectedClass);
      return this.trigger('question-answered', $answer, $('input', $answer).val(), this.formslider.index());
    };

    return AnswerClickPlugin;

  })(AbstractFormsliderPlugin);

  this.FormSubmissionPlugin = (function(superClass) {
    extend(FormSubmissionPlugin, superClass);

    function FormSubmissionPlugin() {
      this.onFail = bind(this.onFail, this);
      this.onDone = bind(this.onDone, this);
      this.onSubmit = bind(this.onSubmit, this);
      this.init = bind(this.init, this);
      return FormSubmissionPlugin.__super__.constructor.apply(this, arguments);
    }

    FormSubmissionPlugin.config = {
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

    FormSubmissionPlugin.prototype.init = function() {
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

    FormSubmissionPlugin.prototype.onSubmit = function(event, currentSlide) {
      if (this.isCanceled(event)) {
        return;
      }
      return this.submitter.submit(event, currentSlide);
    };

    FormSubmissionPlugin.prototype.onDone = function() {
      this.trigger(this.config.successEventName);
      this.loadHiddenFrameOnSuccess();
      return this.logger.debug('onDone');
    };

    FormSubmissionPlugin.prototype.onFail = function() {
      this.logger.error('onFail', this.config.errorEventName);
      return this.trigger(this.config.errorEventName);
    };

    FormSubmissionPlugin.prototype.loadHiddenFrameOnSuccess = function(url) {
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

    return FormSubmissionPlugin;

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

  this.InputFocusPlugin = (function(superClass) {
    extend(InputFocusPlugin, superClass);

    function InputFocusPlugin() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputFocusPlugin.__super__.constructor.apply(this, arguments);
    }

    InputFocusPlugin.config = {
      selector: 'input:visible',
      waitBeforeFocus: 200,
      disableOnMobile: true
    };

    InputFocusPlugin.prototype.init = function() {
      return this.on('after', this.onAfter);
    };

    InputFocusPlugin.prototype.onAfter = function(e, currentSlide, direction, prevSlide) {
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

    return InputFocusPlugin;

  })(AbstractFormsliderPlugin);

  this.InputSyncPlugin = (function(superClass) {
    extend(InputSyncPlugin, superClass);

    function InputSyncPlugin() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputSyncPlugin.__super__.constructor.apply(this, arguments);
    }

    InputSyncPlugin.config = {
      selector: 'input',
      attribute: 'name'
    };

    InputSyncPlugin.prototype.init = function() {
      this.storage = {};
      return this.on('after', this.onAfter);
    };

    InputSyncPlugin.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
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

    return InputSyncPlugin;

  })(AbstractFormsliderPlugin);

  this.JqueryValidatePlugin = (function(superClass) {
    extend(JqueryValidatePlugin, superClass);

    function JqueryValidatePlugin() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.onValidate = bind(this.onValidate, this);
      this.init = bind(this.init, this);
      return JqueryValidatePlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryValidatePlugin.config = {
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

    JqueryValidatePlugin.prototype.init = function() {
      var eventName, j, len, ref;
      ref = this.config.validateOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onValidate);
      }
      this.prepareInputs();
      return this.trigger("validation.prepared");
    };

    JqueryValidatePlugin.prototype.onValidate = function(event, currentSlide, direction, nextSlide) {
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

    JqueryValidatePlugin.prototype.prepareInputs = function() {
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

    return JqueryValidatePlugin;

  })(AbstractFormsliderPlugin);

  this.NormalizeInputAttributesPlugin = (function(superClass) {
    extend(NormalizeInputAttributesPlugin, superClass);

    function NormalizeInputAttributesPlugin() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.init = bind(this.init, this);
      return NormalizeInputAttributesPlugin.__super__.constructor.apply(this, arguments);
    }

    NormalizeInputAttributesPlugin.config = {
      selector: 'input:visible'
    };

    NormalizeInputAttributesPlugin.prototype.init = function() {
      return this.prepareInputs();
    };

    NormalizeInputAttributesPlugin.prototype.prepareInputs = function() {
      return $(this.config.selector, this.container).each(function(index, input) {
        var $input, attribute, j, len, ref, results;
        $input = $(input);
        if ($input.attr('required')) {
          $input.data('required', 'required');
          $input.data('aria-required', 'true');
        }
        ref = ['inputmode', 'autocompletetype'];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          attribute = ref[j];
          if ($input.attr(attribute)) {
            results.push($input.data("x-" + attribute, $input.attr(attribute)));
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    };

    return NormalizeInputAttributesPlugin;

  })(AbstractFormsliderPlugin);

  this.TabIndexSetterPlugin = (function(superClass) {
    extend(TabIndexSetterPlugin, superClass);

    function TabIndexSetterPlugin() {
      this.disableTabs = bind(this.disableTabs, this);
      this.enableTabs = bind(this.enableTabs, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return TabIndexSetterPlugin.__super__.constructor.apply(this, arguments);
    }

    TabIndexSetterPlugin.config = {
      selector: 'input, a, select, textarea, button, area, object'
    };

    TabIndexSetterPlugin.prototype.init = function() {
      this.disableTabs();
      this.enableTabs(this.slideByIndex(0));
      return this.on('after', this.onAfter);
    };

    TabIndexSetterPlugin.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      this.disableTabs();
      return this.enableTabs(currentSlide);
    };

    TabIndexSetterPlugin.prototype.enableTabs = function(slide) {
      return $(this.config.selector, slide).each(function(index, el) {
        return $(el).attr('tabindex', index + 1);
      });
    };

    TabIndexSetterPlugin.prototype.disableTabs = function() {
      return $(this.config.selector, this.container).attr('tabindex', '-1');
    };

    return TabIndexSetterPlugin;

  })(AbstractFormsliderPlugin);

  this.AddSlideClassesPlugin = (function(superClass) {
    extend(AddSlideClassesPlugin, superClass);

    function AddSlideClassesPlugin() {
      this._addAnswerCountClasses = bind(this._addAnswerCountClasses, this);
      this._doWithSlide = bind(this._doWithSlide, this);
      this.init = bind(this.init, this);
      return AddSlideClassesPlugin.__super__.constructor.apply(this, arguments);
    }

    AddSlideClassesPlugin.prototype.init = function() {
      return this.slides.each(this._doWithSlide);
    };

    AddSlideClassesPlugin.prototype._doWithSlide = function(index, slide) {
      var $slide;
      $slide = $(slide);
      this._addAnswerCountClasses(index, $slide);
      this._addSlideNumberClass(index, $slide);
      this._addRoleClass($slide);
      return this._addSlideIdClass($slide);
    };

    AddSlideClassesPlugin.prototype._addAnswerCountClasses = function(index, $slide) {
      var answerCount;
      answerCount = $(this.config.answerSelector, $slide).length;
      return $slide.addClass("answer-count-" + answerCount).data('answer-count', answerCount);
    };

    AddSlideClassesPlugin.prototype._addRoleClass = function($slide) {
      var role;
      role = $slide.data('role');
      return $slide.addClass("slide-role-" + role);
    };

    AddSlideClassesPlugin.prototype._addSlideNumberClass = function(index, $slide) {
      return $slide.addClass("slide-number-" + index).data('slide-number', index);
    };

    AddSlideClassesPlugin.prototype._addSlideIdClass = function($slide) {
      var id;
      id = $slide.data('id');
      if (id === void 0) {
        id = $slide.data('role');
      }
      return $slide.addClass("slide-id-" + id);
    };

    return AddSlideClassesPlugin;

  })(AbstractFormsliderPlugin);

  this.DoOnEventPlugin = (function(superClass) {
    extend(DoOnEventPlugin, superClass);

    function DoOnEventPlugin() {
      this.init = bind(this.init, this);
      return DoOnEventPlugin.__super__.constructor.apply(this, arguments);
    }

    DoOnEventPlugin.prototype.init = function() {
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

    return DoOnEventPlugin;

  })(AbstractFormsliderPlugin);

  this.DoOneTimeOnEventPlugin = (function(superClass) {
    extend(DoOneTimeOnEventPlugin, superClass);

    function DoOneTimeOnEventPlugin() {
      this.init = bind(this.init, this);
      return DoOneTimeOnEventPlugin.__super__.constructor.apply(this, arguments);
    }

    DoOneTimeOnEventPlugin.prototype.init = function() {
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

    return DoOneTimeOnEventPlugin;

  })(AbstractFormsliderPlugin);

  this.ArrowNavigationPlugin = (function(superClass) {
    extend(ArrowNavigationPlugin, superClass);

    function ArrowNavigationPlugin() {
      this.onKeyPressed = bind(this.onKeyPressed, this);
      this.init = bind(this.init, this);
      return ArrowNavigationPlugin.__super__.constructor.apply(this, arguments);
    }

    ArrowNavigationPlugin.config = {
      selector: document,
      keyCodeLeft: 37,
      keyCodeRight: 39
    };

    ArrowNavigationPlugin.prototype.init = function() {
      var $trigger;
      $trigger = $(this.config.selector);
      return $trigger.keydown(this.onKeyPressed);
    };

    ArrowNavigationPlugin.prototype.onKeyPressed = function(event) {
      var keyCode;
      keyCode = event.keyCode || event.which;
      switch (keyCode) {
        case this.config.keyCodeLeft:
          return this.formslider.prev();
        case this.config.keyCodeRight:
          return this.formslider.next();
      }
    };

    return ArrowNavigationPlugin;

  })(AbstractFormsliderPlugin);

  this.BrowserHistoryPlugin = (function(superClass) {
    extend(BrowserHistoryPlugin, superClass);

    function BrowserHistoryPlugin() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return BrowserHistoryPlugin.__super__.constructor.apply(this, arguments);
    }

    BrowserHistoryPlugin.config = {
      updateHash: true,
      resetStatesOnLoad: true
    };

    BrowserHistoryPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      this.dontUpdateHistoryNow = false;
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return $(window).bind('popstate', this.handleHistoryChange);
    };

    BrowserHistoryPlugin.prototype.onAfter = function() {
      if (this.dontUpdateHistoryNow) {
        this.dontUpdateHistoryNow = false;
        return;
      }
      return this.pushCurrentHistoryState();
    };

    BrowserHistoryPlugin.prototype.pushCurrentHistoryState = function() {
      var hash;
      hash = null;
      if (this.config.updateHash) {
        hash = "#" + (this.formslider.index());
      }
      this.logger.debug('pushCurrentHistoryState', hash);
      return history.pushState({
        index: this.formslider.index(),
        time: this.time
      }, "index " + (this.formslider.index()), hash);
    };

    BrowserHistoryPlugin.prototype.handleHistoryChange = function(event) {
      var ref, state;
      if (((ref = event.originalEvent) != null ? ref.state : void 0) == null) {
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

    return BrowserHistoryPlugin;

  })(AbstractFormsliderPlugin);

  this.DirectionPolicyByRolePlugin = (function(superClass) {
    extend(DirectionPolicyByRolePlugin, superClass);

    function DirectionPolicyByRolePlugin() {
      this.checkPermissions = bind(this.checkPermissions, this);
      this.init = bind(this.init, this);
      return DirectionPolicyByRolePlugin.__super__.constructor.apply(this, arguments);
    }

    DirectionPolicyByRolePlugin.config = {};

    DirectionPolicyByRolePlugin.prototype.init = function() {
      return this.on('leaving', this.checkPermissions);
    };

    DirectionPolicyByRolePlugin.prototype.checkPermissions = function(event, current, direction, next) {
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

    return DirectionPolicyByRolePlugin;

  })(AbstractFormsliderPlugin);

  this.NextOnClickPlugin = (function(superClass) {
    extend(NextOnClickPlugin, superClass);

    function NextOnClickPlugin() {
      this.onClick = bind(this.onClick, this);
      this.init = bind(this.init, this);
      return NextOnClickPlugin.__super__.constructor.apply(this, arguments);
    }

    NextOnClickPlugin.config = {
      selector: '.next-button, .answer',
      waitAfterClick: 10
    };

    NextOnClickPlugin.prototype.init = function() {
      var $buttons;
      $buttons = $(this.config.selector, this.container);
      return $buttons.on('mouseup', this.onClick);
    };

    NextOnClickPlugin.prototype.onClick = function(event) {
      event.preventDefault();
      if (!this.timeout) {
        return this.timeout = setTimeout((function(_this) {
          return function() {
            _this.formslider.next();
            return _this.timeout = null;
          };
        })(this), this.config.waitAfterClick);
      }
    };

    return NextOnClickPlugin;

  })(AbstractFormsliderPlugin);

  this.NextOnKeyPlugin = (function(superClass) {
    extend(NextOnKeyPlugin, superClass);

    function NextOnKeyPlugin() {
      this.onKeyPressed = bind(this.onKeyPressed, this);
      this.init = bind(this.init, this);
      return NextOnKeyPlugin.__super__.constructor.apply(this, arguments);
    }

    NextOnKeyPlugin.config = {
      selector: 'input',
      keyCode: 13
    };

    NextOnKeyPlugin.prototype.init = function() {
      var $inputs;
      $inputs = $(this.config.selector, this.container);
      return $inputs.keypress(this.onKeyPressed);
    };

    NextOnKeyPlugin.prototype.onKeyPressed = function(event) {
      var keyCode;
      keyCode = event.keyCode || event.which;
      if (keyCode === this.config.keyCode) {
        return this.formslider.next();
      }
    };

    return NextOnKeyPlugin;

  })(AbstractFormsliderPlugin);

  this.NextSlideResolverPlugin = (function(superClass) {
    extend(NextSlideResolverPlugin, superClass);

    function NextSlideResolverPlugin() {
      this.onResolve = bind(this.onResolve, this);
      this.makeToNextSlide = bind(this.makeToNextSlide, this);
      this.onQuestionAnswered = bind(this.onQuestionAnswered, this);
      this.onReady = bind(this.onReady, this);
      this.init = bind(this.init, this);
      return NextSlideResolverPlugin.__super__.constructor.apply(this, arguments);
    }

    NextSlideResolverPlugin.prototype.init = function() {
      this.on('ready', this.onReady);
      return this.on('before-driver-next', this.onResolve);
    };

    NextSlideResolverPlugin.prototype.onReady = function(event) {
      return this.slides.each((function(_this) {
        return function(index, slide) {
          var $slide, slideBefore;
          $slide = $(slide);
          slideBefore = _this.slides.get(index - 1);
          if (slideBefore && $(slideBefore).data('next-id') === void 0) {
            return $(slideBefore).data('next-id', $slide.data('id')).addClass("next-id-" + ($slide.data('id')));
          }
        };
      })(this));
    };

    NextSlideResolverPlugin.prototype.onQuestionAnswered = function(event, $answer, value, slideIndex) {
      var answerNextId, currentSlide, nextId;
      currentSlide = this.slideByIndex(slideIndex);
      answerNextId = $answer.data('next-id');
      nextId = $(currentSlide).data('next-id');
      if (answerNextId !== void 0) {
        nextId = answerNextId;
      }
      return this.makeToNextSlide(nextId, slideIndex + 1, currentSlide);
    };

    NextSlideResolverPlugin.prototype.makeToNextSlide = function(nextId, insertAtIndex, currentSlide) {
      var nextSlide;
      nextSlide = this.slideById(nextId);
      this.formslider.driver.moveSlide(nextSlide, insertAtIndex);
      return this.trigger('next-slide-changed', nextSlide);
    };

    NextSlideResolverPlugin.prototype.onResolve = function(event) {
      var currentSlide, nextId, nextIdFromAnswer, nextSlide, selectedAnswer;
      currentSlide = this.formslider.driver.get(this.formslider.index());
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
        this.makeToNextSlide(nextId, $(currentSlide).index() + 1, currentSlide);
        return this.trigger('next-slide-changed', nextSlide);
      }
    };

    return NextSlideResolverPlugin;

  })(AbstractFormsliderPlugin);

  this.ProgressBarAdapterAbstract = (function() {
    function ProgressBarAdapterAbstract(plugin1, config1) {
      this.plugin = plugin1;
      this.config = config1;
    }

    return ProgressBarAdapterAbstract;

  })();

  this.ProgressBarAdapterPercent = (function(superClass) {
    extend(ProgressBarAdapterPercent, superClass);

    function ProgressBarAdapterPercent() {
      this._setPercentStepCallback = bind(this._setPercentStepCallback, this);
      this._setPercent = bind(this._setPercent, this);
      this.set = bind(this.set, this);
      return ProgressBarAdapterPercent.__super__.constructor.apply(this, arguments);
    }

    ProgressBarAdapterPercent.prototype.set = function(indexFromZero, percent) {
      return this._setPercent(percent);
    };

    ProgressBarAdapterPercent.prototype._setPercent = function(percent) {
      var startFrom;
      startFrom = parseInt(this.plugin.progressText.text()) || 13;
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

    ProgressBarAdapterPercent.prototype._setPercentStepCallback = function(percent) {
      return this.plugin.progressText.text(Math.ceil(percent) + '%');
    };

    return ProgressBarAdapterPercent;

  })(ProgressBarAdapterAbstract);

  this.ProgressBarAdapterSteps = (function(superClass) {
    extend(ProgressBarAdapterSteps, superClass);

    function ProgressBarAdapterSteps() {
      this._setSteps = bind(this._setSteps, this);
      this.set = bind(this.set, this);
      return ProgressBarAdapterSteps.__super__.constructor.apply(this, arguments);
    }

    ProgressBarAdapterSteps.prototype.set = function(indexFromZero, percent) {
      return this._setSteps(indexFromZero + 1);
    };

    ProgressBarAdapterSteps.prototype._setSteps = function(indexFromOne) {
      return this.plugin.progressText.text(indexFromOne + "/" + this.plugin.countMax);
    };

    return ProgressBarAdapterSteps;

  })(ProgressBarAdapterAbstract);

  this.ProgressBarPlugin = (function(superClass) {
    extend(ProgressBarPlugin, superClass);

    function ProgressBarPlugin() {
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      this.shouldBeVisible = bind(this.shouldBeVisible, this);
      this.set = bind(this.set, this);
      this.doUpdate = bind(this.doUpdate, this);
      this.slidesThatCount = bind(this.slidesThatCount, this);
      this.init = bind(this.init, this);
      return ProgressBarPlugin.__super__.constructor.apply(this, arguments);
    }

    ProgressBarPlugin.config = {
      selectorWrapper: '.progressbar-wrapper',
      selectorText: '.progress-text',
      selectorProgress: '.progress',
      animationSpeed: 300,
      adapter: 'ProgressBarAdapterPercent',
      initialProgress: null,
      dontCountOnRoles: ['loader', 'contact', 'confirmation'],
      hideOnRoles: ['zipcode', 'loader', 'contact', 'confirmation']
    };

    ProgressBarPlugin.prototype.init = function() {
      this.on('after', this.doUpdate);
      this.visible = true;
      this.wrapper = $(this.config.selectorWrapper);
      this.config = this.configWithDataFrom(this.wrapper);
      this.progressText = $(this.config.selectorText, this.wrapper);
      this.bar = $(this.config.selectorProgress, this.wrapper);
      this.bar.css('transition-duration', (this.config.animationSpeed / 1000) + 's');
      this.countMax = this.slidesThatCount();
      this.adapter = new window[this.config.adapter](this, this.config);
      return this.set(0);
    };

    ProgressBarPlugin.prototype.slidesThatCount = function() {
      var j, len, ref, role, substract;
      substract = 0;
      ref = this.config.dontCountOnRoles;
      for (j = 0, len = ref.length; j < len; j++) {
        role = ref[j];
        substract = substract + this.slideByRole(role).length;
      }
      return this.slides.length - substract;
    };

    ProgressBarPlugin.prototype.doUpdate = function(e, current, direction, next) {
      var index;
      index = this.formslider.index();
      if (!this.shouldBeVisible(current)) {
        this.set(index);
        return this.hide();
      }
      this.show();
      return this.set(index);
    };

    ProgressBarPlugin.prototype.set = function(indexFromZero) {
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
      return this.adapter.set(indexFromZero, percent);
    };

    ProgressBarPlugin.prototype.shouldBeVisible = function(slide) {
      var ref;
      return !(ref = $(slide).data('role'), indexOf.call(this.config.hideOnRoles, ref) >= 0);
    };

    ProgressBarPlugin.prototype.hide = function() {
      if (!this.visible) {
        return;
      }
      this.wrapper.animate({
        opacity: 0
      }, this.config.animationSpeed);
      return this.visible = false;
    };

    ProgressBarPlugin.prototype.show = function() {
      if (this.visible) {
        return;
      }
      this.wrapper.animate({
        opacity: 1
      }, this.config.animationSpeed);
      return this.visible = true;
    };

    return ProgressBarPlugin;

  })(AbstractFormsliderPlugin);

  this.LoaderSlidePlugin = (function(superClass) {
    extend(LoaderSlidePlugin, superClass);

    function LoaderSlidePlugin() {
      this.isLoading = bind(this.isLoading, this);
      this.onLeaving = bind(this.onLeaving, this);
      this.onLoaderStart = bind(this.onLoaderStart, this);
      this.init = bind(this.init, this);
      return LoaderSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    LoaderSlidePlugin.config = {
      loaderClass: 'SimpleLoaderImplementation',
      duration: 1000
    };

    LoaderSlidePlugin.prototype.init = function() {
      this.on('after.loader', this.onLoaderStart);
      return this.on('leaving.loader', this.onLeaving);
    };

    LoaderSlidePlugin.prototype.onLoaderStart = function(event, currentSlide, direction, nextSlide) {
      var LoaderClass;
      if (this.isLoading()) {
        return;
      }
      LoaderClass = window[this.config.loaderClass];
      this.loader = new LoaderClass(this, this.config, currentSlide);
      return this.loader.start();
    };

    LoaderSlidePlugin.prototype.onLeaving = function(event, current, direction, next) {
      if (this.isLoading()) {
        return this.cancel(event);
      }
    };

    LoaderSlidePlugin.prototype.isLoading = function() {
      var ref;
      return (ref = this.loader) != null ? ref.animating : void 0;
    };

    return LoaderSlidePlugin;

  })(AbstractFormsliderPlugin);

  this.AbstractFormsliderLoader = (function() {
    AbstractFormsliderLoader.config = {
      duration: 2000
    };

    function AbstractFormsliderLoader(plugin1, config1, slide1) {
      this.plugin = plugin1;
      this.config = config1;
      this.slide = slide1;
      this.stop = bind(this.stop, this);
      this.doAnimation = bind(this.doAnimation, this);
      this.start = bind(this.start, this);
      this.config = ObjectExtender.extend({}, this.constructor.config, this.config);
      this.animating = false;
    }

    AbstractFormsliderLoader.prototype.start = function() {
      if (this.animating) {
        return false;
      }
      this.plugin.logger.debug("start(" + this.config.duration + ")");
      this.animating = true;
      return setTimeout(this.doAnimation, this.config.duration);
    };

    AbstractFormsliderLoader.prototype.doAnimation = function() {
      return this.stop();
    };

    AbstractFormsliderLoader.prototype.stop = function() {
      this.plugin.logger.debug('stop()');
      this.animating = false;
      return this.plugin.formslider.next();
    };

    return AbstractFormsliderLoader;

  })();

  this.SimpleLoaderImplementation = (function(superClass) {
    extend(SimpleLoaderImplementation, superClass);

    function SimpleLoaderImplementation() {
      return SimpleLoaderImplementation.__super__.constructor.apply(this, arguments);
    }

    return SimpleLoaderImplementation;

  })(AbstractFormsliderLoader);

  this.TrackSessionInformationPlugin = (function(superClass) {
    extend(TrackSessionInformationPlugin, superClass);

    function TrackSessionInformationPlugin() {
      this.inform = bind(this.inform, this);
      this.onFirstInteraction = bind(this.onFirstInteraction, this);
      this.init = bind(this.init, this);
      return TrackSessionInformationPlugin.__super__.constructor.apply(this, arguments);
    }

    TrackSessionInformationPlugin.config = {
      onReady: null,
      onReadyInternal: function(plugin) {
        plugin.inform('url', location.href);
        plugin.inform('useragent', navigator.userAgent);
        plugin.inform('referer', document.referrer);
        plugin.inform('dimension', $(window).width() + 'x' + $(window).height());
        plugin.inform('jquery.formslider.version', plugin.formslider.config.version);
        if (plugin.formslider.plugins.isLoaded('JqueryTrackingPlugin')) {
          plugin.inform('channel', $.tracking.channel());
          return plugin.inform('campaign', $.tracking.campaign());
        }
      }
    };

    TrackSessionInformationPlugin.prototype.init = function() {
      return this.on('first-interaction', this.onFirstInteraction);
    };

    TrackSessionInformationPlugin.prototype.onFirstInteraction = function() {
      if (this.config.onReadyInternal) {
        this.config.onReadyInternal(this);
      }
      if (this.config.onReady) {
        return this.config.onReady(this);
      }
    };

    TrackSessionInformationPlugin.prototype.inform = function(name, value) {
      this.track(name, value, 'info');
      return this.container.append($('<input>', {
        type: 'hidden',
        name: "info[" + name + "]",
        value: value
      }));
    };

    return TrackSessionInformationPlugin;

  })(AbstractFormsliderPlugin);

  this.TrackUserInteractionPlugin = (function(superClass) {
    extend(TrackUserInteractionPlugin, superClass);

    function TrackUserInteractionPlugin() {
      this.setupQuestionAnswerTracking = bind(this.setupQuestionAnswerTracking, this);
      this.setupTransportTracking = bind(this.setupTransportTracking, this);
      this.init = bind(this.init, this);
      return TrackUserInteractionPlugin.__super__.constructor.apply(this, arguments);
    }

    TrackUserInteractionPlugin.config = {
      questionAnsweredEvent: 'question-answered'
    };

    TrackUserInteractionPlugin.prototype.init = function() {
      this.setupQuestionAnswerTracking();
      return this.setupTransportTracking();
    };

    TrackUserInteractionPlugin.prototype.setupTransportTracking = function() {
      return this.on("after", (function(_this) {
        return function(event, currentSlide, direction, prevSlide) {
          var index, role;
          index = _this.formslider.index();
          role = $(currentSlide).data('role');
          _this.track("slide-" + index + "-entered", direction);
          return _this.track("slide-role-" + role + "-entered");
        };
      })(this));
    };

    TrackUserInteractionPlugin.prototype.setupQuestionAnswerTracking = function() {
      return this.on('question-answered', (function(_this) {
        return function(event, $answer, value, slideIndex) {
          var eventName;
          eventName = _this.config.questionAnsweredEvent;
          _this.track(eventName, slideIndex);
          return _this.track(eventName + "-" + slideIndex, value);
        };
      })(this));
    };

    return TrackUserInteractionPlugin;

  })(AbstractFormsliderPlugin);

  this.EqualHeightPlugin = (function(superClass) {
    extend(EqualHeightPlugin, superClass);

    function EqualHeightPlugin() {
      this.doEqualize = bind(this.doEqualize, this);
      this.equalizeAll = bind(this.equalizeAll, this);
      this.init = bind(this.init, this);
      return EqualHeightPlugin.__super__.constructor.apply(this, arguments);
    }

    EqualHeightPlugin.config = {
      selector: '.answer .text'
    };

    EqualHeightPlugin.prototype.init = function() {
      this.on('ready', this.equalizeAll);
      this.on('resize', this.equalizeAll);
      return this.on('do-equal-height', this.doEqualize);
    };

    EqualHeightPlugin.prototype.equalizeAll = function() {
      var i, j, ref, results;
      results = [];
      for (i = j = 0, ref = this.slides.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        results.push(this.doEqualize(null, this.slideByIndex(i)));
      }
      return results;
    };

    EqualHeightPlugin.prototype.doEqualize = function(event, slide) {
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

    return EqualHeightPlugin;

  })(AbstractFormsliderPlugin);

  this.LazyLoadPlugin = (function(superClass) {
    extend(LazyLoadPlugin, superClass);

    function LazyLoadPlugin() {
      this._loadLazyCallback = bind(this._loadLazyCallback, this);
      this.doLazyLoad = bind(this.doLazyLoad, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return LazyLoadPlugin.__super__.constructor.apply(this, arguments);
    }

    LazyLoadPlugin.config = {
      lazyClass: 'lazy-load',
      dataKey: 'src'
    };

    LazyLoadPlugin.prototype.init = function() {
      this.doLazyLoad(this.slideByIndex(0));
      this.doLazyLoad(this.slideByIndex(1));
      return this.on('after', this.onAfter);
    };

    LazyLoadPlugin.prototype.onAfter = function() {
      var currentIndex;
      currentIndex = this.formslider.index();
      return this.doLazyLoad(this.slideByIndex(currentIndex + 1));
    };

    LazyLoadPlugin.prototype.doLazyLoad = function(slide) {
      return $("img." + this.config.lazyClass, slide).each(this._loadLazyCallback);
    };

    LazyLoadPlugin.prototype._loadLazyCallback = function(index, el) {
      var $el;
      $el = $(el);
      return $el.attr('src', $el.data(this.config.dataKey)).removeData(this.config.dataKey).removeClass(this.config.lazyClass);
    };

    return LazyLoadPlugin;

  })(AbstractFormsliderPlugin);

  this.LoadingStatePlugin = (function(superClass) {
    extend(LoadingStatePlugin, superClass);

    function LoadingStatePlugin() {
      this.onReady = bind(this.onReady, this);
      this.init = bind(this.init, this);
      return LoadingStatePlugin.__super__.constructor.apply(this, arguments);
    }

    LoadingStatePlugin.config = {
      selector: '.progressbar-wrapper, .formslider-wrapper',
      loadingClass: 'loading',
      loadedClass: 'loaded'
    };

    LoadingStatePlugin.prototype.init = function() {
      return this.on('ready', this.onReady);
    };

    LoadingStatePlugin.prototype.onReady = function() {
      return $(this.config.selector).removeClass(this.config.loadingClass).addClass(this.config.loadedClass);
    };

    return LoadingStatePlugin;

  })(AbstractFormsliderPlugin);

  this.ScrollUpPlugin = (function(superClass) {
    extend(ScrollUpPlugin, superClass);

    function ScrollUpPlugin() {
      this.isOnScreen = bind(this.isOnScreen, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return ScrollUpPlugin.__super__.constructor.apply(this, arguments);
    }

    ScrollUpPlugin.config = {
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

    ScrollUpPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      return this.window = $(window);
    };

    ScrollUpPlugin.prototype.onAfter = function(e, current, direction, prev) {
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

    ScrollUpPlugin.prototype.isOnScreen = function($element) {
      var bounds, viewport;
      viewport = {
        top: this.window.scrollTop()
      };
      viewport.bottom = viewport.top + this.window.height();
      bounds = $element.offset();
      bounds.bottom = bounds.top + $element.outerHeight();
      return !(viewport.bottom < bounds.top - this.config.tolerance || viewport.top > bounds.bottom - this.config.tolerance);
    };

    return ScrollUpPlugin;

  })(AbstractFormsliderPlugin);

  this.SlideVisibilityPlugin = (function(superClass) {
    extend(SlideVisibilityPlugin, superClass);

    function SlideVisibilityPlugin() {
      this.hide = bind(this.hide, this);
      this.hideAdjescentSlides = bind(this.hideAdjescentSlides, this);
      this.showNextSlide = bind(this.showNextSlide, this);
      this.init = bind(this.init, this);
      return SlideVisibilityPlugin.__super__.constructor.apply(this, arguments);
    }

    SlideVisibilityPlugin.config = {
      hideAnimationDuration: 300
    };

    SlideVisibilityPlugin.prototype.init = function() {
      this.on('before', this.showNextSlide);
      this.on('after', this.hideAdjescentSlides);
      this.hide(this.slides, 0);
      return this.show(this.slideByIndex(this.formslider.index()));
    };

    SlideVisibilityPlugin.prototype.showNextSlide = function(event, current, direction, next) {
      return this.show(next);
    };

    SlideVisibilityPlugin.prototype.hideAdjescentSlides = function(event, current, direction, prev) {
      this.hide(this.slideByIndex(this.formslider.index() + 1));
      return this.hide(prev);
    };

    SlideVisibilityPlugin.prototype.hide = function(slide, duration) {
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

    SlideVisibilityPlugin.prototype.show = function(slide) {
      return $(slide).finish().css('opacity', 1).data('slide-visibility', 1);
    };

    return SlideVisibilityPlugin;

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
      var j, len, plugin, results;
      results = [];
      for (j = 0, len = plugins.length; j < len; j++) {
        plugin = plugins[j];
        if (!window[plugin["class"]]) {
          this.formslider.logger.warn("loadAll(" + plugin["class"] + ") -> not found");
          continue;
        }
        results.push(this.load(plugin));
      }
      return results;
    };

    PluginLoader.prototype.load = function(plugin) {
      var PluginClass, config, error, pluginInstance;
      PluginClass = window[plugin["class"]];
      if (plugin.config == null) {
        config = this.globalPluginConfig;
      } else {
        config = ObjectExtender.extend({}, this.globalPluginConfig, plugin.config);
      }
      this.formslider.logger.info("loadPlugin(" + plugin["class"] + ")");
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
      this.id = bind(this.id, this);
      this.index = bind(this.index, this);
      this.onResize = bind(this.onResize, this);
      this.onReady = bind(this.onReady, this);
      this.onAfter = bind(this.onAfter, this);
      this.onBefore = bind(this.onBefore, this);
      this.loadPlugins = bind(this.loadPlugins, this);
      this.setupDriver = bind(this.setupDriver, this);
      this.setupConfig = bind(this.setupConfig, this);
      this.setupConfig(config);
      this.firstInteraction = false;
      this.logger = new Logger('jquery.formslider');
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
      next = this.driver.get(nextIndex);
      nextRole = $(next).data('role');
      eventData = [current, direction, next];
      event = (ref = this.events).trigger.apply(ref, ["leaving." + currentRole + "." + direction].concat(slice.call(eventData)));
      if (event.canceled) {
        this.locking.unlock();
        return false;
      }
      (ref1 = this.events).trigger.apply(ref1, ["before." + nextRole + "." + direction].concat(slice.call(eventData)));
      this.lastId = this.id();
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
      return this.locking.unlock();
    };

    FormSlider.prototype.onReady = function() {
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

    FormSlider.prototype.id = function() {
      return $(this.driver.get()).data('id');
    };

    FormSlider.prototype.next = function() {
      if (this.locking.locked) {
        return;
      }
      this.events.trigger('before-driver-next');
      if (this.index() + 1 > this.driver.slides.length - 1) {
        return;
      }
      return this.driver.next();
    };

    FormSlider.prototype.prev = function() {
      if (this.locking.locked) {
        return;
      }
      if (this.index() > 0) {
        return this.driver.prev();
      }
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
        "class": 'AddSlideClassesPlugin'
      }, {
        "class": 'AnswerClickPlugin'
      }, {
        "class": 'InputFocusPlugin'
      }, {
        "class": 'BrowserHistoryPlugin'
      }, {
        "class": 'JqueryValidatePlugin'
      }, {
        "class": 'NormalizeInputAttributesPlugin'
      }, {
        "class": 'InputSyncPlugin'
      }, {
        "class": 'NextOnKeyPlugin'
      }, {
        "class": 'ArrowNavigationPlugin'
      }, {
        "class": 'TabIndexSetterPlugin'
      }, {
        "class": 'NextOnClickPlugin'
      }, {
        "class": 'LoadingStatePlugin'
      }, {
        "class": 'ProgressBarPlugin'
      }, {
        "class": 'TrackUserInteractionPlugin'
      }, {
        "class": 'LoaderSlidePlugin'
      }, {
        "class": 'ContactSlidePlugin'
      }, {
        "class": 'ConfirmationSlidePlugin'
      }, {
        "class": 'EqualHeightPlugin'
      }, {
        "class": 'ScrollUpPlugin'
      }, {
        "class": 'LazyLoadPlugin'
      }
    ]
  };

  jQuery.fn.formslider = function(config) {
    var $this;
    $this = $(this);
    if (config) {
      $this.formslider = new FormSlider($this, config);
    }
    return $this.formslider;
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

  this.JqueryAnimatePlugin = (function(superClass) {
    extend(JqueryAnimatePlugin, superClass);

    function JqueryAnimatePlugin() {
      this.doAnimation = bind(this.doAnimation, this);
      this.init = bind(this.init, this);
      return JqueryAnimatePlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryAnimatePlugin.config = {
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

    JqueryAnimatePlugin.prototype.init = function() {
      return this.on('before', this.doAnimation);
    };

    JqueryAnimatePlugin.prototype.doAnimation = function(event, currentSlide, direction, nextSlide) {
      var duration, inEffect, outEffect, selector;
      inEffect = this.config[direction].inEffect;
      outEffect = this.config[direction].outEffect;
      duration = this.config.duration;
      selector = this.config.selector;
      $(selector, currentSlide).animateCss(outEffect, duration);
      return $(selector, nextSlide).animateCss(outEffect, duration);
    };

    return JqueryAnimatePlugin;

  })(AbstractFormsliderPlugin);

  this.DramaticLoaderIplementation = (function(superClass) {
    extend(DramaticLoaderIplementation, superClass);

    function DramaticLoaderIplementation() {
      this.doAnimationOnNextSlide = bind(this.doAnimationOnNextSlide, this);
      this.finishAnimation = bind(this.finishAnimation, this);
      this.doAnimation = bind(this.doAnimation, this);
      return DramaticLoaderIplementation.__super__.constructor.apply(this, arguments);
    }

    DramaticLoaderIplementation.config = {
      duration: 2500,
      finishAnimationDuration: 2500,
      hideElementsOnHalf: '.hide-on-half',
      showElementsOnHalf: '.show-on-half',
      bounceOutOnHalf: '.bounce-out-on-half',
      bounceDownOnNext: '.bounce-down-on-enter'
    };

    DramaticLoaderIplementation.prototype.doAnimation = function() {
      var $elementsToBounceOut, $elementsToHide, $elementsToShow;
      this.plugin.on('leaving.next', this.doAnimationOnNextSlide);
      this.plugin.logger.debug("doAnimation(" + this.config.finishAnimationDuration + ")");
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

    DramaticLoaderIplementation.prototype.finishAnimation = function() {
      return setTimeout(this.stop, this.config.finishAnimationDuration);
    };

    DramaticLoaderIplementation.prototype.doAnimationOnNextSlide = function(event, current, direction, next) {
      var $elementsToBounceDown;
      $elementsToBounceDown = $(this.config.bounceDownOnNext, next);
      return $elementsToBounceDown.css({
        opacity: 0
      }).animateCss('bounceInDown', 600).animate({
        opacity: 1
      }, 600);
    };

    return DramaticLoaderIplementation;

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

  this.JqueryTrackingPlugin = (function(superClass) {
    extend(JqueryTrackingPlugin, superClass);

    function JqueryTrackingPlugin() {
      this.onTrack = bind(this.onTrack, this);
      this.init = bind(this.init, this);
      return JqueryTrackingPlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryTrackingPlugin.config = {
      initialize: true,
      eventCategory: 'formslider',
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

    JqueryTrackingPlugin.prototype.init = function() {
      if (this.config.initialize) {
        $.tracking(this.config);
      }
      this.on('track', this.onTrack);
      return this.on('form-submitted', function() {
        return $.tracking.conversion();
      });
    };

    JqueryTrackingPlugin.prototype.onTrack = function(event, source, value, category) {
      if (category == null) {
        category = null;
      }
      return $.tracking.event(category || this.config.eventCategory, source, value, '', '');
    };

    return JqueryTrackingPlugin;

  })(AbstractFormsliderPlugin);

  this.HistoryJsPlugin = (function(superClass) {
    extend(HistoryJsPlugin, superClass);

    function HistoryJsPlugin() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return HistoryJsPlugin.__super__.constructor.apply(this, arguments);
    }

    HistoryJsPlugin.config = {
      updateUrl: false,
      resetStatesOnLoad: true
    };

    HistoryJsPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return History.Adapter.bind(window, 'statechange', this.handleHistoryChange);
    };

    HistoryJsPlugin.prototype.onAfter = function() {
      return this.pushCurrentHistoryState();
    };

    HistoryJsPlugin.prototype.pushCurrentHistoryState = function() {
      var hash;
      hash = null;
      if (this.config.updateUrl) {
        hash = "?slide=" + (this.formslider.index());
      }
      this.logger.debug('pushCurrentHistoryState', "index:" + (this.formslider.index()));
      return History.pushState({
        index: this.formslider.index(),
        time: this.time
      }, null, hash);
    };

    HistoryJsPlugin.prototype.handleHistoryChange = function(event) {
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

    return HistoryJsPlugin;

  })(AbstractFormsliderPlugin);

  (function($) {
    return Raven.context(function() {
      $.debug(1);
      return window.formslider = $('.formslider-wrapper').formslider({
        version: 1,
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
            "class": 'AddSlideClassesPlugin'
          }, {
            "class": 'JqueryAnimatePlugin'
          }, {
            "class": 'JqueryValidatePlugin'
          }, {
            "class": 'ArrowNavigationPlugin'
          }, {
            "class": 'SlideVisibilityPlugin'
          }, {
            "class": 'AnswerClickPlugin'
          }, {
            "class": 'InputFocusPlugin'
          }, {
            "class": 'HistoryJsPlugin'
          }, {
            "class": 'NormalizeInputAttributesPlugin'
          }, {
            "class": 'FormSubmissionPlugin'
          }, {
            "class": 'InputSyncPlugin'
          }, {
            "class": 'NextOnKeyPlugin'
          }, {
            "class": 'TabIndexSetterPlugin'
          }, {
            "class": 'NextOnClickPlugin'
          }, {
            "class": 'LoadingStatePlugin',
            config: {
              selector: '.progressbar-wrapper, .formslider-wrapper'
            }
          }, {
            "class": 'ProgressBarPlugin'
          }, {
            "class": 'LoaderSlidePlugin',
            config: {
              loaderClass: 'DramaticLoaderIplementation',
              duration: 600
            }
          }, {
            "class": 'EqualHeightPlugin'
          }, {
            "class": 'ScrollUpPlugin',
            config: {
              scrollUpOffset: 40
            }
          }, {
            "class": 'LazyLoadPlugin'
          }, {
            "class": 'TrackSessionInformationPlugin'
          }, {
            "class": 'TrackUserInteractionPlugin'
          }, {
            "class": 'JqueryTrackingPlugin',
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
            "class": 'DirectionPolicyByRolePlugin',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXNsaWRlci5qcyIsInNvdXJjZXMiOlsiZm9ybXNsaWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7Ozs7OztFQUFNLElBQUMsQ0FBQTtJQUNMLGdCQUFDLENBQUEsTUFBRCxHQUNFO01BQUEsUUFBQSxFQUFnQixzQkFBaEI7TUFDQSxTQUFBLEVBQWdCLE9BRGhCO01BRUEsY0FBQSxFQUFnQixHQUZoQjtNQUdBLFlBQUEsRUFBZ0IsSUFIaEI7TUFJQSxNQUFBLEVBQWdCLElBSmhCO01BS0EsWUFBQSxFQUFnQixLQUxoQjtNQU1BLFVBQUEsRUFBZ0IsS0FOaEI7TUFPQSxTQUFBLEVBQWdCLEtBUGhCO01BUUEsUUFBQSxFQUFnQixLQVJoQjtNQVNBLGFBQUEsRUFBZ0IsS0FUaEI7OztJQVdXLDBCQUFDLFNBQUQsRUFBYSxPQUFiLEVBQXNCLFFBQXRCLEVBQWlDLE9BQWpDLEVBQTJDLE9BQTNDO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFBWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsVUFBRDs7Ozs7Ozs7OztNQUN0RCxJQUFDLENBQUEsTUFBRCxHQUFVLGNBQWMsQ0FBQyxNQUFmLENBQXNCLEVBQXRCLEVBQTBCLGdCQUFnQixDQUFDLE1BQTNDLEVBQW1ELElBQUMsQ0FBQSxNQUFwRDtNQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQTRCLElBQUMsQ0FBQTtNQUU3QixJQUFDLENBQUEsTUFBRCxHQUE0QixDQUFBLENBQUUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFWLEVBQW9CLElBQUMsQ0FBQSxTQUFyQjtNQUU1QixJQUFDLENBQUEsU0FB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QURUO2VBVEY7Y0FZQSxZQUFBLEVBQ0U7Z0JBQUEsT0FBQSxFQUFTLENBQUMsTUFBRCxDQUFUO2VBYkY7YUFISjtXQWhETztTQWJUO09BRGtCO0lBSFAsQ0FBZjtFQUZELENBQUQsQ0FBQSxDQTRGRSxNQTVGRjtBQTFxREEiLCJzb3VyY2VzQ29udGVudCI6WyIjIGNvZmZlZWxpbnQ6IGRpc2FibGU9bWF4X2xpbmVfbGVuZ3RoXG4jPSBpbmNsdWRlIC4uLy4uLy4uL2Rpc3Qvc2NyaXB0cy9qcXVlcnkuZm9ybXNsaWRlci9zcmMvY29mZmVlL2pxdWVyeS5mb3Jtc2xpZGVyLmNvZmZlZVxuXG4jPSBpbmNsdWRlIC4uLy4uLy4uL2Rpc3Qvc2NyaXB0cy9qcXVlcnkuYW5pbWF0ZS5jc3Mvc3JjL2pxdWVyeS5hbmltYXRlLmNzcy5jb2ZmZWVcbiM9IGluY2x1ZGUgLi4vLi4vLi4vZGlzdC9zY3JpcHRzL2Zvcm1zbGlkZXIuYW5pbWF0ZS5jc3Mvc3JjL2Zvcm1zbGlkZXIuYW5pbWF0ZS5jc3MuY29mZmVlXG4jPSBpbmNsdWRlIC4uLy4uLy4uL2Rpc3Qvc2NyaXB0cy9mb3Jtc2xpZGVyLmRyYW1hdGljLmxvYWRlci9zcmMvZm9ybXNsaWRlci5kcmFtYXRpYy5sb2FkZXIuY29mZmVlXG4jPSBpbmNsdWRlIC4uLy4uLy4uL2Rpc3Qvc2NyaXB0cy9qcXVlcnkudHJhY2tpbmcvc3JjL2pxdWVyeS50cmFja2luZy5jb2ZmZWVcbiM9IGluY2x1ZGUgLi4vLi4vLi4vZGlzdC9zY3JpcHRzL2Zvcm1zbGlkZXIuanF1ZXJ5LnRyYWNraW5nL3NyYy9mb3Jtc2xpZGVyLmpxdWVyeS50cmFja2luZy5jb2ZmZWVcbiM9IGluY2x1ZGUgLi4vLi4vLi4vZGlzdC9zY3JpcHRzL2Zvcm1zbGlkZXIuaGlzdG9yeS5qcy9zcmMvZm9ybXNsaWRlci5oaXN0b3J5LmpzLmNvZmZlZVxuXG4jIGNvZmZlZWxpbnQ6IGVuYWJsZT1tYXhfbGluZV9sZW5ndGhcblxuKCgkKSAtPlxuXG4gIFJhdmVuLmNvbnRleHQoIC0+XG4gICAgJC5kZWJ1ZygxKVxuXG4gICAgd2luZG93LmZvcm1zbGlkZXIgPSAkKCcuZm9ybXNsaWRlci13cmFwcGVyJykuZm9ybXNsaWRlcihcbiAgICAgIHZlcnNpb246IDFcblxuICAgICAgZHJpdmVyOlxuICAgICAgICBjbGFzczogICAgJ0RyaXZlckZsZXhzbGlkZXInXG4gICAgICAgIHNlbGVjdG9yOiAnLmZvcm1zbGlkZXIgPiAuc2xpZGUnXG4gICAgICAgIGFuaW1hdGlvblNwZWVkOiA2MDBcblxuICAgICAgcGx1Z2luc0dsb2JhbENvbmZpZzpcbiAgICAgICAgdHJhbnNpdGlvblNwZWVkOiA2MDBcbiAgICAgICAgYW5zd2Vyc1NlbGVjdG9yOiAnLmFuc3dlcnMnXG4gICAgICAgIGFuc3dlclNlbGVjdG9yOiAgJy5hbnN3ZXInXG4gICAgICAgIGFuc3dlclNlbGVjdGVkQ2xhc3M6ICdzZWxlY3RlZCdcblxuICAgICAgcGx1Z2luczogW1xuICAgICAgICAjIHsgY2xhc3M6ICdOZXh0U2xpZGVSZXNvbHZlclBsdWdpbicgfVxuICAgICAgICB7IGNsYXNzOiAnQWRkU2xpZGVDbGFzc2VzUGx1Z2luJyAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdKcXVlcnlBbmltYXRlUGx1Z2luJyAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0pxdWVyeVZhbGlkYXRlUGx1Z2luJyAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnQXJyb3dOYXZpZ2F0aW9uUGx1Z2luJyAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdTbGlkZVZpc2liaWxpdHlQbHVnaW4nICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0Fuc3dlckNsaWNrUGx1Z2luJyAgICAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnSW5wdXRGb2N1c1BsdWdpbicgICAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdIaXN0b3J5SnNQbHVnaW4nICAgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ05vcm1hbGl6ZUlucHV0QXR0cmlidXRlc1BsdWdpbicgfVxuICAgICAgICB7IGNsYXNzOiAnRm9ybVN1Ym1pc3Npb25QbHVnaW4nICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdJbnB1dFN5bmNQbHVnaW4nICAgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ05leHRPbktleVBsdWdpbicgICAgICAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnVGFiSW5kZXhTZXR0ZXJQbHVnaW4nICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdOZXh0T25DbGlja1BsdWdpbicgICAgICAgICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnTG9hZGluZ1N0YXRlUGx1Z2luJ1xuICAgICAgICAgIGNvbmZpZzpcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnLnByb2dyZXNzYmFyLXdyYXBwZXIsIC5mb3Jtc2xpZGVyLXdyYXBwZXInXG4gICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ1Byb2dyZXNzQmFyUGx1Z2luJyAgICAgICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ0xvYWRlclNsaWRlUGx1Z2luJ1xuICAgICAgICAgIGNvbmZpZzpcbiAgICAgICAgICAgIGxvYWRlckNsYXNzOiAnRHJhbWF0aWNMb2FkZXJJcGxlbWVudGF0aW9uJ1xuICAgICAgICAgICAgZHVyYXRpb246IDYwMFxuICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdFcXVhbEhlaWdodFBsdWdpbicgICAgICAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdTY3JvbGxVcFBsdWdpbidcbiAgICAgICAgICBjb25maWc6XG4gICAgICAgICAgICBzY3JvbGxVcE9mZnNldDogNDBcbiAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnTGF6eUxvYWRQbHVnaW4nICAgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ1RyYWNrU2Vzc2lvbkluZm9ybWF0aW9uUGx1Z2luJyB9XG4gICAgICAgIHsgY2xhc3M6ICdUcmFja1VzZXJJbnRlcmFjdGlvblBsdWdpbicgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdKcXVlcnlUcmFja2luZ1BsdWdpbidcbiAgICAgICAgICBjb25maWc6XG4gICAgICAgICAgICBpbml0aWFsaXplOiB0cnVlXG4gICAgICAgICAgICBjb29raWVQYXRoOiAnZm9ybXNsaWRlci5naXRodWIuaW8nXG4gICAgICAgICAgICBhZGFwdGVyOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzczogJ0pxdWVyeVRyYWNraW5nR0FuYWx5dGljc0FkYXB0ZXInXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdEaXJlY3Rpb25Qb2xpY3lCeVJvbGVQbHVnaW4nXG4gICAgICAgICAgY29uZmlnOlxuICAgICAgICAgICAgemlwY29kZTpcbiAgICAgICAgICAgICAgY29tbWluZ0Zyb206IFsncXVlc3Rpb24nXVxuICAgICAgICAgICAgICBnb2luZ1RvOiBbJ2xvYWRlcicsICdxdWVzdGlvbiddXG5cbiAgICAgICAgICAgIGxvYWRlcjpcbiAgICAgICAgICAgICAgY29tbWluZ0Zyb206IFsnemlwY29kZSddXG4gICAgICAgICAgICAgIGdvaW5nVG86IFsnY29udGFjdCddXG5cbiAgICAgICAgICAgIGNvbnRhY3Q6XG4gICAgICAgICAgICAgIGNvbW1pbmdGcm9tOiBbJ2xvYWRlciddXG4gICAgICAgICAgICAgIGdvaW5nVG86IFsnY29uZmlybWF0aW9uJ11cblxuICAgICAgICAgICAgY29uZmlybWF0aW9uOlxuICAgICAgICAgICAgICBnb2luZ1RvOiBbJ25vbmUnXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgKVxuXG5cbiAgKVxuXG5cbikoalF1ZXJ5KVxuIl19
