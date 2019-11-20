var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Demo =require('../models/demo');

mongoose.connect('mongodb://localhost:27017/sharing',function (err) {
  if(err){
    console.log('数据库连接失败');
  }else{
    console.log('数据库连接成功~');
  }
});
router.get('/testList', function(req, res, next) {
  var params={};
  if(req.query.name) params.name=req.query.name;
  if(req.query.sex) params.sex=req.query.sex;
  if(req.query.age) params.age=req.query.age;
  if(req.query.like) params.like=req.query.like;

  var page = parseInt(req.query.page);
  var pageSize = parseInt(req.query.pageSize);
  var skip=(page-1)*pageSize;
  Demo.count(params,function (err,count) {
    Demo.find(params).skip(skip).limit(pageSize).exec(function (err, doc) {
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
  })
});

router.post('/testAdd',function (req,res,next) {
  var demo=new Demo(
    {
      name:req.body.name,
      sex:req.body.sex,
      age:req.body.age,
      like:req.body.like,
    }
  );
  demo.save(function (err) {
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
});
router.post('/testEdit',function (req,res,next) {
  var demo={
    name:req.body.name,
    sex:req.body.sex,
    age:req.body.age,
    like:req.body.like,
  };
  var target={_id:req.body._id};
  Demo.update(target,demo,function (err) {
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
  var target={_id:req.body._id};
  Demo.remove(target,function (err) {
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
module.exports = router;
