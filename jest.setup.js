import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock hasPointerCapture as it's not implemented in JSDOM
HTMLElement.prototype.hasPointerCapture = function () {
  return true; 
};
HTMLElement.prototype.releasePointerCapture = function () {
  return;
};

// Mock scrollIntoView and focus as they are not fully implemented in JSDOM
HTMLElement.prototype.scrollIntoView = function() {};
HTMLElement.prototype.focus = function() {};

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
