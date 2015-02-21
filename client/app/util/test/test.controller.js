'use strict';

angular.module('roadAmicoApp')
  .controller('TestCtrl', function ($scope, Message, User, Auth, socket) {
    $scope.sent = Message.sent();
    $scope.received = Message.received();

    var userId = Auth.getCurrentUser()._id;
    $scope.sent.$promise.then(function () {
      socket.syncUpdatesIf('message', $scope.sent, function (message) {
        return message.from._id === userId;
      });
    });
    $scope.received.$promise.then(function () {
      socket.syncUpdatesIf('message', $scope.received, function (message) {
        return message.to._id === userId;
      });
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('message');
    });

    $scope.users = User.query();
    $scope.send = function () {
      Message.save($scope.message).$promise
        .then(function (data) {
          console.log(data);
        })
        .catch(function (err) {
          console.error(err);
        });
    };
  });
