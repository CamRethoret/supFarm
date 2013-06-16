/*Model Item */

var mongoose=require('./getMongoose.js').mongoose,
    ItemSchema = mongoose.Schema({
        type : {                      // le type d'objet (nom)
            type : String,
            required: true,
            unique : false
        },
        user_id : {
            type : String,
            required : true,
            unique : false
        }
    }),

    ItemModel = mongoose.model('Item', ItemSchema);

exports.Item = ItemModel;
