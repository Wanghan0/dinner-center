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
  if(req.body.name) params.name=req.body.name;
  if(req.body.date) params.date=req.body.date;
  Overtime.find(params).exec(function (err, doc) {
    if(doc && doc.length>0){
      res.json({
        code: '400',
        message: '该用户当天已有加班记录',
        data: ''
      })
    }else {
      var overtime=new Overtime(
        {
          name:req.body.name,
          date:req.body.date,
          status:'created',
          overtimeType:req.body.overtimeType,
          payType:req.body.payType,
          payForMe:req.body.payForMe,
          payForWho:req.body.payForWho,
          payMoney:req.body.payMoney,
          remark:req.body.remark,
          createTime:new Date(),
          updateTime:new Date()
        }
      );
      overtime.save(function (err) {
        if(err){
          res.json({
            code: '400',
            message: err.message,
            data: ''
          })
        }else {
          res.json({
            code: '200',
            message: '新增成功！',
            data: 'suc'
          })
        }
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



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
