'use strict';

angular.module('timetablesNewApp')
  .controller('RoomCtrl', function ($scope, $http, $stateParams,ClassesServices) {
    console.log($stateParams.id);
    

 	ClassesServices.getEventsForRoom('{"date":"2014/04/11","room":"Wilkinson 268 Sentient Laboratory,Wilkinson 541 URP Studio"}').then(function(data){
      

      var classesArray = data.plain();
      for (var i = classesArray.length - 1; i >= 0; i--) {
        classesArray[i].start_day = moment(classesArray[i].start_day).format('DD/MM/YYYY h:mma');
        classesArray[i].end_day = moment(classesArray[i].end_day).format('DD/MM/YYYY h:mma');
      };
      $scope.gridOptions.data = classesArray;
    })

    $scope.gridOptions = {
      enableFiltering: true,
      columnDefs:[{ name: 'id', visible: false },
      { name: 'uos_name', visible: true },
      { name: 'AlphaDigit', visible: true },
      { name: 'start_day', visible: true},
      { name: 'end_day', visible: true },
      { name: 'day_of_week', visible: true },
      { name: 'start_time', visible: true },
      { name: 'end_time', visible: true },
      { name: 'venue_name', visible: true },
      ]
    };





  });
