


const mongoose = require("mongoose")


const schema = mongoose.Schema({
  role_name: {type:String, required: true},
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

class Roles extends mongoose.Model {

}

schema.loadClass(Roles)
module.exports = mongoose.model("roles", schema)