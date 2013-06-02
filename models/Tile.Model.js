/*Model Tile */

var mongoose=require('./getMongoose.js').mongoose,
    TileSchema = mongoose.Schema({
        status : {                      // a qui appartient la case (ID ou NULL)
            type : Number,
            required: true,
            unique : false
        },
        humidity : {
            type : Number,
            required: true,
            unique : false
        },
        fertility : {
            type : Number,
            required: true,
            unique : false
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
        growing_id : {
            type: Number,
            required : false,
            unique : false
        }
    }),

    TileModel = mongoose.model('Tile', TileSchema);

exports.Tile = TileModel;
