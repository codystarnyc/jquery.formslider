(function() {
  var EventManager, Logger,
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
      this.collectInputs = bind(this.collectInputs, this);
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
      loadHiddenFrameOnSuccess: 'url',
      strategy: {
        type: 'collect',
        endpoint: '#',
        method: 'POST'
      }
    };

    FormSubmissionPlugin.prototype.init = function() {
      var eventName, j, len, ref, results;
      ref = this.config.submitOnEvents;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        results.push(this.on(eventName, this.onSubmit));
      }
      return results;
    };

    FormSubmissionPlugin.prototype.onSubmit = function(event, currentSlide) {
      var $form;
      return this.isCanceled(event);
      switch (this.config.strategy.type) {
        case 'submit':
          $form = $(this.config.formSelector);
          return $form.submit();
        case 'ajaxSubmit':
          $form = $(this.config.formSelector);
          $form.ajaxSubmit(this.config.strategy);
          return $form.data('jqxhr').done(this.onDone).fail(this.onFail);
        case 'collect':
          return $.ajax({
            cache: false,
            url: this.config.strategy.endpoint,
            method: this.config.strategy.method,
            data: this.collectInputs()
          }).done(this.onDone).fail(this.onFail);
      }
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

    FormSubmissionPlugin.prototype.collectInputs = function() {
      var $input, $inputs, $other, $others, input, j, k, len, len1, other, result;
      result = {};
      $inputs = $('input', this.container);
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
      $others = $('select, textarea', this.container);
      for (k = 0, len1 = $others.length; k < len1; k++) {
        other = $others[k];
        $other = $(other);
        result[$other.attr('name')] = $other.val();
      }
      return result;
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
      selector: 'input:visible',
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
      selector: 'input:visible, a, select, textarea, button'
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
      return $(this.config.selector, slide).attr('tabindex', 0);
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
      this._addRoleClass(index, $slide);
      return this._addSlideIdClass($slide);
    };

    AddSlideClassesPlugin.prototype._addAnswerCountClasses = function(index, $slide) {
      var answerCount;
      answerCount = $(this.config.answerSelector, $slide).length;
      return $slide.addClass("answer-count-" + answerCount).data('answer-count', answerCount);
    };

    AddSlideClassesPlugin.prototype._addRoleClass = function(index, $slide) {
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
      updateHash: true
    };

    BrowserHistoryPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      this.dontUpdateHistoryNow = false;
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
        index: this.formslider.index()
      }, "index " + (this.formslider.index()), hash);
    };

    BrowserHistoryPlugin.prototype.handleHistoryChange = function(event) {
      var newIndex, ref;
      if (((ref = event.originalEvent) != null ? ref.state : void 0) == null) {
        return;
      }
      newIndex = event.originalEvent.state.index;
      this.logger.debug('handleHistoryChange', newIndex);
      this.dontUpdateHistoryNow = true;
      return this.formslider.goto(newIndex);
    };

    return BrowserHistoryPlugin;

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
      selector: 'input:visible',
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

  this.ProgressBarPlugin = (function(superClass) {
    extend(ProgressBarPlugin, superClass);

    function ProgressBarPlugin() {
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      this._setSteps = bind(this._setSteps, this);
      this._setPercentStepCallback = bind(this._setPercentStepCallback, this);
      this._setPercent = bind(this._setPercent, this);
      this.set = bind(this.set, this);
      this.shouldBeVisible = bind(this.shouldBeVisible, this);
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
      type: 'percent',
      initialProgress: '15',
      dontCountOnRoles: ['loader', 'contact', 'confirmation'],
      hideOnRoles: ['zipcode', 'loader', 'contact', 'confirmation']
    };

    ProgressBarPlugin.prototype.init = function() {
      this.on('after', this.doUpdate);
      this.visible = true;
      this.wrapper = $(this.config.selectorWrapper);
      this.progress = $(this.config.selectorText, this.wrapper);
      this.bar = $(this.config.selectorProgress, this.wrapper);
      this.type = this.config.type;
      this.bar.css('transition-duration', (this.config.animationSpeed / 1000) + 's');
      this.countMax = this.slidesThatCount();
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

    ProgressBarPlugin.prototype.shouldBeVisible = function(slide) {
      var ref;
      return !(ref = $(slide).data('role'), indexOf.call(this.config.hideOnRoles, ref) >= 0);
    };

    ProgressBarPlugin.prototype.set = function(indexFromZero) {
      var indexFromOne, percent;
      if (indexFromZero > this.countMax) {
        indexFromZero = this.countMax;
      }
      if (indexFromZero < 0) {
        indexFromZero = 0;
      }
      indexFromOne = indexFromZero + 1;
      percent = (indexFromOne / this.countMax) * 100;
      this.bar.css('width', percent + '%');
      if (this.config.type === 'steps') {
        this._setSteps(indexFromOne);
        this._setSteps(indexFromOne);
        return;
      }
      if ((this.config.initialProgress != null) && indexFromZero < 1) {
        percent = Math.max(this.config.initialProgress, percent);
      }
      return this._setPercent(percent);
    };

    ProgressBarPlugin.prototype._setPercent = function(percent) {
      var startFrom;
      startFrom = parseInt(this.progress.text()) || 13;
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

    ProgressBarPlugin.prototype._setPercentStepCallback = function(percent) {
      return this.progress.text(Math.ceil(percent) + '%');
    };

    ProgressBarPlugin.prototype._setSteps = function(indexFromOne) {
      return this.progress.text(indexFromOne + "/" + this.countMax);
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

  this.ConfirmationSlidePlugin = (function(superClass) {
    extend(ConfirmationSlidePlugin, superClass);

    function ConfirmationSlidePlugin() {
      this.onLeaving = bind(this.onLeaving, this);
      this.init = bind(this.init, this);
      return ConfirmationSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    ConfirmationSlidePlugin.prototype.init = function() {
      return this.on('leaving.confirmation', this.onLeaving);
    };

    ConfirmationSlidePlugin.prototype.onLeaving = function(event, current, direction, next) {
      return this.cancel(event);
    };

    return ConfirmationSlidePlugin;

  })(AbstractFormsliderPlugin);

  this.ContactSlidePlugin = (function(superClass) {
    extend(ContactSlidePlugin, superClass);

    function ContactSlidePlugin() {
      this.onLeaving = bind(this.onLeaving, this);
      this.init = bind(this.init, this);
      return ContactSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    ContactSlidePlugin.prototype.init = function() {
      return this.on('leaving.contact', this.onLeaving);
    };

    ContactSlidePlugin.prototype.onLeaving = function(event, current, direction, next) {
      if (direction === 'prev') {
        return this.cancel(event);
      }
    };

    return ContactSlidePlugin;

  })(AbstractFormsliderPlugin);

  this.LoaderSlidePlugin = (function(superClass) {
    extend(LoaderSlidePlugin, superClass);

    function LoaderSlidePlugin() {
      this.isLoading = bind(this.isLoading, this);
      this.onLeaving = bind(this.onLeaving, this);
      this.onLOaderStart = bind(this.onLOaderStart, this);
      this.init = bind(this.init, this);
      return LoaderSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    LoaderSlidePlugin.config = {
      loaderClass: 'SimpleLoaderImplementation',
      duration: 1000
    };

    LoaderSlidePlugin.prototype.init = function() {
      this.on('after.loader', this.onLOaderStart);
      return this.on('leaving.loader', this.onLeaving);
    };

    LoaderSlidePlugin.prototype.onLOaderStart = function(event, currentSlide, direction, nextSlide) {
      var LoaderClass;
      if (this.isLoading()) {
        return;
      }
      LoaderClass = window[this.config.loaderClass];
      this.loader = new LoaderClass(this, this.config, currentSlide);
      return this.loader.start();
    };

    LoaderSlidePlugin.prototype.onLeaving = function(event, current, direction, next) {
      if (direction === 'prev') {
        this.cancel(event);
      }
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
      duration: 200,
      tolerance: 80,
      scrollUpOffset: 30
    };

    ScrollUpPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      return this.window = $(window);
    };

    ScrollUpPlugin.prototype.onAfter = function(e, current, direction, prev) {
      var $element;
      $element = $(this.config.selector, current);
      if (this.isOnScreen($element)) {
        return;
      }
      return $("html, body").animate({
        scrollTop: Math.max(0, $element.offset().top - this.config.scrollUpOffset)
      }, this.config.duration);
    };

    ScrollUpPlugin.prototype.isOnScreen = function($element) {
      var bounds, viewport;
      viewport = {
        top: this.window.scrollTop(),
        left: this.window.scrollLeft()
      };
      viewport.right = viewport.left + this.window.width();
      viewport.bottom = viewport.top + this.window.height();
      bounds = $element.offset();
      bounds.right = bounds.left + $element.outerWidth();
      bounds.bottom = bounds.top + $element.outerHeight();
      return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top - this.config.tolerance || viewport.top > bounds.bottom - this.config.tolerance);
    };

    return ScrollUpPlugin;

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
      if (this.locking.locked) {
        return false;
      }
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
      this.lastDirection = direction;
      return true;
    };

    FormSlider.prototype.onAfter = function() {
      var eventData, ref, ref1;
      eventData = [this.lastNext, this.lastDirection, this.lastCurrent];
      (ref = this.events).trigger.apply(ref, ["after." + this.lastCurrentRole + "." + this.lastDirection].concat(slice.call(eventData)));
      if (!this.firstInteraction) {
        this.firstInteraction = true;
        (ref1 = this.events).trigger.apply(ref1, ['first-interaction'].concat(slice.call(eventData)));
      }
      return this.locking.unlock();
    };

    FormSlider.prototype.onReady = function() {
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
      return this.on('before.question', this.doAnimation);
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
      return this.finishAnimation();
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

  (function($) {
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
          "class": 'AnswerClickPlugin'
        }, {
          "class": 'InputFocusPlugin'
        }, {
          "class": 'BrowserHistoryPlugin'
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
            loaderClass: 'DramaticLoaderIplementation'
          }
        }, {
          "class": 'ContactSlidePlugin'
        }, {
          "class": 'ConfirmationSlidePlugin'
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
            adapter: [
              {
                "class": 'JqueryTrackingGTagmanagerAdapter'
              }
            ]
          }
        }
      ]
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXNsaWRlci5qcyIsInNvdXJjZXMiOlsiZm9ybXNsaWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7Ozs7OztFQUFNLElBQUMsQ0FBQTtJQUNMLGdCQUFDLENBQUEsTUFBRCxHQUNFO01BQUEsUUFBQSxFQUFnQixzQkFBaEI7TUFDQSxTQUFBLEVBQWdCLE9BRGhCO01BRUEsY0FBQSxFQUFnQixHQUZoQjtNQUdBLFlBQUEsRUFBZ0IsSUFIaEI7TUFJQSxNQUFBLEVBQWdCLElBSmhCO01BS0EsWUFBQSxFQUFnQixLQUxoQjtNQU1BLFVBQUEsRUFBZ0IsS0FOaEI7TUFPQSxTQUFBLEVBQWdCLEtBUGhCO01BUUEsUUFBQSxFQUFnQixLQVJoQjtNQVNBLGFBQUEsRUFBZ0IsS0FUaEI7OztJQVdXLDBCQUFDLFNBQUQsRUFBYSxPQUFiLEVBQXNCLFFBQXRCLEVBQWlDLE9BQWpDLEVBQTJDLE9BQTNDO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFBWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsVUFBRDs7Ozs7Ozs7OztNQUN0RCxJQUFDLENBQUEsTUFBRCxHQUFVLGNBQWMsQ0FBQyxNQUFmLENBQXNCLEVBQXRCLEVBQTBCLGdCQUFnQixDQUFDLE1BQTNDLEVBQW1ELElBQUMsQ0FBQSxNQUFwRDtNQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQTRCLElBQUMsQ0FBQTtNQUU3QixJQUFDLENBQUEsTUFBRCxHQUE0QixDQUFBLENBQUUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFWLEVBQW9CLElBQUMsQ0FBQSxTQUFyQjtNQUU1QixJQUFDLENBQUEsU0FB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QUNQO2dCQUNFLENBQUEsS0FBQSxDQUFBLEVBQU8sa0NBRFQ7ZUFETzthQURUO1dBSEo7U0FyQ087T0FiVDtLQURrQjtFQUpyQixDQUFELENBQUEsQ0FvRUUsTUFwRUY7QUE5eUNBIiwic291cmNlc0NvbnRlbnQiOlsiIyBjb2ZmZWVsaW50OiBkaXNhYmxlPW1heF9saW5lX2xlbmd0aFxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvanF1ZXJ5LmZvcm1zbGlkZXIvc3JjL2NvZmZlZS9qcXVlcnkuZm9ybXNsaWRlci5jb2ZmZWVcblxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvanF1ZXJ5LmFuaW1hdGUuY3NzL3NyYy9qcXVlcnkuYW5pbWF0ZS5jc3MuY29mZmVlXG4jPSBpbmNsdWRlIGRpc3Qvc2NyaXB0cy9mb3Jtc2xpZGVyLmFuaW1hdGUuY3NzL3NyYy9mb3Jtc2xpZGVyLmFuaW1hdGUuY3NzLmNvZmZlZVxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5kcmFtYXRpYy5sb2FkZXIvc3JjL2Zvcm1zbGlkZXIuZHJhbWF0aWMubG9hZGVyLmNvZmZlZVxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5qcXVlcnkudHJhY2tpbmcvc3JjL2Zvcm1zbGlkZXIuanF1ZXJ5LnRyYWNraW5nLmNvZmZlZVxuIyBjb2ZmZWVsaW50OiBlbmFibGU9bWF4X2xpbmVfbGVuZ3RoXG5cbigoJCkgLT5cblxuICAkLmRlYnVnKDEpXG5cbiAgd2luZG93LmZvcm1zbGlkZXIgPSAkKCcuZm9ybXNsaWRlci13cmFwcGVyJykuZm9ybXNsaWRlcihcbiAgICB2ZXJzaW9uOiAxXG5cbiAgICBkcml2ZXI6XG4gICAgICBjbGFzczogICAgJ0RyaXZlckZsZXhzbGlkZXInXG4gICAgICBzZWxlY3RvcjogJy5mb3Jtc2xpZGVyID4gLnNsaWRlJ1xuICAgICAgYW5pbWF0aW9uU3BlZWQ6IDYwMFxuXG4gICAgcGx1Z2luc0dsb2JhbENvbmZpZzpcbiAgICAgIHRyYW5zaXRpb25TcGVlZDogNjAwXG4gICAgICBhbnN3ZXJzU2VsZWN0b3I6ICcuYW5zd2VycydcbiAgICAgIGFuc3dlclNlbGVjdG9yOiAgJy5hbnN3ZXInXG4gICAgICBhbnN3ZXJTZWxlY3RlZENsYXNzOiAnc2VsZWN0ZWQnXG5cbiAgICBwbHVnaW5zOiBbXG4gICAgICAjIHsgY2xhc3M6ICdOZXh0U2xpZGVSZXNvbHZlclBsdWdpbicgfVxuICAgICAgeyBjbGFzczogJ0FkZFNsaWRlQ2xhc3Nlc1BsdWdpbicgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0pxdWVyeUFuaW1hdGVQbHVnaW4nICAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0pxdWVyeVZhbGlkYXRlUGx1Z2luJyAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0Fycm93TmF2aWdhdGlvblBsdWdpbicgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0Fuc3dlckNsaWNrUGx1Z2luJyAgICAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0lucHV0Rm9jdXNQbHVnaW4nICAgICAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0Jyb3dzZXJIaXN0b3J5UGx1Z2luJyAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ05vcm1hbGl6ZUlucHV0QXR0cmlidXRlc1BsdWdpbicgfVxuICAgICAgeyBjbGFzczogJ0Zvcm1TdWJtaXNzaW9uUGx1Z2luJyAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0lucHV0U3luY1BsdWdpbicgICAgICAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ05leHRPbktleVBsdWdpbicgICAgICAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ1RhYkluZGV4U2V0dGVyUGx1Z2luJyAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ05leHRPbkNsaWNrUGx1Z2luJyAgICAgICAgICAgICAgfVxuICAgICAge1xuICAgICAgICBjbGFzczogJ0xvYWRpbmdTdGF0ZVBsdWdpbidcbiAgICAgICAgY29uZmlnOlxuICAgICAgICAgIHNlbGVjdG9yOiAnLnByb2dyZXNzYmFyLXdyYXBwZXIsIC5mb3Jtc2xpZGVyLXdyYXBwZXInXG4gICAgICB9XG4gICAgICB7IGNsYXNzOiAnUHJvZ3Jlc3NCYXJQbHVnaW4nICAgICAgICAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgY2xhc3M6ICdMb2FkZXJTbGlkZVBsdWdpbidcbiAgICAgICAgY29uZmlnOlxuICAgICAgICAgIGxvYWRlckNsYXNzOiAnRHJhbWF0aWNMb2FkZXJJcGxlbWVudGF0aW9uJ1xuICAgICAgfVxuICAgICAgeyBjbGFzczogJ0NvbnRhY3RTbGlkZVBsdWdpbicgICAgICAgICAgICB9XG4gICAgICB7IGNsYXNzOiAnQ29uZmlybWF0aW9uU2xpZGVQbHVnaW4nICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdFcXVhbEhlaWdodFBsdWdpbicgICAgICAgICAgICAgfVxuICAgICAge1xuICAgICAgICBjbGFzczogJ1Njcm9sbFVwUGx1Z2luJ1xuICAgICAgICBjb25maWc6XG4gICAgICAgICAgc2Nyb2xsVXBPZmZzZXQ6IDQwXG4gICAgICB9XG4gICAgICB7IGNsYXNzOiAnTGF6eUxvYWRQbHVnaW4nICAgICAgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdUcmFja1Nlc3Npb25JbmZvcm1hdGlvblBsdWdpbicgfVxuICAgICAgeyBjbGFzczogJ1RyYWNrVXNlckludGVyYWN0aW9uUGx1Z2luJyAgICB9XG4gICAgICB7XG4gICAgICAgIGNsYXNzOiAnSnF1ZXJ5VHJhY2tpbmdQbHVnaW4nXG4gICAgICAgIGNvbmZpZzpcbiAgICAgICAgICBpbml0aWFsaXplOiB0cnVlXG4gICAgICAgICAgYWRhcHRlcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzczogJ0pxdWVyeVRyYWNraW5nR1RhZ21hbmFnZXJBZGFwdGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIClcblxuKShqUXVlcnkpXG4iXX0=
