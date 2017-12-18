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
      this.logger = new Logger("jquery.formslider::" + this.constructor.name);
      this.init();
    }

    AbstractFormsliderPlugin.prototype.init = function() {
      return null;
    };

    AbstractFormsliderPlugin.prototype.on = function(eventName, callback) {
      return this.formslider.events.on(eventName + "." + this.constructor.name, callback);
    };

    AbstractFormsliderPlugin.prototype.off = function(eventName) {
      return this.formslider.events.off(eventName + "." + this.constructor.name);
    };

    AbstractFormsliderPlugin.prototype.cancel = function(event) {
      return this.formslider.events.cancel(event);
    };

    AbstractFormsliderPlugin.prototype.isCanceled = function(event) {
      return this.formslider.events.isCanceled(event);
    };

    AbstractFormsliderPlugin.prototype.trigger = function() {
      var ref;
      return (ref = this.formslider.events).trigger.apply(ref, arguments);
    };

    AbstractFormsliderPlugin.prototype.track = function(source, value, category) {
      if (category == null) {
        category = null;
      }
      return this.formslider.events.trigger('track', source, value, category);
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
      var eventName, i, len, ref, results;
      ref = this.config.submitOnEvents;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        eventName = ref[i];
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
      var $input, $inputs, $other, $others, i, input, j, len, len1, other, result;
      result = {};
      $inputs = $('input', this.container);
      for (i = 0, len = $inputs.length; i < len; i++) {
        input = $inputs[i];
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
      for (j = 0, len1 = $others.length; j < len1; j++) {
        other = $others[j];
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
      waitBeforeFocus: 200
    };

    InputFocusPlugin.prototype.init = function() {
      return this.on('after', this.onAfter);
    };

    InputFocusPlugin.prototype.onAfter = function(e, currentSlide, direction, prevSlide) {
      var $input;
      $input = $(this.config.selector, currentSlide);
      if (!$input.length) {
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
      var eventName, i, len, ref;
      ref = this.config.validateOnEvents;
      for (i = 0, len = ref.length; i < len; i++) {
        eventName = ref[i];
        this.on(eventName, this.onValidate);
      }
      this.prepareInputs();
      return this.trigger("validation.prepared");
    };

    JqueryValidatePlugin.prototype.onValidate = function(event, currentSlide, direction, nextSlide) {
      var $inputs, currentRole, error;
      $inputs = $(this.config.selector, currentSlide);
      if (!$inputs.length) {
        return;
      }
      currentRole = $(currentSlide).data('role');
      try {
        if ($inputs.valid()) {
          return this.trigger("validation.valid." + currentRole, currentSlide);
        } else {
          $inputs.filter('.error').first().focus();
          this.trigger("validation.invalid." + currentRole, currentSlide);
          return this.cancel(event);
        }
      } catch (error1) {
        error = error1;
        this.trigger("validation.error." + currentRole, currentSlide);
        return this.logger.debug('validation error', error);
      }
    };

    JqueryValidatePlugin.prototype.prepareInputs = function() {
      return $(this.config.selector, this.container).each((function(_this) {
        return function(index, input) {
          var $input, attribute, i, len, ref;
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
          for (i = 0, len = ref.length; i < len; i++) {
            attribute = ref[i];
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
        var $input, attribute, i, len, ref, results;
        $input = $(input);
        if ($input.attr('required')) {
          $input.data('required', 'required');
          $input.data('aria-required', 'true');
        }
        ref = ['inputmode', 'autocompletetype'];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          attribute = ref[i];
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
      this.onBefore = bind(this.onBefore, this);
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
      this.on('before', this.onBefore);
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
      var i, len, ref, role, substract;
      substract = 0;
      ref = this.config.dontCountOnRoles;
      for (i = 0, len = ref.length; i < len; i++) {
        role = ref[i];
        substract = substract + this.slideByRole(role).length;
      }
      return this.slides.length - substract;
    };

    ProgressBarPlugin.prototype.onBefore = function(e, current, direction, next) {
      var index;
      index = this.formslider.index() + 1;
      if (direction === 'prev') {
        index = this.formslider.index() - 1;
      }
      if (!this.shouldBeVisible(next)) {
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
      this.onBefore = bind(this.onBefore, this);
      this.init = bind(this.init, this);
      return LoaderSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    LoaderSlidePlugin.config = {
      loaderClass: 'SimpleLoaderImplementation',
      duration: 1000
    };

    LoaderSlidePlugin.prototype.init = function() {
      this.on('before.loader', this.onBefore);
      return this.on('leaving.loader', this.onLeaving);
    };

    LoaderSlidePlugin.prototype.onBefore = function(event, currentSlide, direction, nextSlide) {
      var LoaderClass;
      if (this.isLoading()) {
        return;
      }
      LoaderClass = window[this.config.loaderClass];
      this.loader = new LoaderClass(this, this.config, nextSlide);
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
      this.onResize = bind(this.onResize, this);
      this.onAfter = bind(this.onAfter, this);
      this.onReady = bind(this.onReady, this);
      this.init = bind(this.init, this);
      return EqualHeightPlugin.__super__.constructor.apply(this, arguments);
    }

    EqualHeightPlugin.config = {
      selector: '.answer .text'
    };

    EqualHeightPlugin.prototype.init = function() {
      this.doEqualize(this.slideByIndex(0));
      this.on('ready', this.onReady);
      this.on('after', this.onAfter);
      return this.on('resize', this.onResize);
    };

    EqualHeightPlugin.prototype.onReady = function() {
      this.doEqualize(this.slideByIndex(0));
      return this.doEqualize(this.slideByIndex(1));
    };

    EqualHeightPlugin.prototype.onAfter = function() {
      var currentIndex;
      currentIndex = this.formslider.index();
      return this.doEqualize(this.slideByIndex(currentIndex + 1));
    };

    EqualHeightPlugin.prototype.onResize = function() {
      var currentIndex;
      currentIndex = this.formslider.index();
      this.doEqualize(this.slideByIndex(currentIndex));
      return this.doEqualize(this.slideByIndex(currentIndex + 1));
    };

    EqualHeightPlugin.prototype.doEqualize = function(slide) {
      var $element, $elements, element, i, len, maxHeight;
      $elements = $(this.config.selector, slide);
      if (!$elements.length) {
        return;
      }
      maxHeight = 0;
      for (i = 0, len = $elements.length; i < len; i++) {
        element = $elements[i];
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
      tolerance: 80
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
        scrollTop: Math.max(0, $element.offset().top - this.config.tolerance)
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
      var data, error, event, i, len, listener, name, ref, tags;
      data = slice.call(arguments);
      name = data.shift();
      this.logger.info("triggerEvent(" + name + ")");
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
      for (i = 0, len = ref.length; i < len; i++) {
        listener = ref[i];
        if (listener.tags && !this.allTagsInArray(listener.tags, tags)) {
          continue;
        }
        try {
          listener.callback.apply(listener, [event].concat(slice.call(data)));
        } catch (error1) {
          error = error1;
          this.logger.error("triggerEvent(" + name + ")", error, data);
          event.canceled = true;
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
      var i, len, tag;
      for (i = 0, len = tags.length; i < len; i++) {
        tag = tags[i];
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

  this.Locking = (function() {
    function Locking(logger, initial) {
      this.logger = logger;
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
      var i, len, plugin, results;
      results = [];
      for (i = 0, len = plugins.length; i < len; i++) {
        plugin = plugins[i];
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
      this.locking = new Locking(this.logger, true);
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
      current = this.driver.get(currentIndex);
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
      this.init = bind(this.init, this);
      return JqueryAnimatePlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryAnimatePlugin.config = {
      duration: 1000,
      selector: '.answer',
      next: {
        inEffect: 'swingReverse',
        outEffect: 'swingReverse'
      },
      prev: {
        inEffect: 'swing',
        outEffect: 'swing'
      },
      actions: {
        before: function(plugin, current, direction, next) {
          var duration, inEffect, outEffect, selector;
          inEffect = plugin.config[direction].inEffect;
          outEffect = plugin.config[direction].outEffect;
          duration = plugin.config.duration;
          selector = plugin.config.selector;
          if ($(current).data('role') === 'question') {
            $(selector, current).animateCss(outEffect, duration);
          }
          if ($(next).data('role') === 'question') {
            return $(selector, next).animateCss(inEffect, duration);
          }
        }
      }
    };

    JqueryAnimatePlugin.prototype.init = function() {
      var callback, eventName, ref, results;
      ref = this.config.actions;
      results = [];
      for (eventName in ref) {
        callback = ref[eventName];
        results.push(this.on(eventName, (function(_this) {
          return function(event, current, direction, next) {
            return callback(_this, current, direction, next);
          };
        })(this)));
      }
      return results;
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
          "class": 'ScrollUpPlugin'
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXNsaWRlci5qcyIsInNvdXJjZXMiOlsiZm9ybXNsaWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7Ozs7OztFQUFNLElBQUMsQ0FBQTtJQUNMLGdCQUFDLENBQUEsTUFBRCxHQUNFO01BQUEsUUFBQSxFQUFnQixzQkFBaEI7TUFDQSxTQUFBLEVBQWdCLE9BRGhCO01BRUEsY0FBQSxFQUFnQixHQUZoQjtNQUdBLFlBQUEsRUFBZ0IsSUFIaEI7TUFJQSxNQUFBLEVBQWdCLElBSmhCO01BS0EsWUFBQSxFQUFnQixLQUxoQjtNQU1BLFVBQUEsRUFBZ0IsS0FOaEI7TUFPQSxTQUFBLEVBQWdCLEtBUGhCO01BUUEsUUFBQSxFQUFnQixLQVJoQjtNQVNBLGFBQUEsRUFBZ0IsS0FUaEI7OztJQVdXLDBCQUFDLFNBQUQsRUFBYSxPQUFiLEVBQXNCLFFBQXRCLEVBQWlDLE9BQWpDLEVBQTJDLE9BQTNDO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFBWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsVUFBRDs7Ozs7Ozs7OztNQUN0RCxJQUFDLENBQUEsTUFBRCxHQUFVLGNBQWMsQ0FBQyxNQUFmLENBQXNCLEVBQXRCLEVBQTBCLGdCQUFnQixDQUFDLE1BQTNDLEVBQW1ELElBQUMsQ0FBQSxNQUFwRDtNQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQTRCLElBQUMsQ0FBQTtNQUU3QixJQUFDLENBQUEsTUFBRCxHQUE0QixDQUFBLENBQUUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFWLEVBQW9CLElBQUMsQ0FBQSxTQUFyQjtNQUU1QixJQUFDLENBQUEsU0FB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QUEsS0FBQSxDQUFBLEVBQU8sb0JBRFQ7VUFFRSxNQUFBLEVBQ0U7WUFBQSxRQUFBLEVBQVUsMkNBQVY7V0FISjtTQWZPLEVBb0JQO1VBQUUsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBVDtTQXBCTyxFQXFCUDtVQUNFLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBRFQ7VUFFRSxNQUFBLEVBQ0U7WUFBQSxXQUFBLEVBQWEsNkJBQWI7V0FISjtTQXJCTyxFQTBCUDtVQUFFLENBQUEsS0FBQSxDQUFBLEVBQU8sb0JBQVQ7U0ExQk8sRUEyQlA7VUFBRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHlCQUFUO1NBM0JPLEVBNEJQO1VBQUUsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBVDtTQTVCTyxFQTZCUDtVQUFFLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVQ7U0E3Qk8sRUE4QlA7VUFBRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdCQUFUO1NBOUJPLEVBK0JQO1VBQUUsQ0FBQSxLQUFBLENBQUEsRUFBTywrQkFBVDtTQS9CTyxFQWdDUDtVQUFFLENBQUEsS0FBQSxDQUFBLEVBQU8sNEJBQVQ7U0FoQ08sRUFpQ1A7VUFDRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNCQURUO1VBRUUsTUFBQSxFQUNFO1lBQUEsVUFBQSxFQUFZLElBQVo7WUFDQSxPQUFBLEVBQVM7Y0FDUDtnQkFDRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGtDQURUO2VBRE87YUFEVDtXQUhKO1NBakNPO09BYlQ7S0FEa0I7RUFKckIsQ0FBRCxDQUFBLENBZ0VFLE1BaEVGO0FBbnpDQSIsInNvdXJjZXNDb250ZW50IjpbIiMgY29mZmVlbGludDogZGlzYWJsZT1tYXhfbGluZV9sZW5ndGhcbiM9IGluY2x1ZGUgZGlzdC9zY3JpcHRzL2pxdWVyeS5mb3Jtc2xpZGVyL3NyYy9jb2ZmZWUvanF1ZXJ5LmZvcm1zbGlkZXIuY29mZmVlXG5cbiM9IGluY2x1ZGUgZGlzdC9zY3JpcHRzL2pxdWVyeS5hbmltYXRlLmNzcy9zcmMvanF1ZXJ5LmFuaW1hdGUuY3NzLmNvZmZlZVxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5hbmltYXRlLmNzcy9zcmMvZm9ybXNsaWRlci5hbmltYXRlLmNzcy5jb2ZmZWVcbiM9IGluY2x1ZGUgZGlzdC9zY3JpcHRzL2Zvcm1zbGlkZXIuZHJhbWF0aWMubG9hZGVyL3NyYy9mb3Jtc2xpZGVyLmRyYW1hdGljLmxvYWRlci5jb2ZmZWVcbiM9IGluY2x1ZGUgZGlzdC9zY3JpcHRzL2Zvcm1zbGlkZXIuanF1ZXJ5LnRyYWNraW5nL3NyYy9mb3Jtc2xpZGVyLmpxdWVyeS50cmFja2luZy5jb2ZmZWVcbiMgY29mZmVlbGludDogZW5hYmxlPW1heF9saW5lX2xlbmd0aFxuXG4oKCQpIC0+XG5cbiAgJC5kZWJ1ZygxKVxuXG4gIHdpbmRvdy5mb3Jtc2xpZGVyID0gJCgnLmZvcm1zbGlkZXItd3JhcHBlcicpLmZvcm1zbGlkZXIoXG4gICAgdmVyc2lvbjogMVxuXG4gICAgZHJpdmVyOlxuICAgICAgY2xhc3M6ICAgICdEcml2ZXJGbGV4c2xpZGVyJ1xuICAgICAgc2VsZWN0b3I6ICcuZm9ybXNsaWRlciA+IC5zbGlkZSdcbiAgICAgIGFuaW1hdGlvblNwZWVkOiA2MDBcblxuICAgIHBsdWdpbnNHbG9iYWxDb25maWc6XG4gICAgICB0cmFuc2l0aW9uU3BlZWQ6IDYwMFxuICAgICAgYW5zd2Vyc1NlbGVjdG9yOiAnLmFuc3dlcnMnXG4gICAgICBhbnN3ZXJTZWxlY3RvcjogICcuYW5zd2VyJ1xuICAgICAgYW5zd2VyU2VsZWN0ZWRDbGFzczogJ3NlbGVjdGVkJ1xuXG4gICAgcGx1Z2luczogW1xuICAgICAgIyB7IGNsYXNzOiAnTmV4dFNsaWRlUmVzb2x2ZXJQbHVnaW4nIH1cbiAgICAgIHsgY2xhc3M6ICdBZGRTbGlkZUNsYXNzZXNQbHVnaW4nICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdKcXVlcnlBbmltYXRlUGx1Z2luJyAgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdKcXVlcnlWYWxpZGF0ZVBsdWdpbicgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdBcnJvd05hdmlnYXRpb25QbHVnaW4nICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdBbnN3ZXJDbGlja1BsdWdpbicgICAgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdJbnB1dEZvY3VzUGx1Z2luJyAgICAgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdCcm93c2VySGlzdG9yeVBsdWdpbicgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdOb3JtYWxpemVJbnB1dEF0dHJpYnV0ZXNQbHVnaW4nIH1cbiAgICAgIHsgY2xhc3M6ICdGb3JtU3VibWlzc2lvblBsdWdpbicgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdJbnB1dFN5bmNQbHVnaW4nICAgICAgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdOZXh0T25LZXlQbHVnaW4nICAgICAgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdUYWJJbmRleFNldHRlclBsdWdpbicgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdOZXh0T25DbGlja1BsdWdpbicgICAgICAgICAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgY2xhc3M6ICdMb2FkaW5nU3RhdGVQbHVnaW4nXG4gICAgICAgIGNvbmZpZzpcbiAgICAgICAgICBzZWxlY3RvcjogJy5wcm9ncmVzc2Jhci13cmFwcGVyLCAuZm9ybXNsaWRlci13cmFwcGVyJ1xuICAgICAgfVxuICAgICAgeyBjbGFzczogJ1Byb2dyZXNzQmFyUGx1Z2luJyAgICAgICAgICAgICB9XG4gICAgICB7XG4gICAgICAgIGNsYXNzOiAnTG9hZGVyU2xpZGVQbHVnaW4nXG4gICAgICAgIGNvbmZpZzpcbiAgICAgICAgICBsb2FkZXJDbGFzczogJ0RyYW1hdGljTG9hZGVySXBsZW1lbnRhdGlvbidcbiAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdDb250YWN0U2xpZGVQbHVnaW4nICAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0NvbmZpcm1hdGlvblNsaWRlUGx1Z2luJyAgICAgICB9XG4gICAgICB7IGNsYXNzOiAnRXF1YWxIZWlnaHRQbHVnaW4nICAgICAgICAgICAgIH1cbiAgICAgIHsgY2xhc3M6ICdTY3JvbGxVcFBsdWdpbicgICAgICAgICAgICAgICAgfVxuICAgICAgeyBjbGFzczogJ0xhenlMb2FkUGx1Z2luJyAgICAgICAgICAgICAgICB9XG4gICAgICB7IGNsYXNzOiAnVHJhY2tTZXNzaW9uSW5mb3JtYXRpb25QbHVnaW4nIH1cbiAgICAgIHsgY2xhc3M6ICdUcmFja1VzZXJJbnRlcmFjdGlvblBsdWdpbicgICAgfVxuICAgICAge1xuICAgICAgICBjbGFzczogJ0pxdWVyeVRyYWNraW5nUGx1Z2luJ1xuICAgICAgICBjb25maWc6XG4gICAgICAgICAgaW5pdGlhbGl6ZTogdHJ1ZVxuICAgICAgICAgIGFkYXB0ZXI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3M6ICdKcXVlcnlUcmFja2luZ0dUYWdtYW5hZ2VyQWRhcHRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICApXG5cbikoalF1ZXJ5KVxuIl19
