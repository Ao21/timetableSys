'use strict';

angular.module('timetablesNewApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('timetables', {
        url: '/timetables',
        templateUrl: 'app/timetable/timetable.html',
        controller: 'TimetableCtrl'
      })
      .state('timetable', {
        url: '/timetables/:id',
        templateUrl: 'app/timetable/timetable.html',
        controller: 'TimetableCtrl'
      });
  });