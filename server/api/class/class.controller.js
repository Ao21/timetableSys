/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */


var Entry = require('./class.model');
var csv = require('csv');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment'),
    moment_range = require("moment-range");


_.mixin({
    sortedGroupBy: function(list, groupByIter, sortByIter) {
        if (_.isArray(groupByIter)) {
            function groupBy(obj) {
                return _.map(groupByIter, function(key, value) {
                    return obj[key];
                });
            }
        } else {
            var groupBy = groupByIter;
        }
        if (_.isArray(sortByIter)) {
            function sortBy(obj) {
                return _.map(sortByIter, function(key, value) {
                    return obj[key];
                });
            }
        } else {
            var sortBy = sortByIter;
        }
        var groups = _.groupBy(list, groupBy);
        _.each(groups, function(value, key, list) {
            list[key] = _.sortBy(value, sortBy);
        });
        return groups;
    }
});




function groupBy(array, f) {
    var groups = {};
    array.forEach(function(o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
        return groups[group];
    })
}




// Upload and Replace
exports.upload = function(req, res) {
    var parser = csv.parse();
    var csvData = [];
    //Start Stream
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        file.on('data', function(data) {
            parser.write(data);
        });
        //Parse the File
        parser.on('readable', function() {
            while (file = parser.read()) {
                csvData.push(file);
            }
        });
        //Get array ready for entry into mongodb
        file.on('end', function(data) {
            var headerValues = csvData[0];
            csvData.shift();
            for (var i = csvData.length - 1; i >= 0; i--) {
                csvData[i][17] = csvData[i][17].trim();
                //Get Start/End Time
                csvData[i][15] = csvData[i][15].split(':');
                csvData[i][16] = csvData[i][16].split(':');
                //Create Univefsal Time MomentJs and include the start/end time
                // .hour(csvData[i][15][0]).minute(csvData[i][15][1])
                csvData[i][11] = moment(csvData[i][11], ["D/M/YYYY", "D/MM/YYYY", 'DD/M/YYYY', "DD/MM/YYYY"]).utc();
                csvData[i][12] = moment(csvData[i][12], ["D/M/YYYY", "D/MM/YYYY", 'DD/M/YYYY', "DD/MM/YYYY"]).utc();
                //Convert MomentJS to ISOString
                csvData[i][11] = csvData[i][11].toISOString();
                csvData[i][12] = csvData[i][12].toISOString();
                csvData[i][14] = convertToWeekday(csvData[i][14]);
                //Create Class Objects
                csvData[i] = _.zipObject(headerValues, csvData[i]);
            };

            var checkHeaders = _.difference(headerValues, ['uos_name', 'AlphaDigit', 'sessionid', 'Label_code', 'Part_code', 'Part_title', 'class_code', 'class_title', 'nominal_size', 'size_limit', 'is_closed', 'start_day', 'end_day', 'frequency_description', 'day_of_week', 'start_time', 'end_time', 'venue_name', 'bookingid', 'family_name', 'given_names', 'usyd_intranet_login', 'building_code', 'capacity'])
            if (checkHeaders.length === 0) {
                Entry.find().remove();
                Entry.create(csvData, function(err, classes) {
                    if (err) {
                        console.log(err);
                        //return handleError(res, err);
                    }
                    createRange();
                    return res.json(201, 'success');
                })
            }


        })
    });
};


exports.getEventsByDate = function(req, res) {
    var date = moment(req.body.date, 'YYYY-MM-DD');
    var timestamp = date.unix();
    // Entry.find({venue_name:req.body.room})
    Entry.find()
        .where('range.from').lte(timestamp)
        .where('range.to').gte(timestamp)
        .exec(function(err, docs) {
            if (err) {
                console.log(err);
            }
            docs = _.filter(docs, function(doc) {
                return doc.day_of_week == date.isoWeekday();

            })
            return res.json(201, docs);

        })
}


