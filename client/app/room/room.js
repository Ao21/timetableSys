'use strict';

angular.module('timetablesNewApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/rooms/:id',
        templateUrl: 'app/timetable/timetable.html',
        controller: 'RoomCtrl'
      });
  });