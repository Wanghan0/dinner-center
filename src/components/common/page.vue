<template>
  <div class="page_wrap clearfix">
    <button class="pre_page" v-show="currentPage>1 && showPrev" @click="go(currentPage-1)"><i class="el-icon-arrow-left"></i></button>
    <ul class="page">
      <li @click="go(1)" :class="{curpage:currentPage==1}">1</li>

      <li class="icon-apostrophe" v-show="pages[0]>2" ></li><!--v-if="currentPage>4 && totalPage>7"-->

      <li v-for="page in pages" :class="{curpage:currentPage==page}" @click="go(page)">{{page}}</li>

      <li class="icon-apostrophe" v-show="pages[pages.length-1] < totalPage - 1"></li><!-- v-if="currentPage<totalPage-3 && totalPage>7"-->

      <li @click="go(totalPage)" :class="{curpage:currentPage==totalPage}">{{totalPage}}</li>
    </ul>
    <button class="next_page" v-show="currentPage<totalPage && showNext" @click="go(currentPage+1)"><i class="el-icon-arrow-right"></i></button>


    <!-- <div class="sele_drop page_arr">
        <p class="sele_btn" @click="sele_toggle" :class="{sele_btnchoose:iselect}">{{items[activeindex].txt}}</p>
        <ul v-show="ischecked" class="sele_list">
            <li v-for="(item,index.vue) in items" @click="sele_this(index.vue)" :class="{curli:activeindex==index.vue}">{{item.txt}}</li>
        </ul>
    </div> -->
    <span class="cur_total">第{{currentPage}}/{{totalPage}}页</span>
    <input type="number" class="jump_text" :min="1" :max="totalPage" v-model="jumpPage" />
    <button class="jump_btn" @click="go(jumpPage)">跳转</button>
    <!-- <span class="jump_topage">跳至</span><span class="jump_topage">页</span> -->


  </div>

</template>

<script type="text/javascript">

export default {
    props:{//子组件显式声明props选项，接收父组件的数据
      totalPage:{//总页数
        type:Number,
        default:10,//这里default只是展示效果用
        //required:true//暂时不写，避免报错
      },
      showItems:{//显示出来的页数
        type:Number,
        default:5
      },
      showPrev:{//是否显示“<”
        type:Boolean,
        default:true
      },
      showNext:{//是否显示“>”
        type:Boolean,
        default:true
      },
      showJump:{//是否显示跳转
        type:Boolean,
        default:true
      },
      initPage:{
        type:Number,
        default:1
      }
    },
    data: function() {
        return {
          currentPage:0,
          //pages:[],
          jumpPage:0
        }
    },
    created:function(){//初始化时候currentPage赋值
      this.currentPage=this.initPage;
//      console.log("初始化加载page");
      // if(this.totalPage==1){
      //   this.currentPage = 1;
      // }
    },
    methods: {
      go:function(page){
        if(page<1){
          page=1
        }
        if(page>this.totalPage){
          page=this.totalPage
        }
        if(page===this.currentPage){
          return
        }
        this.currentPage=parseInt(page,10)//点击之后，当前页就是点击的这一页

        this.$emit("goPage",{//点击触发父组件的自定义事件 this.$emit("goPage",this.currentPage)
          page:this.currentPage
        })
//         console.log("点击page");
      }
    },
    watch:{
      currentPage(newVal){
        this.jumpPage=newVal
//        console.log("监控总页数的值变化");
      },
      initPage(newVal){
        if(this.currentPage!==newVal){
          this.currentPage=newVal
        }
      },
      totalPage: function(val,oldVal){
//         console.log("oldVal"+oldVal);
//         console.log("val"+val);
         // if(val==1){
//          this.currentPage =1;
         // }
      }
    },
    computed:{//获取pages数组
      pages () { //pages始终是跟当前页currentPage以及配置中需要显示的showItems强相关的
        // 根据起始页码和结束页码得到页码数组
        let getPages = (start,end) => {
            if(start <= 1 || start > end || start >= this.totalPage) {
                start = 2
            }
            if(end >= this.totalPage || end < start || end <= 1) {
                end = this.totalPage - 1
            }
            let arr = []
            for(let i = start; i <= end; i++) {
                arr.push(i)
            }
            return arr
        }
        let counts = this.showItems  //显示出来的页数 5
        if(this.totalPage < counts + 2) { //6<2+5，总页数少于7页
            return getPages(2,this.totalPage) //显示2-6页
        } else {
            if(this.currentPage <= Math.ceil(counts/2)) { //向上取整<=3，当前页是前三页1/2/3的话，显示2-5页
                return getPages(2,counts)
            } else if(this.currentPage >= this.totalPage - Math.floor(counts/2)) { //当前页是后三页的话，显示6-9，倒数第四页——倒数第一页
                return getPages(this.totalPage + 1 - counts,this.totalPage - 1)
            } else {
                let half = Math.ceil(counts/2) - 1
                let end = this.currentPage + half
                if(counts % 2 === 0) { //如果显示的页数是偶数，向后再加1，后面再多显示1页 4 5 (6) 7 8 9
                    end++
                }
                return getPages(this.currentPage - half,end) //4 5 (6) 7 8
            }
        }
      }
    }


}
</script>

<style scoped>
.page_wrap{color: rgba(0,0,0,0.65);margin-top: 20px;}
.page_wrap button{float: left;width: 26px; height: 26px;border:solid 1px #D9D9D9;line-height: 26px;background-color: #fff;border-radius: 4px;box-sizing:content-box;}
.pre_page{}
.next_page{margin-left: 8px;}
/*左右箭头不可用*/
.dis_pre,.dis_next{cursor: not-allowed; }
.dis_pre:before,.dis_next:before{color: #ccc;}

.page{float: left;}
.page li{float: left;padding: 0 10px; height: 26px;border:solid 1px #D9D9D9;line-height: 26px;border-radius: 4px;margin-left: 8px;cursor: pointer;}
.page li:hover,.page .curpage{background-color: #108EE9;color: #fff;border-color:#108EE9; }

.page .icon-apostrophe{color: #ccc;border-color:transparent;margin: 0 -8px 0 0px;font-size: 26px;padding: 0 6px;line-height: 20px;cursor: default;}
.page .icon-apostrophe:hover{background-color: transparent;color:#ccc;border-color:transparent; }
/*选择每页显示多少条*/
.page_arr{width: auto;margin:0 16px;}
.page_arr .sele_btn{padding: 0 25px 0 15px;}
.page_arr .sele_btn:after{border-right-color:rgba(0,0,0,0.65);border-bottom-color:rgba(0,0,0,0.65); }
/*第1/10页*/
.cur_total{float: left; height: 28px;line-height: 28px;margin:0 20px;}/*.jump_topage*/
.jump_text{float: left;width: 38px;color: rgba(0,0,0,0.65);text-align: center;padding: 0 4px!important;}
.page_wrap .jump_btn{width: auto;padding: 0 12px;font-size: 12px;color: rgba(0,0,0,0.65);background-color: #F7F7F7;margin-left: 8px;}
  button i{line-height: 26px}
</style>
