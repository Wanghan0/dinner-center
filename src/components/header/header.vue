<template>
  <div class="pub_header">
    <div class="pub_top">
      <p class="fl">
        <!--<a href="http://www.eastmoney.com/" target="_blank">东方财富网</a>-->
        <!--<a href="http://fund.eastmoney.com/" target="_blank">天天基金网</a>-->
        <!--<a href="https://oa-portal.eastmoney.com" target="_blank">OA门户</a>-->
      </p>
      <p class="fr">
        <a href="javascript:;">您好！</a>
        <span>|</span>
        <a href="javascript:;" @click="logoutSafely">安全退出</a></p>
    </div>
    <div class="pub_nav">
      <h1 class="pub_logo">大数据管理平台</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {baseUrl} from '../../api/env.js'
export default {
  data () {
    return {

    }
  },
  created(){
  },
  methods: {
    logoutSafely() {
      var url = window.location.href;
      window.location.href = baseUrl + '/logout';
      sessionStorage.urlList='';
      sessionStorage.btnPerms='';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pub_header{
    position: fixed;
    width: 100%;
    min-width: 1200px;
    box-sizing: border-box;
    z-index: 10;
  }
  .pub_top{
    height: 36px;
    line-height: 36px;
    padding: 0 30px;
    background-color: #3f3f3f;
  }
  .pub_top p a, .pub_top p span{
    margin-right: 15px;
    opacity: 0.45;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
  }
  .pub_nav{
    height: 44px;
    line-height: 44px;
    background-color: #fff;
    font-size: 0;
  }
  .pub_logo{
    width: 200px;
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    color: #4A4A4A;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .pub_nav ul{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
  }
  .pub_nav ul li{
    float: left;
    text-align: center;
    margin: 0 20px;
  }
  .pub_nav ul li a{
    display: inline-block;
    color: #333;
    padding: 0 20px;
  }
  .pub_nav ul li.on{
    border-bottom: 4px solid #108EE9;
  }
  .pub_nav ul li.on a{
    color: #108EE9;
  }
</style>
