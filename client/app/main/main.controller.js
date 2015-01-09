'use strict';

angular.module('timetablesNewApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });


    $scope.uploadFile2 = function(files){
      var fd = new FormData();
      fd.append("file", files[0]);
      console.log(files[0]);
      $http.post('api/class/upload', fd, {
              headers: {'Content-Type': undefined },
              transformRequest: angular.identity
          }).success( console.log('yay') ).error( console.log('damn!') );

    }

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
