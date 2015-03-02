'use strict';

angular.module('roadAmicoApp')
  .directive('serviceForm', function (Category) {
    return {
      scope: {
        service: '=serviceForm',
        //categories: '=',
        submit: '&',
        cancel: '@'
      },
      templateUrl: 'app/services/serviceForm/serviceForm.html',
      link: function (scope, elem, attrs) {
        scope.save = attrs.buttontext || 'Save';
        scope.submit = scope.submit || angular.noop();

        Category.query().$promise.then(function () {
          scope.categories = _.sortBy(scope.categories, 'name');
        });

        scope.add = function () {
          if (!scope.service) { scope.service = {}; }
          if (!scope.service.details) { scope.service.details = []; }
          scope.service.details.push({});
        };

        scope.remove = function (index) {
          scope.service.details.splice(index, 1);
        };
      }
    };
  });
