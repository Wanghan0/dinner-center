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
        <button v-show="true" type="button" class="btn btn-intab" @click="del(item)">删除</button>
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
  import {addPay, delPay, editPay, getPayList} from "../../api";
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
        showEditForm:false,
        editData:{},
        searchParam:{
          page:1,
          pageSize:15
        },
        totalPage:0,
        constants:[],
        titles:[
          {name:'付款人',value:'payer'},
          {name:'加班人',value:'eater'},
          {name:'金额',value:'payMoney'},
          {name:'日期',value:'payDay',timeFormat:'yyyy-MM-dd'},
          {name:'备注',value:'remark'},
          // {name:'有效期开始时间',value:'validFrom',timeFormat:'yyyy-MM-dd hh:mm:ss'},
          // {name:'有效期截止时间',value:'validTo',timeFormat:'yyyy-MM-dd hh:mm:ss'},

        ],
        fields:{
          payer:{type: 'select', label: '付款人',options:[],keyValue:{label:'name',value:'name'}},
          payDay:{type: 'date', label: '付款日期'},
          dateRange:{type: 'daterange', label: '付款日期范围', required:true},
        },
        editFields:{
          payer:{type: 'select', label: '付款人', required:true,
            options:[],keyValue:{label:'name',value:'name'}},
          eater:{type: 'select', label: '加班人',value:[],multiple:true,filterable:false, required:true,
            options:[],keyValue:{label:'name',value:'name'}},
          payMoney:{type: 'number', label: '金额', required:true},
          payDay:{type: 'date', label: '日期', required:true,editDisabled: true},
          remark:{type: 'input', label: '备注'},
        },
      }
    },
    computed: {
    },
    watch:{
    },
    created() {
      this.init();
      let userList=this.$store.state.userList || [];
      this.editFields.payer.options=userList;
      this.editFields.eater.options=userList;
      this.fields.payer.options=userList;
    },
    methods: {
      init(){
        this.tableLoading=true;
        getPayList({...this.searchParam,...this.condition}).then(res => {
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
          delPay({_id:item._id}).then(res => {
            this.init();
            this.$message({type:'success',message:'删除成功！'})
          }).catch(err =>{});
        }).catch(()=>{})
      },
      //保存
      save(val){
        let params={...val};
        if(params.eater.indexOf(params.payer)===-1){
          params.eater.push(params.payer);
        }
        let api=addPay;
        let Msg='新增成功！';
        if(this.editData._id){
          api= editPay;
          Msg='修改成功！';
        }
        api(params).then(res => {
          this.init();
          this.showEditForm=false;
          this.$message({type:'success',message:Msg})
        }).catch(err =>{});
      },
    }
  }

</script>

<style scoped>

</style>
