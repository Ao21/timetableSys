'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClassSchema = new Schema({
  uos_name: String,
  AlphaDigit: String,
  sessionid: String,
  Label_code:String,
  Part_code: String,
  Part_title:String,
  class_code: String,
  nominal_size:String,
  size_limit:String,
  is_closed:Boolean,
  start_day:Date,
  end_day:Date,
  frequency_description:String,
  day_of_week: String,
  start_time: String,
  end_time:String,
  venue_name:String,
  building_code:String,
  capacity:String,
  range:{
    from:String,
    to:String
  }

});

ClassSchema.virtual('day').get(function(){
  var day = convertToWeekday(this.day_of_week);
 return convertToWeekday(this.day_of_week);
})

ClassSchema.set('toJSON', {
    virtuals: true
});
var convertToWeekday = function(day){
  switch(day){
    case "1":
    return "Monday";
    case "2":
    return "Tuesday";
    case "3":
    return "Wednesday";
    case "4":
    return "Thursday";
    case "5":
    return "Friday";
    case "6":
    return "Saturday";
    case "7":
    return "Sunday";
    

  }
}


module.exports = mongoose.model('Class', ClassSchema);