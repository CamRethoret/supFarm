/*Model Growing */

var mongoose=require('./getMongoose.js').mongoose,
    GrowingSchema = mongoose.Schema({
        type : {                      // le type de plantation (nom)
            type : String,
            required: true,
            unique : true
        },
        grow_rate : {                 // le temps pour arriver à maturation
            type : Number,
            required : true,
            unique : false
        },
        decay_time : {                // le temps que la plantation reste a 100% de recolte
            type : Number,
            required : true,
            unique : false
        },
        productivity : {              // la quantité de recolte pour un decay_time a 100%
            type : Number,
            required : true,
            unique : false
        },
        storability : {               // le temps qu'il peut être stocké sans etre corrompu
            type : Number,
            required : true,
            unique : false
        },
        seed_price : {                // le prix à payer pour pouvoir planter
            type : Number,
            required : true,
            unique : false
        }
    }),

    GrowingModel = mongoose.model('Growing', GrowingSchema);

exports.Growing = GrowingModel;