exports.getEventsByRoom = function(req, res) {
    var date = moment(req.body.date, 'YYYY-MM-DD');
    var rooms = req.body.room.split(',');
    var timestamp = date.unix();
    var roomArray = []

    for (var i = rooms.length - 1; i >= 0; i--) {
        roomArray.push({
            'venue_name': rooms[i]
        })
    };

    var query = Entry.find({
        $or: roomArray
    })
    query.where('range.from').lte(timestamp)
    query.where('range.to').gte(timestamp)
    query.exec(function(err, docs) {
        if (err) {
            console.log(err);
        }
        var tempDocs = [];
        docs = _.filter(docs, function(doc) {
                return doc.day_of_week == date.isoWeekday();

            })
        // Check for Frequency (Weekly/Fortnightly/Once Off)
        for (var i = docs.length - 1; i >= 0; i--) {
            var type = docs[i].frequency_description.trim();

            if (type.localeCompare('Weekly') === 0) {
                console.log('weekly');
                tempDocs.push(docs[i]);
            } else if (type.localeCompare('Fortnightly') === 0) {
                var interval = moment(docs[i].start_date).recur().every(2).weeks();
                if (interval.matches(date)) {
                    tempDocs.push(docs[i]);

                }
            } else {
                console.log('Once off');
                tempDocs.push(docs[i]);

            }
        };
        //var roomGroups = _.sortedGroupBy(docs,'venue_name');
        //var roomGroups = tempDocs.groupBy('venue_name');
        var roomGroups = groupBy(docs, function(item) {
            return [item.venue_name];
        });

        return res.json(201, roomGroups);
    })
}

exports.getEventsByUnit = function(req, res) {
    var date = moment(req.body.date, 'YYYY-MM-DD');
    var timestamp = date.unix();
    Entry.find({
            AlphaDigit: req.body.unit
        })
        .where('range.from').lte(timestamp)
        .where('range.to').gte(timestamp)
        .exec(function(err, docs) {
            if (err) {
                console.log(err);
            }
            return res.json(201, docs);

        })
}

var convertToWeekday = function(day) {
    switch (day) {
        case "MON":
            return 1;
        case "TUE":
            return 2;
        case "WED":
            return 3;
        case "THU":
            return 4;
        case "FRI":
            return 5;
        case "SAT":
            return 6;
        case "SUN":
            return 7;

    }
}


var createRange = function() {
    //Create Ranges for Everything
    Entry.find(function(err, classes) {
        for (var i = classes.length - 1; i >= 0; i--) {
            var startDate = moment(classes[i].start_day);
            var endDate = moment(classes[i].end_day);
            var range = moment_range().range(startDate, endDate);
            range = _.toArray(range);
            var newRange = {
                from: range[0].unix(),
                to: range[1].unix()
            }

            Entry.findOneAndUpdate({
                _id: classes[i]._id
            }, {
                range: newRange
            }, {
                upsert: true
            }, function(err, doc) {
                if (err) {}
                console.log('updated range');
            })

        };

    })
}

// Get list of things
exports.index = function(req, res) {
    Entry.find({}, 'uos_name AlphaDigit start_day end_day day_of_week start_time end_time venue_name day', function(err, classes) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, classes);
    });
};

// Get a single thing
exports.show = function(req, res) {
    Entry.findById(req.params.id, function(err, entry) {
        if (err) {
            return handleError(res, err);
        }
        if (!entry) {
            return res.send(404);
        }
        return res.json(entry);
    });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
    Entry.create(req.body, function(err, entry) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, entry);
    });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Entry.findById(req.params.id, function(err, entry) {
        if (err) {
            return handleError(res, err);
        }
        if (!entry) {
            return res.send(404);
        }
        var updated = _.merge(entry, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, entry);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
    Entry.findById(req.params.id, function(err, entry) {
        if (err) {
            return handleError(res, err);
        }
        if (!entry) {
            return res.send(404);
        }
        entry.remove(function(err) {
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
