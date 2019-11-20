<template>
  <div class="table_wrap">
    <table class="table">
      <tr>
        <th v-if="checkKey || checkItem"><input type="checkbox" v-model="isCheckall" @change="checkAll"></th>
        <th v-if="showIndex">序号</th>
        <th :width="item.width?item.width:''" v-for="item in titles">{{item.name}}</th>
        <th :width="operateWidth" v-if="!noOperat">操作</th>
      </tr>
      <tr v-for="(item,index) in constants" :key="index">
        <td v-if="checkKey"><input type="checkbox" v-model="checkArrays" :value="item[checkKey]"></td>
        <td v-else-if="checkItem"><input type="checkbox" v-model="checkArrays" :value="item"></td>
        <td v-if="showIndex">{{pageParams.pageSize*(pageParams.page-1)+index+1}}</td>
        <td v-for="one in titles" :title="one.strCut?item[one.value]:''">
          <slot name="tdValue" :item="item" :one="one">{{showWords(item[one.value],one)}}</slot>
        </td>
        <td v-if="!noOperat">
          <slot name="tdOperate" :item="item"></slot>
        </td>
      </tr>
      <tr v-if="constants.length===0">
        <td :colspan="1000">暂无内容</td>
      </tr>
      <tr v-if="addPageNumber && pageCount<totalPage && constants.length>0">
        <td :colspan="1000">
          <button class="btn btn-intab" @click="more">加载更多</button>
        </td>
      </tr>
    </table>
    <page v-if="totalPage>1 && !addPageNumber" :total-page="totalPage" v-on:goPage="nextPage" v-on:changePageSize="changePageSize"></page>
  </div>
</template>

<script>

  import page from "./page";

  export default {
    components: {
      page
    },
    props:[
      'constants',//表格内容数组
      'titles',//表头数组
      'totalPage',//总页码
      'pageParams',//分页参数{page:1,pageSize:10}，若showIndex为true,则pageParams必传
      'noOperat',//是否显示操作项
      'checkKey',//显示多选框，并且按照checkKey的字段的值保存到数组，如checkKey为oid,则选中的值为一个oid数组
      'showIndex',//是否显示序号，true为显示
      'operateWidth',//操作项固定宽度
      'checkItem',//显示多选框，并且选中的值保存为整条数据
      'addPageNumber'//是否显示更多
    ],
    data () {
      return {
        isCheckall:false,
        checkArrays:[],
        pageCount:1

      }
    },
    watch: {
      checkArrays(val){
        if(val.length === this.constants.length && this.constants.length!==0){
          this.isCheckall = true;
        }
        else{
          this.isCheckall = false;
        }
        this.$emit('checkArrays',val)
      },
      constants(val){
        if(this.checkKey){
          this.checkArrays=[];
        }
      },
      addPageNumber:{
        handler:function (val) {
          this.pageCount=val;
        }
      }
    },
    mounted () {

    },
    methods: {
      /**
       * @author wanghan
       * @date 2019/8/5
       * @Description: 表格内容转换展示
       */
      showWords(value,one){
        if(value===null || value===''){
          return '-';
        }
        let result='-';
        if(one.func){                 //支持自定义函数转换，例{name:'事件类型',value:'eventType',func:this.test},methods:test(val){if(val==='001001'){return 'whtest';}else {return '-'}},
          return one.func(value);
        }else if(one.options){        //支持给定{label:'',value:''}对应转换，例{name:'事件类型',value:'eventType',options:[{label:'showWords',value:'001001'}]}
          let obj=one.options.find(item=>{return item.value===value});
          result=obj?obj.label:value
        }else if(one.timeFormat){      //支持时间戳转换，例{name:'更新时间',value:'outime',timeFormat:'yyyy-MM-dd hh:mm:ss'},
          result=new Date(value).format(one.timeFormat)
        }else if(one.strCut){          //支持文字超出隐藏鼠标悬浮展示，例{name:'左边条件表达式',value:'leftExpression',strCut:80},
          result=this.strCut(one.strCut,value)
        }else {
          result=value;
        }
        return result;
      },
      nextPage(jumpPage){
        this.$emit('goPage',jumpPage);
      },
      changePageSize(pageSize){
        this.$emit('changePageSize',pageSize);
      },
      more(){
        this.pageCount++;
        this.$emit('addPage',this.pageCount);
      },
      checkAll(){
        this.checkArrays.length = 0;
        if(this.isCheckall){
          this.constants.forEach((item,index) =>{
            if(this.checkItem){
              this.checkArrays.push(item);
            }else if(this.checkKey){
              this.checkArrays.push(item[this.checkKey]);
            }
          })
        }
      },
      //文字超出隐藏
      strCut(num, str){
        if(!num || !str) return '-';
        if(!!str){
          if (str.split("").length < num) {
            return str.slice(0, num);
          } else return str.slice(0, num) + '...';
        }
      }
    }
  }
</script>
<style scoped>
  .table_wrap{
    background: #fff;
    margin-top: 20px;
  }
  table tr td{
    word-break: break-all;
  }
</style>
