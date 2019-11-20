var mongoose=require('mongoose');
var countSchema=mongoose.Schema({
  countDateBegin:Date,
  countDateEnd:Date,
  status:String,
  remark:String,
  overtimeList:[String],
  countResult:[{}],
  summation:{
    selfCount:Number,
    snacksFund:Number,
    rest:Number,
  },
  createTime:Date,
});
module.exports=mongoose.model('Count',countSchema,'countLog');
