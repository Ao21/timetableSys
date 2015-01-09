/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';


var Timetable = require('./timetable.model'),
    _ = require('lodash'),
    moment = require('moment'),
    crypto = require('crypto'),
    request = require('request');   


// Get list of things
exports.index = function(req, res) {
    Timetable.find(function(err, timetables) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, timetables);
    });
};

exports.getBuildingListing = function(req, res) {
    var baseUrl = "https://web.timetable.usyd.edu.au",
        webService = "/webservice/VenueSchedule",
        appid = 'VenueSchedule',
        request_type = 'GET',
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        startDay = '20140909',
        endDay = '20141223',
        startTime = '540',
        endTime = '660',
        secret = 'venues',
        buildingCode = 'G04';

    var tokenParameters = webService + request_type + 'appid=' + appid + 'secret' + 'timestamp=' + time;
    var test = '/webservice/TimetableGETappid=businesshashstudent=299900001timestamp=2013-05-14 13:24:11';


    //console.log(tokenParameters);
    //console.log(test);
    

    // /webservice/VenueScheduleGETappid=venuescheduleendDay=20140909endTime=660startDay=20140909startTime=540timestamp=2015-01-08 16:12:07venueAlias=J03.351venues

    var token = 'webservice/VenueScheduleGETappid=' +appid+ 'endday=' + endDay + 'endtime=' +endTime + 'startday=' + startDay + 'starttime' + startTime + 'timetable=' + time + 'venuealias=j03.351' + 'secret' ;

    var token = crypto.createHash('sha512').update(token).digest('hex');

    //https://web.timetable.usyd.edu.au/webservice/VenueSchedule?timestamp=2015-01-08+16%3A12%3A07&endDay=20140909&venueAlias=J03.351&appid=venueschedule&endTime=660&token=89114ea892cee93e01e1557d9d6ec5e7d637dc275c39e659f8406d83ffa1b983f9ec94c27485b965e412a4064920bd50a3bf2d83b6b5cad36700cff7a498b4db&startTime=540&startDay=20140909

    var url = webService + '?timestamp=' + time + '&endDay=' + endDay + '&venueAlias=J03.351' + '&appid=' + appid + '&endTime=' + endTime + '&token' + token  + '&startDay=' + startDay + '&startTime=' +startTime; 

    //var url =  webService + '?appid=' + appid + secret + '&timestamp=' + time + '&token=' + token;
    //console.log(baseUrl + url);

    var options = {
      url : baseUrl + url,
      proxy: 'http://rbre6081:Lk8Gl4T6@www-cache.usyd.edu.au:8080'
    };
    console.log(url);
    request(options, function (error, response, body) {
       console.log(body);
    })




}

// Get a single thing
exports.show = function(req, res) {
    Timetable.findById(req.params.id, function(err, timetable) {
        if (err) {
            return handleError(res, err);
        }
        if (!timetable) {
            return res.send(404);
        }
        return res.json(timetable);
    });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
    Timetable.create(req.body, function(err, timetable) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, timetable);
    });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Timetable.findById(req.params.id, function(err, timetable) {
        if (err) {
            return handleError(res, err);
        }
        if (!timetable) {
            return res.send(404);
        }
        var updated = _.merge(timetable, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, timetable);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
    Timetable.findById(req.params.id, function(err, timetable) {
        if (err) {
            return handleError(res, err);
        }
        if (!timetable) {
            return res.send(404);
        }
        timetable.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
