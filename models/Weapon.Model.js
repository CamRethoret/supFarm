/*Model Weapon */

var mongoose=require('./getMongoose.js').mongoose,
    WeaponSchema = mongoose.Schema({
        name : {                      // le type d'objet (nom)
            type : String,
            required: true,
            unique : true
        },
        power : {
            type : Number,
            required : true,
            unique : false
        },
        hit_ratio : {
            type : Number,
            required : true,
            unique : false
        },
        hits_per_seconds : {
            type : Number,
            required : true,
            unique : false
        },
        price : {
            type : Number,
            required : true,
            unique : false
        }
    }),

    WeaponModel = mongoose.model('Weapon', WeaponSchema);

exports.Weapon = WeaponModel;
