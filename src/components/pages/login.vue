<!--created by wanghan-->
<template>
  <div class="box">
    <div class="main">
      <div>
        <img src="../../../static/img/logo.png">
      </div>
      <el-card class="box-card">
        <h2 class="login-title">DINNER CENTER</h2>
        <el-form :model="loginData" status-icon  ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="username" required>
            <el-input prefix-icon="el-icon-user" size="medium " type="text" v-model="loginData.username" placeholder="账号">
              <!--<template slot="prepend">账号:</template>-->
            </el-input>
          </el-form-item>
          <el-form-item prop="password" required>
            <el-input prefix-icon="el-icon-key" size="medium " type="password" v-model="loginData.password" placeholder="密码"></el-input>
          </el-form-item>
          <div class="center">
            <el-button size="medium" type="primary" @click="login">登录</el-button><br>
            <!--<el-button style="margin-top: 10px" size="medium" @click="logon">注册</el-button>-->
          </div>
        </el-form>

      </el-card>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {addUser, login} from "../../api";

  export default {
    name: '',
    components: {
    },
    data() {
      return {
        loginData:{
          username:'',
          password:'',
        },
      }
    },
    computed: {
    },
    watch:{
    },
    created() {
    },
    methods: {
      login(){
        this.$refs.ruleForm.validate().then(()=>{
          login(this.loginData).then(res => {
            this.$store.commit('curUserChange',this.loginData.username)
            // this.$message({type:'success',message:'删除成功！'})
          }).catch(err =>{

          });
        })
      },
      logon(){
        this.$refs.ruleForm.validate().then(()=>{
          addUser({name:this.loginData.username,password: this.loginData.password}).then(res => {
            this.$message({type:'success',message:'注册成功！'})
          }).catch(err =>{});
        })
      },
    }
  }

</script>

<style scoped>
  .box{
    font-family: Monospaced Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    padding-top: 200px;
    background-color: #eceef1;
    height: 1000px;
  }
  .main{
    width: 410px;
    height: 390px;
    margin:  100px auto;
    padding: 20px;
    position: relative;
  }
  .main img{
    position: absolute;
    top: -50px;
    left:150px;
    width: 150px;
    height: 150px;
  }
  .center{
    text-align: center;
  }
  .center .el-button{
    width: 100%;
  }
  .box-card{
    padding-top: 50px;
  }
  .login-title {
    text-align: center;
    /*padding-top: .5rem;*/
    font-size: 40px;
    font-weight: 200;
    color: #2e2e5a;
    margin-top: 20px;
    margin-bottom: 30px;
  }
</style>
