/**
 * Created by Kyrylenko on 05.05.2016.
 */
var mongoose = require ('mongoose'),
    Schema = mongoose.Schema;

//Reports--------------------
var reportModel = new Schema({
    currentWeek: {type: String},
    nextWeek: {type: String},
    weekNumber: {type: Number},
    createdOn: {type: Date, default: Date.now},
    postedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'}
},
{
    timestamps: true
});

module.exports = mongoose.model('Report', reportModel);