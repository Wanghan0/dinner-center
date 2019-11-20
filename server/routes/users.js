var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users')


mongoose.connect('mongodb://localhost:27017/overtimeStatistics',{ useNewUrlParser: true },function (err) {
  if(err){
    console.log('数据库连接失败');
  }else{
    console.log('数据库连接成功~');
  }
});
router.get('/login',function (req,res,next) {
  var params={};
  if(req.query.username) params.name=req.query.username;
  if(req.query.password) params.password=req.query.password;
  if(req.query.username==='王晗' && req.query.password==="hjkl;'"){
    res.json({
      code: '200',
      message: 'welcome author',
      data: 'welcome author',
    })
  }else {
    Users.find({name:req.query.username}).exec(function (err, doc) {
      if (err) {
        res.json({
          code: "400",
          message: err.message
        })
      } else if (doc && doc.length===1){
        if(doc[0].password===req.query.password){
          res.session.user = doc[0].name;
          res.json({
            code: '200',
            message: '查找成功！',
            data: '查找成功！',
          })
        }else {
          res.json({
            code: "400",
            message: '用户名与密码不匹配！'
          })
        }

      }else if(!doc || doc.length===0){
        res.json({
          code: "400",
          message: '用户名不存在，请先注册！'
        })
      }
    })
  }
})
router.get('/list',function (req,res,next) {
  Users.find().exec(function (err, doc) {
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
        })
      }
    }
  })
})
router.post('/add',function (req,res,next) {
  Users.find({name:req.body.name}).exec(function(err,doc){
    if(!doc || doc.length===0){
      var user=new Users(
        {
          name:req.body.name,
          type:req.body.type || 'in',
          password:req.body.password || '123456',
        }
      );
      user.save(function (err) {
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
    }else {
      res.json({
        code: '400',
        message: '该用户已存在！',
        data: ''
      })
    }
  });
  // console.log('myQuery',myQuery)
  // if(myQuery){
  //   res.json({
  //     code: '400',
  //     message: '该用户已存在！',
  //     data: ''
  //   })
  //   return;
  // }
  // var user=new Users(
  //   {
  //     name:req.body.name,
  //     type:req.body.type,
  //   }
  // );
  // user.save(function (err) {
  //   if(err){
  //     res.json({
  //       code: '400',
  //       message: err.message,
  //       data: ''
  //     })
  //   }else {
  //     res.json({
  //       code: '200',
  //       message: '新增成功！',
  //       data: 'suc'
  //     })
  //   }
  // })
});
router.post('/edit',function (req,res,next) {
  var user={
    name:req.body.name,
    type:req.body.type,
  };
  var target={_id:req.body._id};
  Users.update(target,user,function (err) {
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
  Users.remove(target,function (err) {
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
