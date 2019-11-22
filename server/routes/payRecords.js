var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pay = require('../models/payRecords')
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
  if(req.query.payer) params.payer=req.query.payer;
  if(req.query.dateBegin && req.query.dateEnd) params.payDay={$gte: req.query.dateBegin, $lt: req.query.dateEnd};
  if(req.query.payDay) params.payDay=req.query.payDay;

  var page = parseInt(req.query.page);
  var pageSize = parseInt(req.query.pageSize);
  var skip=(page-1)*pageSize;
  if(page===0) {skip=null;pageSize=null}
  Pay.count(params,function (err,count) {
    Pay.find(params).skip(skip).limit(pageSize).sort({ 'payDay' : 1 }).exec(function (err, doc) {
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
  if(req.body.payDay) params.payDay=req.body.payDay;
  Pay.find(params).exec(function (err, doc) {
    if(doc && doc.length>0){
      res.json({
        code: '400',
        message: '该日期已有付款记录',
        data: ''
      })
    }else {
      var pay=new Pay(
        {
          eater: req.body.eater,
          payDay: req.body.payDay,
          payMoney: req.body.payMoney,
          payer: req.body.payer,
          remark: req.body.remark,
          createTime:new Date(),
          updateTime:new Date()
        }
      );
      pay.save(function (err) {
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
          });
          req.body.eater.forEach(item=>{
            var payMoneyAverage=Number((req.body.payMoney/req.body.eater.length).toFixed(2));
            var condition=req.body;
            condition.name=item;
            condition.payMoneyAverage=payMoneyAverage;
            addPay({name:item,date:req.body.payDay},condition);
          })
        }
      })
    }
  });
});
router.post('/edit',function (req,res,next) {
  Pay.find({_id:req.body._id}).exec(function (err, doc) {
    var user={
      eater: req.body.eater,
      payDay: req.body.payDay,
      payMoney: req.body.payMoney,
      payer: req.body.payer,
      remark: req.body.remark,
      updateTime:new Date()
    };
    let target={_id:req.body._id};
    Pay.update(target,user,function (err) {
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
    });
    let oldEater=doc[0].eater || [];
    let newEater=req.body.eater || [];
    newEater.forEach(item=>{
      let payMoneyAverage=Number((req.body.payMoney/req.body.eater.length).toFixed(2));
      addPay({name:item,date:req.body.payDay},{...req.body,name:item,payMoneyAverage:payMoneyAverage});
    });
    oldEater.forEach(item=>{
      if(newEater.indexOf(item)===-1){
        let params={name:item,date:req.body.payDay};
        findTimeForDel(params);
      }
    });

  });
});

router.post('/del',function (req,res,next) {
  Pay.find({_id:req.body._id}).exec(function (err, doc) {
    let target={_id:req.body._id};
    Pay.remove(target,function (err) {
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
    });
    let eater=doc[0].eater || [];
    eater.forEach(item=>{
      let params={name:item,date:doc[0].payDay};
      findTimeForDel(params);
    });

  });
});




function addPay(query,condition){
  var params={};
  if(query.name) params.name=query.name;
  if(query.date) params.date=query.date;
  Overtime.find(params).exec(function (err, doc) {
    if(doc && doc.length>0){
      doc.forEach(item=>{
        editOverTime({...condition,_id:item._id})
      })
    }else {
      var paramAdd=condition;
      paramAdd.name=query.name;
      addOverTime(paramAdd);
    }
  });
}
function addOverTime(condition){
  var overtime=new Overtime(
    {
      name:condition.name,
      date:condition.payDay,
      status:'created',
      overtimeType:'other',
      payType:'other',
      payForMe:condition.payer,
      payForWho:null,
      payMoney:condition.payMoneyAverage,
      remark:'付账人自动新增',
      createTime:new Date(),
      updateTime:new Date()
    }
  );
  overtime.save()
}
function editOverTime(condition){
  var overtime=(
    {
      overtimeType:'other',
      payType:'other',
      payForMe:condition.payer,
      payForWho:null,
      payMoney:condition.payMoneyAverage,
      remark:'付账人自动更新',
      updateTime:new Date()
    }
  );
  var target={_id:condition._id};
  Overtime.update(target,overtime,function (err) {
    if(err){
      console.log('付账人更新加班记录-err',err)
    }
  })
}
function findTimeForDel(params){
  Overtime.find(params).exec(function (err, doc) {
    if(doc[0]){
      let target={_id:doc[0]._id};
      Overtime.remove(target,(err)=>{
        console.log('删除err',err)
      })
    }
  });
}
module.exports = router;
