var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Overtime = require('../models/overtimeRecords')


// mongoose.connect('mongodb://localhost:27017/overtimeStatistics',function (err) {
//   if(err){
//     console.log('数据库连接失败');
//   }else{
//     console.log('数据库连接成功~');
//   }
// });
router.get('/list',function (req,res,next) {
  var params={};
  if(req.query.name) params.name=req.query.name;
  if(req.query.payType) params.payType=req.query.payType;
  if(req.query.status) params.status=req.query.status;
  if(req.query.dateBegin && req.query.dateEnd) params.date={$gte: req.query.dateBegin, $lt: req.query.dateEnd};
  if(req.query.date) params.date=req.query.date;

  var page = parseInt(req.query.page);
  var pageSize = parseInt(req.query.pageSize);
  var skip=(page-1)*pageSize;
  if(page===0) {skip=null;pageSize=null}
  Overtime.count(params,function (err,count) {
    Overtime.find(params).skip(skip).limit(pageSize).sort({ 'date' : 1 }).exec(function (err, doc) {
      if (err) {
        res.json({
          code: "400",
          message: err.message
        })
      } else {
        if (doc) {
          res.json({
            code: '200',
            message: '查找成功！',
            data: doc,
            total: count
          })
        }
      }
    })
  });
});
router.post('/add',function (req,res,next) {
  var params={};
  // if(req.body.name) params.name=req.body.name;
  // if(req.body.date) params.date=req.body.date;
  let orList=[];
  var date=JSON.parse(req.body.date)
  date.forEach(item=>{
    orList.push({
      date:item
    })
  });
  params={
    $and : [
      { name : req.body.name },
      { $or : orList }
    ]
  };
  Overtime.find(params).exec(function (err, doc) {
    if(doc && doc.length>0){
      let exitDate='';
      let exitDateArr=[];
      doc.forEach(item=>{
        exitDate+=item.date;
        exitDateArr.push(item.date)
      });
      res.json({
        code: '400',
        message: `该用户${exitDate}已有加班记录`,
        data:exitDateArr
      })
    }else {
      date.forEach(item=>{
        addOvertime({...req.body,date:item})
      });
      res.json({
        code: '200',
        message: '添加成功！',
        data: 'suc'
      })
    }
  });

});
router.post('/edit',function (req,res,next) {
  var overtime={
    name:req.body.name,
    date:req.body.date,
    overtimeType:req.body.overtimeType,
    payType:req.body.payType,
    payForMe:req.body.payForMe,
    payForWho:req.body.payForWho,
    payMoney:req.body.payMoney,
    remark:req.body.remark,
    updateTime:new Date()
  };
  var target={_id:req.body._id};
  Overtime.updateOne(target,overtime,function (err) {
    if(err){
      res.json({
        code: '400',
        message: err.message,
        data: ''
      })
    }else {
      res.json({
        code: '200',
        message: '编辑成功！',
        data: 'suc'
      })
    }
  })
});

router.post('/del',function (req,res,next) {
  let target={_id:req.body._id};
  Overtime.remove(target,function (err) {
    if(err){
      res.json({
        code: '400',
        message: err.message,
        data: ''
      })
    }else {
      res.json({
        code: '200',
        message: '删除成功！',
        data: 'suc'
      })
    }
  })
});

function addOvertime(condition){
  var overtime=new Overtime(
    {
      name:condition.name,
      date:condition.date,
      status:'created',
      overtimeType:condition.overtimeType,
      payType:condition.payType,
      payForMe:condition.payForMe,
      payForWho:condition.payForWho,
      payMoney:condition.payMoney,
      remark:condition.remark,
      createTime:new Date(),
      updateTime:new Date()
    }
  );
  overtime.save(function (err) {
    if(err){
      console.log('新增加班记录 err', err)
    }
  })
}


 function format (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
