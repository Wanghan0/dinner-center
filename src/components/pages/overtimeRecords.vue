<!--created by wanghan-->
<template>
  <div>
    <p class="title">
      用户管理
      <el-button type="primary" size="mini" @click="edit">新增</el-button>
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
        <button type="button" class="btn btn-intab" @click="edit(item)">编辑</button>
        <button type="button" class="btn btn-intab" @click="del(item)">删除</button>
      </template>
    </contentTable>
    <el-dialog :visible.sync="showEditForm" :title="editData._id?'编辑':'新增'" width="470px" :close-on-click-modal="false">
      <edit-form
        v-if="showEditForm"
        :fields="editFields"
        :editData="editData"
        @save="save"
        label-width="120px"
        @close="showEditForm=false">
      </edit-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import contentTable from '../common/contentTable'
  import {addOvertime, delOvertime, editOvertime, getOvertimeList} from "../../api";
  import editForm from "../common/editForm";
  import searchForm from "../common/searchForm";
  import {options} from './datePickerOptions.js'
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
        showEditForm:false,
        editData:{},
        condition:{},
        searchParam:{
          page:1,
          pageSize:15
        },
        totalPage:0,
        constants:[],
        titles:[
          {name:'加班人',value:'name'},
          {name:'加班日期',value:'date',timeFormat:'yyyy-MM-dd'},
          // {name:'加班类型',value:'overtimeType',options:[{label:'晚饭',value:'dinner'},{label:'周末午饭',value:'lunch'}]},
          {name:'支付金额',value:'payMoney'},
          {name:'支付类型',value:'payType',options:[{label:'自费',value:'self'},{label:'他付',value:'other'}]},
          {name:'谁付的',value:'payForMe'},
          {name:'状态',value:'status',options:[{label:'新建',value:'created'},{label:'已交发票',value:'counted'},{label:'已报销',value:'applied'}]},
          // {name:'给谁付了钱',value:'payForWho'},
          {name:'备注',value:'remark'},
          {name:'创建时间',value:'createTime',timeFormat:'yyyy-MM-dd hh:mm:ss'},
          {name:'更新时间',value:'updateTime',timeFormat:'yyyy-MM-dd hh:mm:ss'},

        ],
        fields:{
          name:{type: 'select', label: '加班人', required:true,value:'',
            options:[],keyValue:{label:'name',value:'name'}},
          status:{type: 'select', label: '状态', required:true,
            options:[{label:'新建',value:'created'},{label:'已交发票',value:'counted'},{label:'已报销',value:'applied'}]},
          payType:{type: 'select', label: '支付类型', required:true,
            options:[{label:'自费',value:'self'},{label:'他付',value:'other'}]},
          date:{type: 'date', label: '加班日期'},
          dateRange:{type: 'daterange',value:[], label: '加班日期范围', required:true,pickerOptions:options},
        },
        editFields:{
          name:{type: 'select', value:'',label: '加班人', required:true,editDisabled:true,
            options:[],keyValue:{label:'name',value:'name'}},
          date:{type: 'dates', label: '加班日期', required:true,editDisabled:true},
          // overtimeType:{type: 'select',value:'dinner', label: '加班类型', required:true,
          //   options:[{label:'晚饭',value:'dinner'},{label:'周末午饭',value:'lunch'}]},
          payType:{type: 'select',value:'self', label: '支付类型', required:true,
            options:[{label:'自费',value:'self'},{label:'他付',value:'other'}]},
          payForMe:{type: 'select', label: '谁付的',
            options:[],keyValue:{label:'name',value:'name'}},
          payMoney:{type: 'number', label: '金额'},
          remark:{type: 'input', label: '备注'},
        },
      }
    },
    computed: {
    },
    watch:{
      '$store.state.userList':{
        handler:function (val) {
          let userList=val || [];
          this.fields.name.options=userList;
          this.editFields.name.options=userList;
          this.editFields.payForMe.options=userList;
        },
        immediate:true
      },
      '$store.state.curUser':{
        handler:function (val) {
          this.fields.name.value=val;
          this.editFields.name.value=val;
          this.condition.name=val;
          this.$nextTick(()=>{
            this.getThreeMonth();
            this.init();
          });
        },
        immediate:true
      }
    },
    created() {
    },
    methods: {
      //获取近三个月日期范围
      getThreeMonth(){
        let now = new Date().getTime()+24*60*60*1000;
        let start=now-3*31*24*60*60*1000;
        let dateRange=[new Date(start).format('yyyy-MM-dd'),new Date(now).format('yyyy-MM-dd')];
        this.fields.dateRange.value=dateRange;
        this.condition.dateBegin=dateRange[0];
        this.condition.dateEnd=dateRange[1];
      },
      init(){
        this.tableLoading=true;
        getOvertimeList({...this.searchParam,...this.condition}).then(res => {
          this.constants = res.data;
          this.totalPage=Math.ceil(res.total/this.searchParam.pageSize);
          this.tableLoading=false;
        }).catch(err=>{this.tableLoading=false;})
      },
      //查询
      search(val){
        this.condition={...val};
        this.condition.dateBegin=val.dateRange?val.dateRange[0]:null;
        this.condition.dateEnd=val.dateRange?val.dateRange[1]:null;
        this.searchParam.page=1;
        this.totalPage=0;
        this.init()
      },
      //翻页
      nextPage(jumpPage){
        this.searchParam.page=jumpPage.page;
        this.init();
      },
      //打开新增、修改弹框
      edit(item){
        this.editData=item;
        this.showEditForm=true;
      },
      //删除
      del(item){
        this.$confirm('确定删除吗？','提示').then(()=>{
          delOvertime({_id:item._id}).then(res => {
            this.init();
            this.$message({type:'success',message:'删除成功！'})
          }).catch(err =>{});
        }).catch(()=>{})
      },
      //保存
      save(val){
        let params={...val};
        if(params.payType==='self'){
          params.payMoney=35;
          params.payForMe=null;
        }else if(!params.payForMe){
          this.$message({type:'warning',message:'请填写谁付的！'});
          return
        }else if(!params.payMoney){
          this.$message({type:'warning',message:'请填写金额！'});
          return
        }
        let api=addOvertime;
        let Msg='新增成功！';
        if(this.editData._id){
          api= editOvertime;
          Msg='修改成功！';
        }else {
          params.date=JSON.stringify(params.date);
        }
        // return
        api(params).then(res => {
          this.init();
          this.showEditForm=false;
          this.$message({type:'success',message:Msg})
        }).catch(err =>{
          let errDates='';
          err.data.forEach(item=>{
            errDates+=new Date(item).format('yyyy-MM-dd');
            errDates+=','
          });
          this.$message({type:'warning',message:`该加班人${errDates}已存在加班记录！`})
        });
      },
    }
  }

</script>

<style scoped>

</style>
