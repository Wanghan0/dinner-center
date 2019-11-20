var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Count = require('../models/countLog')
var Overtime = require('../models/overtimeRecords')

router.get('/list',function (req,res,next) {
  var params={};
  if(req.query.countDateBegin) params.countDateBegin={$gte: req.query.countDateBegin};
  if(req.query.countDateEnd) params.countDateEnd={$lt: req.query.countDateEnd};
  if(req.query.status) params.status=req.query.status;

  var page = parseInt(req.query.page);
  var pageSize = parseInt(req.query.pageSize);
  var skip=(page-1)*pageSize;
  if(page===0) {skip=null;pageSize=null}
  Count.count(params,function (err,count) {
    Count.find(params).skip(skip).limit(pageSize).sort({ 'countDateBegin' : 1 }).exec(function (err, doc) {
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
  var count=new Count(
    {
      countDateBegin:req.body.countDateBegin,
      countDateEnd:req.body.countDateEnd,
      status:req.body.status,
      remark:req.body.remark,
      overtimeList:req.body.overtimeList,
      countResult: req.body.countResult,
      summation:req.body.summation,
      createTime:new Date(),
    }
  );
  count.save(function (err) {
    if(err){
      res.json({
        code: '400',
        message: err.message,
        data: ''
      })
    }else {
      req.body.overtimeList.forEach(item=>{
        updateOverTime(item,'counted');
      });
      res.json({
        code: '200',
        message: '新增成功！',
        data: 'suc'
      })
    }
  })

});
router.post('/edit',function (req,res,next) {
  var count={
    status:'applied',
  };
  var target={_id:req.body._id};
  Count.update(target,count,function (err) {
    if(err){
      res.json({
        code: '400',
        message: err.message,
        data: ''
      })
    }else {
      req.body.overtimeList.forEach(item=>{
        updateOverTime(item,'applied');
      });
      res.json({
        code: '200',
        message: '编辑成功！',
        data: 'suc'
      })
    }
  })
});

router.post('/del',function (req,res,next) {
  var target={_id:req.body._id};
  Count.remove(target,function (err) {
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

function updateOverTime(id,status){
  var overtime={
    status:status,
    updateTime:new Date()
  };
  var target={_id:id};
  Overtime.updateOne(target,overtime,function (err) {
    if(err){
     console.log('更新加班记录-err',err)
    }
  })
}

module.exports = router;
