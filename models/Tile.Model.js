/*Model Tile */

var mongoose=require('./getMongoose.js').mongoose,
    TileSchema = mongoose.Schema({
        status : {                      // a qui appartient la case (ID ou NULL)
            type : String,
            required: true,
            unique : false
        },
        position : {
            type : String,
            required : true,
            unique : true
        },
        humidity : {
            type : Number,
            required: true,
            unique : false,
            min : 0,
            max : 100
        },
        fertility : {
            type : Number,
            required: true,
            unique : false,
            min : 0,
            max : 100
        },
        time : {                         // le temps de plantation
            type : Number,
            required: true,
            unique : false
        },
        health : {                       // santé de la case
            type : Number,
            required: true,
            unique : false,
            min : 0,
            max : 100
        },
        maturity : {
            type : Number,
            required : true,
            unique: false,
            min : 0,
            max : 100
        },
        growing : {
            type: String,
            required : false,
            unique : false,
            default: null
        },
        building : {
            type : String,
            required : false,
            unique : false,
            default : null
        }
    }),

    TileModel = mongoose.model('Tile', TileSchema);

exports.Tile = TileModel;
