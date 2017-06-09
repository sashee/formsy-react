'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = global.React || require('react');
var PropTypes = require('prop-types');
var utils = require('./utils.js');

var convertValidationsToObject = function convertValidationsToObject(validations) {
  if (typeof validations === 'string') {

    return validations.split(/\,(?![^{\[]*[}\]])/g).reduce(function (validations, validation) {
      var args = validation.split(':');
      var validateMethod = args.shift();

      args = args.map(function (arg) {
        try {
          return JSON.parse(arg);
        } catch (e) {
          return arg; // It is a string if it can not parse it
        }
      });

      if (args.length > 1) {
        throw new Error('Formsy does not support multiple args on string validations. Use object format of validations instead.');
      }

      validations[validateMethod] = args.length ? args[0] : true;
      return validations;
    }, {});
  }

  return validations || {};
};

exports.default = function (Component) {
  var _class, _temp2;

  return _temp2 = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        _value: _this.props.value,
        _isRequired: false,
        _isValid: true,
        _isPristine: true,
        _pristineValue: _this.props.value,
        _validationError: [],
        _externalError: null,
        _formSubmitted: false
      }, _this.setValidations = function (validations, required) {
        // Add validations to the store itself as the props object can not be modified
        _this._validations = convertValidationsToObject(validations) || {};
        _this._requiredValidations = required === true ? { isDefaultRequiredValue: true } : convertValidationsToObject(required);
      }, _this.setValue = function (value) {
        _this.setState({
          _value: value,
          _isPristine: false
        }, function () {
          _this.context.formsy.validate(_this);
          //this.props._validate(this);
        });
      }, _this.resetValue = function () {
        _this.setState({
          _value: _this.state._pristineValue,
          _isPristine: true
        }, function () {
          _this.context.formsy.validate(_this);
          //this.props._validate(this);
        });
      }, _this.getValue = function () {
        return _this.state._value;
      }, _this.hasValue = function () {
        return _this.state._value !== '';
      }, _this.getErrorMessage = function () {
        var messages = _this.getErrorMessages();
        return messages.length ? messages[0] : null;
      }, _this.getErrorMessages = function () {
        return !_this.isValid() || _this.showRequired() ? _this.state._externalError || _this.state._validationError || [] : [];
      }, _this.isFormDisabled = function () {
        return _this.context.formsy.isFormDisabled();
        //return this.props._isFormDisabled();
      }, _this.isValid = function () {
        return _this.state._isValid;
      }, _this.isPristine = function () {
        return _this.state._isPristine;
      }, _this.isFormSubmitted = function () {
        return _this.state._formSubmitted;
      }, _this.isRequired = function () {
        return !!_this.props.required;
      }, _this.showRequired = function () {
        return _this.state._isRequired;
      }, _this.showError = function () {
        return !_this.showRequired() && !_this.isValid();
      }, _this.isValidValue = function (value) {
        return _this.context.formsy.isValidValue.call(null, _this, value);
        //return this.props._isValidValue.call(null, this, value);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(_class, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        var configure = function configure() {
          _this2.setValidations(_this2.props.validations, _this2.props.required);

          // Pass a function instead?
          _this2.context.formsy.attachToForm(_this2);
          //this.props._attachToForm(this);
        };

        if (!this.props.name) {
          throw new Error('Form Input requires a name property when used');
        }

        /*
        if (!this.props._attachToForm) {
          return setTimeout(function () {
            if (!this.isMounted()) return;
            if (!this.props._attachToForm) {
              throw new Error('Form Mixin requires component to be nested in a Form');
            }
            configure();
          }.bind(this), 0);
        }
        */
        configure();
      }

      // We have to make the validate method is kept when new props are added

    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.setValidations(nextProps.validations, nextProps.required);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        // If the value passed has changed, set it. If value is not passed it will
        // internally update, and this will never run
        if (!utils.isSame(this.props.value, prevProps.value)) {
          this.setValue(this.props.value);
        }

        // If validations or required is changed, run a new validation
        if (!utils.isSame(this.props.validations, prevProps.validations) || !utils.isSame(this.props.required, prevProps.required)) {
          this.context.formsy.validate(this);
        }
      }

      // Detach it when component unmounts

    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context.formsy.detachFromForm(this);
        //this.props._detachFromForm(this);
      }
    }, {
      key: 'render',
      value: function render() {
        var props = _extends({
          setValidations: this.setValidations,
          setValue: this.setValue,
          resetValue: this.resetValue,
          getValue: this.getValue,
          hasValue: this.hasValue,
          getErrorMessage: this.getErrorMessage,
          getErrorMessages: this.getErrorMessages,
          isFormDisabled: this.isFormDisabled,
          isValid: this.isValid,
          isPristine: this.isPristine,
          isFormSubmitted: this.isFormSubmitted,
          isRequired: this.isRequired,
          showRequired: this.showRequired,
          showError: this.showError,
          isValidValue: this.isValidValue
        }, this.props);

        return React.createElement(Component, props);
      }

      // We validate after the value has been set

    }]);

    return _class;
  }(React.Component), _class.defaultProps = {
    validationError: '',
    validationErrors: {}
  }, _class.contextTypes = {
    formsy: PropTypes.object // What about required?
  }, _temp2;
};