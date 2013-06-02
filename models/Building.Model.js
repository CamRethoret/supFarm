/*Model Building */

var mongoose=require('./getMongoose.js').mongoose,
    BuildingSchema = mongoose.Schema({
        type : {                      // le type de batiment (nom)
            type : String,
            required: true,
            unique : true
        },
        cost : {                      // le cout de construction
            type : Number,
            required : true,
            unique : false
        },
        stockage : {                  // la place de stockage disponible
            type : Number,
            required : true,
            unique : false
        },
        size : {                      // la place utilisée pour construire le batiment
            type : Number,
            required : true,
            unique : false
        }
    }),

    BuildingModel = mongoose.model('Building', BuildingSchema);

exports.Building = BuildingModel;
