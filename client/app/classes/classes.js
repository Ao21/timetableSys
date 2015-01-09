'use strict';

angular.module('timetablesNewApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('classes', {
        url: '/classes',
        templateUrl: 'app/classes/classes.html',
        controller: 'ClassesCtrl'
      });
  });