/*Model Item */

var mongoose=require('./getMongoose.js').mongoose,
    ItemSchema = mongoose.Schema({
        type : {                      // le type d'objet (nom)
            type : String,
            required: true,
            unique : true
        },
        description : {
            type : String,
            required : true,
            unique : false
        },
        cost : {
            type : Number,
            required : true,
            unique : false
        }
    }),

    ItemModel = mongoose.model('Item', ItemSchema);

exports.Item = ItemModel;
