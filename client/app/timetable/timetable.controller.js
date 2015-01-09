'use strict';

angular.module('timetablesNewApp')
    .controller('TimetableCtrl', function($scope, $http, $stateParams, ClassesServices) {

        $scope.date = moment.tz("2014/04/11 00:00", "Australia/Sydney").utc();
        ClassesServices.getEventsForRoom('{"date":"2014/04/11","room":"Wilkinson 268 Sentient Laboratory,Wilkinson 261 Digital Media Lab"}').then(function(data) {
            var classes = data.plain();
            var today = moment($scope.date);
            for (var i = classes.length - 1; i >= 0; i--) {
                for (var x = classes[i].length - 1; x >= 0; x--) {
                    var startTimeArray = classes[i][x].start_time.split(',');
                    var endTimeArray = classes[i][x].end_time.split(',');
                    classes[i][x].start_time = moment(today).hours(startTimeArray[0]).minutes(startTimeArray[1]);
                    classes[i][x].end_time = moment(today).hours(endTimeArray[0]).minutes(endTimeArray[1]);
                    classes[i][x].duration = moment(classes[i][x].end_time).diff(moment(classes[i][x].start_time), 'minutes');
                };

            };
          
           $scope.classesInfo = classes;
        })


    });
