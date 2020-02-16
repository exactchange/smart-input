"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _constants = require("./constants");

var _profiles = require("./profiles");

require("./themes.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Profiles = {
  Customer: _profiles.CustomerProfile,
  Engagement: _profiles.EngagementProfile,
  Replay: _profiles.ReplayProfile,
  Standard: _profiles.StandardProfile,
  undefined: _profiles.StandardProfile
};

var SmartInput =
/*#__PURE__*/
function (_Component) {
  _inherits(SmartInput, _Component);

  function SmartInput(props) {
    var _this;

    _classCallCheck(this, SmartInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SmartInput).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "hasLabel", function (theme) {
      return theme === 'Material';
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function (event) {
      return setTimeout(function () {
        return _this.setState({
          isFocused: false
        });
      }, 100);
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function (event) {
      var nativeEvent = event.nativeEvent,
          value = event.target.value;
      var data = _this.props.data;
      var buffer = "".concat((_this.state.buffer + nativeEvent.data).replace(/null/gi, '')).concat(value.length < 1 ? _constants.CLEAR_SEPARATOR : '');
      var didErase = value.length < _this.state.value.length;
      var suggestions = (data || []).map(function (s) {
        var compare = value.toLowerCase();
        var suggestion = s.toLowerCase();
        return compare[0] === suggestion[0] && suggestion.match(compare);
      }).filter(Boolean);

      _this.setState({
        backspaces: _this.state.backspaces + (didErase ? 1 : 0),
        buffer: buffer,
        isFocused: suggestions.length || value.length,
        isTyping: true,
        suggestionIndex: 0,
        suggestions: suggestions.map(function (m) {
          return m && m.input;
        }).filter(Boolean) || [],
        value: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onClick", function (event) {
      var innerText = event.target.innerText;
      var value = innerText;

      _this.setState({
        value: value
      });

      requestAnimationFrame(function () {
        return _this.refs.input.focus();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function (event) {
      return _this.setState({
        isFocused: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDown", function (event) {
      var keyCode = event.nativeEvent.keyCode;
      var _this$state = _this.state,
          keystrokes = _this$state.keystrokes,
          suggestionIndex = _this$state.suggestionIndex;
      var keyDownCount = keystrokes + 1;

      switch (keyCode) {
        case 13:
          _this.onClick({
            target: {
              innerText: _this.state.suggestions[suggestionIndex] || _this.state.value
            }
          });

          _this.onBlur();

          break;

        case 38:
          suggestionIndex = Math.max(0, suggestionIndex - 1);
          break;

        case 40:
          suggestionIndex = Math.min(_this.state.suggestions.length - 1, suggestionIndex + 1);
          break;

        default:
          break;
      }

      _this.setState({
        keystrokes: keyDownCount,
        suggestionIndex: suggestionIndex
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOut", function (event) {
      return _this.setState({
        suggestionIndex: 0
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOver", function (suggestionIndex) {
      return function (event) {
        return _this.setState({
          suggestionIndex: suggestionIndex
        });
      };
    });

    var autoCompleteHeight = props.autoCompleteHeight,
        _data = props.data,
        debug = props.debug,
        disableCache = props.disableCache,
        keywords = props.keywords,
        multiline = props.multiline,
        profile = props.profile,
        reportPath = props.reportPath,
        _theme = props.theme;

    var _suggestions = _data || [];

    _this.delegate = new Profiles[profile]();
    _this.state = _this.delegate.getInitialState.call(_assertThisInitialized(_this), {
      autoCompleteHeight: autoCompleteHeight || '100px',
      isFocused: false,
      keywords: keywords || [],
      multiline: !!multiline,
      reportPath: reportPath,
      suggestions: _suggestions.map(function (s) {
        return s.toLowerCase();
      }),
      suggestionIndex: 0,
      theme: _theme
    });
    _this.state.debug = debug === 'true' || debug === true;
    _this.state.disableCache = disableCache === 'true' || disableCache === true;
    return _this;
  }

  _createClass(SmartInput, [{
    key: "render",
    value: function render() {
      var hasLabel = this.hasLabel,
          onBlur = this.onBlur,
          onChange = this.onChange,
          onClick = this.onClick,
          onFocus = this.onFocus,
          onKeyDown = this.onKeyDown,
          onMouseOut = this.onMouseOut,
          onMouseOver = this.onMouseOver,
          _this$props = this.props,
          className = _this$props.className,
          id = _this$props.id,
          placeholder = _this$props.placeholder,
          _this$state2 = this.state,
          autoCompleteHeight = _this$state2.autoCompleteHeight,
          isFocused = _this$state2.isFocused,
          multiline = _this$state2.multiline,
          suggestionIndex = _this$state2.suggestionIndex,
          suggestions = _this$state2.suggestions,
          theme = _this$state2.theme,
          value = _this$state2.value;
      var themeName = "theme-".concat(theme).concat(className ? ' ' + className : '').concat(isFocused ? ' focus' : '');
      var ulStyle = {
        height: autoCompleteHeight,
        marginTop: autoCompleteHeight
      };
      return _react.default.createElement("div", {
        className: "SmartInputContainer"
      }, multiline ? _react.default.createElement("textarea", {
        className: "SmartInput ".concat(themeName),
        id: id,
        onBlur: onBlur,
        onChange: onChange,
        onFocus: onFocus,
        onKeyDown: onKeyDown,
        placeholder: placeholder,
        ref: "input",
        value: value
      }) : _react.default.createElement("input", {
        autoComplete: "new-password",
        className: "SmartInput ".concat(themeName),
        id: id,
        onBlur: onBlur,
        onChange: onChange,
        onFocus: onFocus,
        onKeyDown: onKeyDown,
        placeholder: placeholder,
        ref: "input",
        type: "text",
        value: value
      }), !multiline && suggestions.length > 0 && _react.default.createElement("ul", {
        style: ulStyle
      }, suggestions.map(function (s, i) {
        return s && _react.default.createElement("li", {
          key: i,
          onClick: onClick,
          className: suggestionIndex === i ? ' hover' : '',
          onMouseOut: onMouseOut,
          onMouseOver: onMouseOver(i)
        }, s);
      })), placeholder && hasLabel(theme) && _react.default.createElement("label", {
        htmlFor: id
      }, placeholder));
    }
  }]);

  return SmartInput;
}(_react.Component);

var _default = SmartInput;
exports.default = _default;
