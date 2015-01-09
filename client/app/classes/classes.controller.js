'use strict';

angular.module('timetablesNewApp')
  .controller('ClassesCtrl', function ($scope, $http, ClassesServices) {
    ClassesServices.getAll().then(function(data){
      
      var classesArray = data.plain();
      for (var i = classesArray.length - 1; i >= 0; i--) {
        console.log(classesArray[i].start_day)
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
      { name: 'day', visible: true },
      { name: 'start_time', visible: true },
      { name: 'end_time', visible: true },
      { name: 'venue_name', visible: true },
      ]
    };


  });
