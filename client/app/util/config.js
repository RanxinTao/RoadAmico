'use strict';

angular.module('roadAmicoApp').constant('config', {
  appLive: false,

  translate: {
    fallback: 'en',
    useFallback: true    // Set to true for production. Setting to false makes it easier to see where we need translations
  }
});
