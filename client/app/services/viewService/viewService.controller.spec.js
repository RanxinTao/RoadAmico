'use strict';

describe('Controller: ViewserviceCtrl', function () {

  // load the controller's module
  beforeEach(module('roadAmicoApp'));

  var ViewserviceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewserviceCtrl = $controller('ViewserviceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
