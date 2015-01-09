angular.module('timetablesNewApp')
    .service('TimetableServices', function(Restangular, $state) {

        var baseApi = Restangular.all('api');

        return {
            create: function(timetable) {
                return baseApi.all('timetable').post(timetable);
            },
            getAll: function() {
                return baseApi.all('timetables').getList();
            },
            get: function(id) {
                return baseApi.one('timetables', id).get();
            },
            
           
            
        }
    })
