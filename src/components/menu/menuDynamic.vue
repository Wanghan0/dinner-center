<template>
  <div>
    <ul class="pub_menu_ul">
      <li v-for="(item,index) in menuData" class="first_item">
        <router-link
          :to="{path:item.menuUrl}" @click.native="clickNode(item)"
          :class="active(item,index)">
          <i class="icon" :class="item.icon" :style="{ paddingLeft: indent*item.level + 'px' }"></i>
          <span>{{item.menuName}}</span>
        </router-link>
        <i class="icon_triangle icon_triangle_down" v-if="item.children.length>0" :class="isactive==item.menuUrl?'icon_triangle_up':'icon_triangle_down'"></i>
        <vmenu v-if="isactive== item.menuUrl" :menuData="item.children"></vmenu>
      </li>
    </ul>
  </div>

</template>
<script type="text/javascript">
  import vmenu from './menuDynamic.vue'
  export default {
    components:{
      vmenu
    },
    name:'vmenu',
    props:['menuData'],
    watch: {
    },
    created() {
      this.init()
    },
    methods: {
      init(){
        if(sessionStorage.urlList && sessionStorage.urlList!=='undefined'){  //sessionStorage可能将undefined转换为字符串'undefined'
          let arr=JSON.parse(sessionStorage.urlList);
          let curLevel=null;
          if(this.menuData.length>0){
            curLevel=this.menuData[0].level;     //获取本组件菜单的层级
          }
          arr.forEach(item=>{
            if(item.level==curLevel){             //如果缓存路由中含有本层级的记录，则点亮缓存中的本层级路由
              this.isactive =item.menuUrl
            }
          })
        } else if(this.menuData[0]){  //初次进入时（刚登陆进来）点亮并跳转到组件第一个路由
          this.isactive=this.menuData[0].menuUrl;
          if(this.menuData[0].children.length===0){   //叶子节点时才跳转相应的路由
            this.$router.push({path:this.menuData[0].menuUrl})
          }
          // this.$router.push({path:this.menuData[0].menuUrl})
        }
      },
      //获取菜单的动态class
      active(item,index){
        let str='';
        if(item.level!==0 && this.isactive===item.menuUrl){
          str='sec_active';
        }else if(this.isactive===item.menuUrl && item.level===0){
          str='active';
        }
        return str;
      },
      //点击节点，改变点亮路由并跳转
      clickNode(i) {
        this.isactive = i.menuUrl;
        let url=this.getLeaf(i);
        this.$router.push({path:url})
//        if(i.children.length>0){
//          this.$router.push({path:i.children[0].menuUrl})
//        }
      },
      //点击某节点时获取它的叶子节点
      getLeaf(obj){
        let result='';
        if(obj.children && obj.children.length>0){
          result=this.getLeaf(obj.children[0]);
        }else {
          result=obj.menuUrl
        }
        return result
      }
    },
    data() {
      return {
        isactive: null,  //当前点亮路由
        indent:12,       //单位缩进
      }
    },
  }

</script>
<style scoped>
  .first_item {
    position: relative;
  }
  .first_item a {
    min-height: 42px;
    color: #fff;
    /*display: block;*/
    /*text-align: center;*/
    /*line-height: 42px;*/
    padding-left: 26px;
    font-size: 14px;
    opacity: 0.45;

    display: flex;
    align-items: center;
    padding-right: 25px;
  }
  .first_item .sec_item{
    background-color: #333333;
    overflow: hidden;
  }
  .first_item .active {
    background-color: #108EE9;
    color: #fff;
    opacity: 1;
  }
  .icon_triangle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-top: 1px solid #fff;
    border-right: 1px solid #fff;
    top: 16px;
    right: 16px;
  }
  .icon_triangle_down {
    transform: rotateZ(135deg);
  }
  .icon_triangle_up {
    transform: rotateZ(-45deg);
    top: 19px;
  }
  .first_item .sec_active {
    opacity: 1;
  }
  .icon{
    font-size: 18px;
    margin-right: 6px;
    display: inline-block;
    height: 18px;
    line-height: 18px;
    width: 18px;
  }
  .content {
    padding: 80px 20px 0 220px;
    box-sizing: border-box;
    /*margin: 300px 0 0 300px;*/
    /*background-color: #ff0000;*/
  }

</style>
