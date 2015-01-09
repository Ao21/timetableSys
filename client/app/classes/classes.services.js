angular.module('timetablesNewApp')
    .service('ClassesServices', function(Restangular, $state) {

        var baseApi = Restangular.all('api');

        return {
            create: function(entry) {
                return baseApi.all('class').post(entry);
            },
            getAll: function() {
                return baseApi.all('class').getList();
            },
            getEventsForDay: function(day){
                return baseApi.all('class/day').post(day);
            },
            getEventsForRoom: function(day){
                return baseApi.all('class/room').post(day);
            }
           
            
        }
    })
