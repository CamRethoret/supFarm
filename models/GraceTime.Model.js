/*Model GraceTime */

var mongoose=require('./getMongoose.js').mongoose,
    GraceTimeSchema = mongoose.Schema({
        winner_id : {                      // le type d'objet (nom)
            type : String,
            required: true,
            unique : false
        },
        looser_id : {
            type : String,
            required : true,
            unique : false
        },
        time : {
            type : Number,
            required : true,
            unique : false
        }
    }),

    GraceTimeModel = mongoose.model('GraceTime', GraceTimeSchema);

exports.GraceTime = GraceTimeModel;
