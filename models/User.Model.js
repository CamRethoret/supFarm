/*Model User */

var mongoose=require('./getMongoose.js').mongoose,
    UserSchema = mongoose.Schema({
        first_name : {
            type : String,
            required: true,
            unique : false
        },
        last_name : {
            type : String,
            required: true,
            unique : false
        },
        email : {
            type : String,
            required: true,
            unique : true
        },
        password: {
            type : String,
            required: true,
            unique : false
        },
        age : {
            type : Number,
            required: true,
            unique : false,
            min : 18
        },
        type : {
            type : String,
            required : true,
            unique: false
        },
        money : {
            type : Number,
            required : true,
            unique : false
        },
        location : {
            type : String,
            required : true,
            unique : false
        },
        level : {
            type : Number,
            required : true,
            unique : false
        },
        difficulty : {
            type : String,
            required : true,
            unique : false,
            enum : ['Normal', 'Hard']
        },
        health_max : {
            type : Number,
            required : true,
            unique : false,
            min : 0
        },
        health : {
            type : Number,
            required : true,
            unique : false,
            min : 0
        },
        status : {
            type : String,
            required : true,
            unique : false,
            enum : ['Playing', 'Resting']
        }
    }),

UserModel = mongoose.model('User', UserSchema);

exports.User = UserModel;
