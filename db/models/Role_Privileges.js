


const mongoose = require("mongoose")


const schema = mongoose.Schema({
  role_id: {type:mongoose.SchemaType.ObjectId, required: true},
  Permission: {type:String, required: true},
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

class Role_Privileges extends mongoose.Model {

}

schema.loadClass(Role_Privileges)
module.exports = mongoose.model("role_privileges", schema)