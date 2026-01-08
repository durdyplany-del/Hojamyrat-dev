


const mongoose = require("mongoose")


const schema = mongoose.Schema({
  role_id: {type:mongoose.SchemaType.ObjectId, required: true},
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

class User_Roles extends mongoose.Model {

}

schema.loadClass(User_Roles)
module.exports = mongoose.model("user_roles", schema)