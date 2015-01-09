'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimetableSchema = new Schema({
  name: String,
  rooms: String,
  description: String 

});

module.exports = mongoose.model('Timetable', TimetableSchema);