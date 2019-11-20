var mongoose=require('mongoose');
var overtimeSchema=mongoose.Schema({
  name:String,
  date:Date,
  status:String,
  overtimeType :String,
  payType:String,
  payForMe:String,
  payForWho:String,
  payMoney:Number,
  remark :String,
  createTime:Date,
  updateTime:Date,
});
module.exports=mongoose.model('Overtime',overtimeSchema,'overtimeRecords');
