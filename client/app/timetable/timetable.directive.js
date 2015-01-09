angular.module('timetablesNewApp')
    .directive('timetable', function($timeout) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            controller: 'TimetableCtrl',
            templateUrl: 'app/timetable/timetable.directive.html',
            link: function(scope, element, attrs, ngModel) {
                $timeout(function() {
                    scope.timeTableData = ngModel.$viewValue;

                })

            }
        }
    })
    .directive('timeline', function() {
        return {
            restrict: 'EA',
            require: '^timetable',
            controller: 'TimetableCtrl',
            templateUrl: 'app/timetable/timeline.directive.html',
            link: function(scope, element, attrs, ngModel) {

                console.log(scope.timeline);
                var segmentCount = 0,
                    daySegments = 144,
                    startTime = 9,
                    endTime = 24,
                    curBlockNo = 0,
                    eCount = 0,
                    events = [],
                    dayTimeLine = [];

                //Sort Events by Time
                events = scope.timeline.sort(compareMilli);

                var currentTime = moment(scope.date).hours(9);





                do {
                    var block = {},
                        currentEvent = null,
                        nextTime = 1,
                        addToSegment = 1,
                        addToMinutes = 5,
                        evs = isEventOnAtTime(currentTime);

                    console.log(currentTime.format('ha'));


                    if (evs.length > 0) {
                        //Make an event and go to end of event
                        block.starTime = evs[0].start_time.format('ha');
                        block.endTime = evs[0].end_time.format('ha');
                        block.range = moment(scope.date).range(evs[0].start_time, evs[0].end_time);
                        block.e = evs[0];

                        //Go to the end of the event
                        addToSegment = (evs[0].length / 5);
                        addToMinutes = evs[0].length;

                        block.segmentCount = addToSegment;

                        dayTimeLine.push(block);

                        eventStarted = true;

                    } else {
                        //Create Empty block and skip to next Event Time (difference between next event block)
                        eventStarted = false;
                        //If there's no events left

                    }


                    if (!eventStarted) {
                        var nextEvent = getNextEvent(currentTime);

                        //if There's an event left
                        if (nextEvent) {
                            block.starTime = currentTime.format('ha');
                            block.endTime = nextEvent.start_time.format('ha');
                            block.range = moment(scope.date).range(currentTime, nextEvent.start_time);



                            var difference = nextEvent.start_time.diff(currentTime, 'minutes');
                            addToSegment = difference / 5;
                            addToMinutes = difference;
                            block.segmentCount = addToSegment;
                            dayTimeLine.push(block);
                        } else {
                            block.starTime = currentTime.format('ha');
                            block.endTime = moment(currentTime).set('hours', 21).format('ha');
                            block.range = moment(scope.date).range(currentTime, moment(currentTime).set('hours', 21));



                            block.segmentCount = daySegments - segmentCount;
                            segmentCount = segmentCount = daySegments;
                            dayTimeLine.push(block);
                        }
                    }






                    function isEventOnAtTime(time) {
                        var evArray = [];
                        for (var x = 0; x < events.length; x++) {
                            //Check if event starts at this time
                            if (currentTime.isSame(events[x].start_time)) {
                                //Make an event and go to end of event
                                console.log(events[x].start_time.format('h:mma'))
                                evArray.push(events[x])

                            } else {
                                //Create Empty block and skip to next Event Time (difference between next event block)
                            }
                        }
                        return evArray;

                    }

                    function getNextEvent(ct) {
                        var eA = 0;
                        for (var i = 0; i < events.length; i++) {
                            if (events[i].start_time.isAfter(ct)) {

                                return events[i];
                            }
                        }


                    }

                    console.log(segmentCount);
                    segmentCount = segmentCount + addToSegment;
                    currentTime.add('minutes', addToMinutes);

                }

                while (segmentCount < daySegments);

                console.log(dayTimeLine);









                function compareMilli(a, b) {
                    if (a.start_time._d < b.start_time._d) return 0;
                    if (a.start_time._d > b.start_time._d) return 1;
                    return 0;
                }

                function dynamicSort(property) {
                    var sortOrder = 1;
                    if (property[0] === "-") {
                        sortOrder = -1;
                        property = property.substr(1);
                    }
                    return function(a, b) {
                        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                        return result * sortOrder;
                    }
                }



            }
        }
    });
