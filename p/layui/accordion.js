var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}miscPolyfillsForIE();

/*
let accordion = new Collapse(element, { option: value}).init();

  Options - { option: defaultValue }
    accordion: false,
    initClass: 'collapse-init',
    activeClass: 'panel-active',
    heightClass: 'collapse-reading-height',

  Methods - accordion.method(panel)
    open(panel)
    close(panel)
    toggle(panel)
    openSinglePanel(panel) [AKA accordion mode]
    openAll()
    closeAll()

  Events - panel.addEventListener('event')
    openingPanel
    openedPanel
    closingPanel
    closedPanel
*/var

Collapse = function () {
  function Collapse(container) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, Collapse);
    var defaults = {
      accordion: false,
      initClass: 'collapse-init',
      activeClass: 'panel-active',
      heightClass: 'collapse-reading-height' };


    this.settings = Object.assign({}, defaults, options);

    this._container = container;
    this._panels = container.querySelectorAll("details");

    this.events = {
      openingPanel: new CustomEvent('openingPanel'),
      openedPanel: new CustomEvent('openedPanel'),
      closingPanel: new CustomEvent('closingPanel'),
      closedPanel: new CustomEvent('closedPanel') };

  }

  // Sets height of panel content
  _createClass(Collapse, [{ key: '_setPanelHeight', value: function _setPanelHeight(panel) {
      var contents = panel.querySelector("summary + *");

      contents.style.height = contents.scrollHeight + "px";
    }

    // Removes height of panel content
  }, { key: '_removePanelHeight', value: function _removePanelHeight(panel) {
      var contents = panel.querySelector("summary + *");

      contents.style.height = null;
    }

    //=== Open panel
  }, { key: 'open', value: function open(panel) {
      panel.dispatchEvent(this.events.openingPanel);

      panel.open = true;
    }

    // Add height and active class, this triggers opening animation
  }, { key: '_afterOpen', value: function _afterOpen(panel) {
      this._setPanelHeight(panel);
      panel.classList.add(this.settings.activeClass);
    }

    // Remove height on animation end since it's no longer needed
  }, { key: '_endOpen', value: function _endOpen(panel) {
      panel.dispatchEvent(this.events.openedPanel);

      this._removePanelHeight(panel);
    }

    //=== Close panel, not toggling the actual [open] attr!
  }, { key: 'close', value: function close(panel) {
      panel.dispatchEvent(this.events.closingPanel);
      this._afterClose(panel);
    }

    // Set height, wait a beat, then remove height to trigger closing animation
  }, { key: '_afterClose', value: function _afterClose(panel) {var _this = this;
      this._setPanelHeight(panel);

      setTimeout(function () {
        panel.classList.remove(_this.settings.activeClass);
        _this._removePanelHeight(panel);
      }, 100); //help, this is buggy and hacky
    }

    // Actually closes panel once animation finishes
  }, { key: '_endClose', value: function _endClose(panel) {
      panel.dispatchEvent(this.events.closedPanel);

      panel.open = false;
    }

    //=== Toggles panel... just in case anyone needs this
  }, { key: 'toggle', value: function toggle(panel) {
      panel.open ? this.close(panel) : this.open(panel);
    }

    //=== Accordion closes all panels except the current passed panel 
  }, { key: 'openSinglePanel', value: function openSinglePanel(panel) {var _this2 = this;
      this._panels.forEach(function (element) {
        if (panel == element && !panel.open) {
          _this2.open(element);
        } else {
          _this2.close(element);
        }
      });
    }

    //=== Opens all panels just because
  }, { key: 'openAll', value: function openAll() {var _this3 = this;
      this._panels.forEach(function (element) {
        _this3.open(element);
      });
    }

    //=== Closes all panels just in case
  }, { key: 'closeAll', value: function closeAll() {var _this4 = this;
      this._panels.forEach(function (element) {
        _this4.close(element);
      });
    }

    // Now put it all together
  }, { key: '_attachEvents', value: function _attachEvents() {var _this5 = this;
      this._panels.forEach(function (panel) {
        var toggler = panel.querySelector("summary");
        var contents = panel.querySelector("summary + *");

        // On panel open
        panel.addEventListener("toggle", function (e) {
          var isReadingHeight = panel.classList.contains(_this5.settings.heightClass);

          if (panel.open && !isReadingHeight) {
            _this5._afterOpen(panel);
          }
        });

        toggler.addEventListener("click", function (e) {
          // If accordion, stop default toggle behavior
          if (_this5.settings.accordion) {
            _this5.openSinglePanel(panel);
            e.preventDefault();
          }

          // On attempting close, stop default close behavior to substitute our own
          else if (panel.open) {
              _this5.close(panel);
              e.preventDefault();
            }

          // On open, proceed as normal (see toggle listener above)
        });

        /*
              transitionend fires once for each animated property, 
              but we want it to fire once for each click. 
              So let's make sure to watch only a single property
              Note this makes complex animations with multiple transition-durations impossible
              Sorry
            */
        var propToWatch = '';

        // On panel finishing open/close animation
        contents.addEventListener("transitionend", function (e) {
          // Ignore transitions from child elements
          if (e.target !== contents) {
            return;
          }

          // Set property to watch on first fire
          if (!propToWatch) propToWatch = e.propertyName;

          // If watched property matches currently animating property
          if (e.propertyName == propToWatch) {
            var wasOpened = panel.classList.contains(_this5.settings.activeClass);
            wasOpened ? _this5._endOpen(panel) : _this5._endClose(panel);
          }
        });
      });
    } }, { key: 'init', value: function init()

    {
      // Attach functionality
      this._attachEvents();

      // If accordion, open the first panel
      if (this.settings.accordion) {
        this.openSinglePanel(this._panels[0]);
      }

      // For styling purposes
      this._container.classList.add(this.settings.initClass);

      return this;
    } }]);return Collapse;}();


// hoisthoistupwego I'm stuck on a machine with IE11
function miscPolyfillsForIE() {
  // NodeList.forEach() polyfill
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Browser_Compatibility
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // Object.assign() polyfill 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  "function" != typeof Object.assign && Object.defineProperty(Object, "assign", { value: function value(e, t) {"use strict";if (null == e) throw new TypeError("Cannot convert undefined or null to object");for (var n = Object(e), r = 1; r < arguments.length; r++) {var o = arguments[r];if (null != o) for (var c in o) {Object.prototype.hasOwnProperty.call(o, c) && (n[c] = o[c]);}}return n;}, writable: !0, configurable: !0 });

  // CustomEvent polyfill
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
  !function () {if ("function" == typeof window.CustomEvent) return !1;function t(t, e) {e = e || { bubbles: !1, cancelable: !1, detail: void 0 };var n = document.createEvent("CustomEvent");return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n;}t.prototype = window.Event.prototype, window.CustomEvent = t;}();
}