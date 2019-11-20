var mongoose=require('mongoose');
var paySchema=mongoose.Schema({
  payer:String,
  eater:Array,
  payMoney:Number,
  payDay:Date,
  remark:String,
  createTime:Date,
  updateTime:Date,
});
module.exports=mongoose.model('Pay',paySchema,'payRecords');
