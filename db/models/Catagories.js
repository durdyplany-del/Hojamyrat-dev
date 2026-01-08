


const mongoose = require("mongoose")


const schema = mongoose.Schema({
  is_active: {type: Boolean, default: true},
  created_by: {
    type: mongoose.SchemaType.ObjectId,
    require: true
  }
}, {
    versionKey: false,    // mogoda her gezekde version key doreya bu bolsa sony doredenok
    timestemps: {
        createAt: "create_at",
        updateAt: "update_at"
    }
})

class Catagories extends mongoose.Model {

}

schema.loadClass(Catagories)
module.exports = mongoose.model("catagories", schema)