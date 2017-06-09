'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Mixin = require('./Mixin.js');

var _Mixin2 = _interopRequireDefault(_Mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = global.React || require('react');

exports.default = function () {
  return function (Component) {
    return (0, _Mixin2.default)(function (props) {
      return React.createElement(Component, props);
    });
  };
};