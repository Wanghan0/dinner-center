var mongoose=require('mongoose');
var demoSchema=mongoose.Schema({
  id:Number,
  name:String,
  sex:String,
  age:Number,
  like:String
});
module.exports=mongoose.model('Demo',demoSchema,'demo');
