var mongoose=require('mongoose');
var usersSchema=mongoose.Schema({
  name:String,
  type:String,
  password:String,
});
module.exports=mongoose.model('Users',usersSchema,'user');
