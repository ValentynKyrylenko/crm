/**
 * Created by Kyrylenko on 05.05.2016.
 */
var mongoose = require ('mongoose'),
    Schema = mongoose.Schema;
//Comments--------------------
var commentSchema = new Schema({
    comment:{type: String, required: true},
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps: true
});
//Customers--------------------
var customerModel = new Schema({
    name: {type: String},
    surname: {type: String},
    country: {type: String},
    email: {type: String, unique:true},
    skype: {type: String, default: 'NA'},
    phone: {type: String, default: 'NA'},
    product: {type: String},
    manager: {type: String},
    stage: {type: String, default: 'NA'},
    createdOn: {type: Date, default: Date.now},
    modifiedOn: {type: Date, default: Date.now},
    dueOn: {type: Date},
    documents: {type: String, default: 'NA'},
    notes: {type: String,  default: 'NA'},
    comments:[commentSchema]
},
{
    timestamps: true
});

module.exports = mongoose.model('Customer', customerModel);