<!--created by wanghan-->
<template>
  <div>
    <p class="title">
      统计
    </p>
    <searchForm :fields="fields" @search="search"></searchForm>
    <contentTable
      v-loading="tableLoading" element-loading-background="rgba(0, 0, 0, 0.6)"
      ref="table"
      :titles="titles"
      :constants="constants"
      :totalPage="totalPage"
      :pageParams="searchParam"
      @goPage="nextPage"
      :noOperat="false">
      <template slot="tdOperate" slot-scope="{item}">
        <button type="button" class="btn btn-intab" @click="openDetail(item)">详情</button>
        <button :disabled="item.status==='applied'" type="button" class="btn btn-intab" @click="apply(item)">报销</button>
      </template>
    </contentTable>
    <el-dialog :visible.sync="showCount" title="统计结果" width="470px" :close-on-click-modal="false">
      <table class="table" v-if="showCount">
        <tr>
          <th>加班人</th>
          <th>总额</th>
          <th>零食基金</th>
          <th>余额</th>
        </tr>
        <tr v-for="(item,index) in countResult">
          <td>{{item.name || '-'}}</td>
          <!--<td>{{item.selfCount || '-'}}</td>-->
          <!--<td>{{item.snacksFund || '-'}}</td>-->
          <!--<td>{{item.rest || '-'}}</td>-->
          <td>{{transNumShow(item.selfCount)}}</td>
          <td>{{transNumShow(item.snacksFund)}}</td>
          <td>{{transNumShow(item.rest)}}</td>
        </tr>
        <tr v-if="countResult.length>0">
          <th>合计</th>
          <!--<td>{{summation.selfCount || '-'}}</td>-->
          <!--<td>{{summation.snacksFund || '-'}}</td>-->
          <!--<td>{{summation.rest || '-'}}</td>-->
          <td>{{transNumShow(summation.selfCount)}}</td>
          <td>{{transNumShow(summation.snacksFund)}}</td>
          <td>{{transNumShow(summation.rest)}}</td>
        </tr>
        <tr v-else><td colspan="100">暂无数据</td></tr>
      </table>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import contentTable from '../common/contentTable'
  import {editCount, getCountList} from "../../api";
  import editForm from "../common/editForm";
  import searchForm from "../common/searchForm";
  export default {
    name: '',
    components: {
      contentTable,
      editForm,
      searchForm
    },
    data() {
      return {
        tableLoading:false,
        showCount:false,
        showEditForm:false,
        countResult:{snacksFund:0,selfCount:0,rest:0},
        summation:{snacksFund:0,selfCount:0,rest:0},
        searchParam:{
          page:1,
          pageSize:15
        },
        totalPage:0,
        condition:{status:'counted'},
        constants:[],
        titles:[
          {name:'统计开始时间',value:'countDateBegin',timeFormat:'yyyy-MM-dd'},
          {name:'统计截止时间',value:'countDateEnd',timeFormat:'yyyy-MM-dd'},
          {name:'状态',value:'status',options:[{label:'已交发票',value:'counted'},{label:'已报销',value:'applied'}]},
          {name:'备注',value:'remark'},
          {name:'创建时间',value:'createTime',timeFormat:'yyyy-MM-dd hh:mm:ss'},

        ],
        fields:{
          status:{type: 'select',value:'counted', label: '状态',options:[{label:'已交发票',value:'counted'},{label:'已报销',value:'applied'}]},
          countDateBegin:{type: 'date', label: '统计开始时间'},
          countDateEnd:{type: 'date', label: '统计截止时间'},
        },
      }
    },
    computed: {
    },
    watch:{
    },
    created() {
      this.init();
    },
    methods: {
      //查看详情
      openDetail(item){
        this.countResult=item.countResult;
        this.summation=item.summation;
        this.showCount=true;
      },
      //列表
      init(){
        this.tableLoading=true;
        getCountList({...this.searchParam,...this.condition}).then(res => {
          this.constants = res.data;
          this.totalPage=Math.ceil(res.total/this.searchParam.pageSize);
          this.tableLoading=false;
        }).catch(err=>{this.tableLoading=false;})
      },
      //查询
      search(val){
        this.condition={...val};
        this.condition.dateBegin=val.date?val.date[0]:null;
        this.condition.dateEnd=val.date?val.date[1]:null;
        this.searchParam.page=1;
        this.totalPage=0;
        this.init()
      },
      //翻页
      nextPage(jumpPage){
        this.searchParam.page=jumpPage.page;
        this.init();
      },
      //报销
      apply(item){
        this.$confirm('确定此条记录已经报销了咩？','提示').then(()=>{
          editCount({_id:item._id,overtimeList:item.overtimeList}).then(res => {
            this.init();
            this.$message({type:'success',message:'报销成功！'})
          }).catch(err =>{});
        }).catch(()=>{})
      },
      transNumShow(num){
        if(num && typeof num==='number'){
          return num.toFixed(0)
        }else {
          return 0
        }
      }
    }
  }

</script>

<style scoped>

</style>
