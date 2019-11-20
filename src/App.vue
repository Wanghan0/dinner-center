<template>
  <div id="app">
    <!--<loading></loading>-->
    <vheader></vheader>
    <div class="main clearfix">
      <div class="pub_menu">
        <h3 class="pub_menu_title">晚饭报销平台</h3>
        <menu-dynamic v-if="isShowMenu" :menuData="menuData"></menu-dynamic>
      </div>
      <router-view class="content"></router-view>
    </div>
  </div>
</template>

<script>
  import vheader from './components/header/header.vue'
  import menuDynamic from './components/menu/menuDynamic.vue'
  import {permsBtnAll} from './api/permsData.js'    //所有已埋权限的元素（按钮）列表
  import {menuData} from './components/menu/staticMenuData.js' //静态菜单数据
  // import {userGetPerms} from './api/index.js'
  import loading from './components/pages/login'

  export default {
    name: 'app',
    data() {
      return {
        isShowMenu: true,   //用来更新视图
        menuData: [],
        resourceSwitch: true,  //是否启用静态资源
      }
    },
    components: {vheader, menuDynamic,loading},
    created() {
      this.init();
      this.$store.dispatch('getUserList');
    },
    watch: {
      //当路由变化时改变菜单点亮状态
      $route(to, from) {
        this.changeActiveUrl(to.path)
      }
    },
    methods: {
      async init(){
        if(this.resourceSwitch){   //权限全部开放
          sessionStorage.btnPerms=JSON.stringify(permsBtnAll);
          this.menuData = menuData;
        }else {                      //获取动态权限
         await this.getPerms();
        }
        if(sessionStorage.urlList && sessionStorage.urlList!=='undefined'){ //刷新后根据浏览器当前路由点亮菜单
          this.changeActiveUrl(this.$route.path)
        }else {                                        //首次登陆进来或关闭窗口后重新打开，根据第一个叶子节点点亮菜单
          let url=this.getActiveUrl(this.menuData); //获取菜单的第一个叶子节点
          this.$router.push({path:url});              //跳转，否则将进入404
          this.changeActiveUrl(url);                  //点亮
        }
      },
      //获取动态权限数据
      getPerms(){
         return userGetPerms(this).then((res)=>{
          let btnList=[];
          res.data.element.forEach(item=>{
            btnList.push(item.oid)
          });
          sessionStorage.btnPerms=JSON.stringify(btnList);   //得到元素（按钮）权限的id列表，存在sessionStorage中

          this.menuData =res.data.menu;
        }).catch(()=>{})
      },
      //得到目标URL的所有上级URL，存在sessionStorage中，用来点亮菜单
      changeActiveUrl(menuUrl){
        this.isShowMenu = false;
        let pathList = this.getParents(this.menuData, menuUrl);
        sessionStorage.urlList = JSON.stringify(pathList);
        this.$nextTick(() => {
          this.isShowMenu = true;  //解决从页面通过router.push进行路由跳转时，数据更新视图不更新的问题
        })
      },
      //获取当前路由的所有上级路由
      getParents(data, menuUrl) {
        for (let i in data) {
          if (data[i].menuUrl === menuUrl) {
            return [{
              level: data[i].level,
              menuUrl: data[i].menuUrl,
            }];
          }
          if (data[i].children) {
            let ro = this.getParents(data[i].children, menuUrl);
            if (ro !== undefined)
              return ro.concat({
                level: data[i].level,
                menuUrl: data[i].menuUrl,
              });
          }
        }
      },
      //获取菜单的第一个叶子节点作为默认点亮的路由
      getActiveUrl(arr){
        let activeUrl='';
        arr.forEach((item,index)=>{
          if(index===0){
            if(item.children && item.children.length>0){
              activeUrl=this.getActiveUrl(item.children);
            }else {
              activeUrl=item.menuUrl
            }
          }
        });
        return activeUrl;
      },
    }
  }
</script>

<style scoped>
  .main {
    padding-top: 60px;
  }

  .content {
    margin-left: 200px;
    padding: 10px 20px 50px 20px;
  }

  .pub_menu {
    position: fixed;
    left: 0;
    top: 80px;
    bottom: 0;
    width: 200px;
    background-color: #3f3f3f;
    z-index: 10;
    overflow: hidden;
  }

  .pub_menu .pub_menu_title {
    width: 152px;
    margin: 20px auto;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #5c5c5c;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    font-weight: normal;
  }
</style>
