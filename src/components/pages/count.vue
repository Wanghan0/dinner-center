<!--created by wanghan-->
<template>
  <div>
    <p class="title">
      统计
      <el-button :disabled="constants.length===0" type="primary" size="mini" @click="count">统计</el-button>
    </p>
    <searchForm :fields="fields" @search="search"></searchForm>
    <contentTable
      v-loading="tableLoading" element-loading-background="rgba(0, 0, 0, 0.6)"
      ref="table"
      :titles="titles"
      :constants="constants"
      :totalPage="0"
      :noOperat="true">
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
    <el-dialog :visible.sync="showCount" title="统计结果" width="470px" :close-on-click-modal="false">
      <table class="table">
        <tr>
          <th>加班人</th>
          <th>总额</th>
          <th>零食基金</th>
          <th>余额</th>
        </tr>
        <tr v-for="(item,index) in countResult">
          <td>{{item.name}}</td>
          <td>{{transNumShow(item.selfCount)}}</td>
          <td>{{transNumShow(item.snacksFund)}}</td>
          <td>{{transNumShow(item.rest)}}</td>
        </tr>
        <tr>
          <th>合计</th>
          <td>{{transNumShow(summation.selfCount)}}</td>
          <td>{{transNumShow(summation.snacksFund)}}</td>
          <td>{{transNumShow(summation.rest)}}</td>
        </tr>
      </table>
      <div class="btn_footer">
        <el-input v-model="remark" placeholder="交发票前写点啥备注吗" style="margin-bottom: 10px;"></el-input>
        <el-button type="primary" size="mini" @click="apply">发票交啦</el-button>
      </div>
      <!--<el-card v-for="(item,key,index) in countResult" class="box-card" >-->
      <!--加班人：{{key}}-->
      <!--总额：{{item.selfCount}}-->
      <!--零食基金：{{item.selfCount>35?35:0}}-->
      <!--</el-card>-->
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import contentTable from '../common/contentTable'
  import {addCount, addOvertime, delOvertime, editOvertime, getOvertimeList} from "../../api";
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
        remark:'',
        showCount:false,
        showEditForm:false,
        countResult:{snacksFund:0,selfCount:0,rest:0},
        summation:{},
        editData:{},
        constants:[],
        titles:[
          {name:'加班人',value:'name'},
          {name:'加班日期',value:'date',timeFormat:'yyyy-MM-dd'},
          {name:'支付金额',value:'payMoney'},
          {name:'支付类型',value:'payType',options:[{label:'自费',value:'self'},{label:'他付',value:'other'}]},
          {name:'谁付的',value:'payForMe'},
          {name:'状态',value:'status',options:[{label:'新建',value:'created'},{label:'已交发票',value:'counted'},{label:'已报销',value:'applied'}]},
          {name:'备注',value:'remark'},

        ],
        fields:{
          name:{type: 'select', label: '加班人', required:true,
            options:[],keyValue:{label:'name',value:'name'}},
          date:{type: 'daterange', label: '加班日期范围', required:true},
        },
        editFields:{
          name:{type: 'select', label: '加班人', required:true,
            options:[],keyValue:{label:'name',value:'name'}},
          date:{type: 'date', label: '加班日期', required:true},
          overtimeType:{type: 'select',value:'dinner', label: '加班类型', required:true,
            options:[{label:'晚饭',value:'dinner'},{label:'周末午饭',value:'lunch'}]},
          payType:{type: 'select',value:'self', label: '支付类型', required:true,
            options:[{label:'自费',value:'self'},{label:'他付',value:'other'}]},
          payForMe:{type: 'select', label: '谁付的',
            options:[],keyValue:{label:'name',value:'name'}},
          remark:{type: 'input', label: '备注'},
        },
        countDateBegin:'',
        countDateEnd:'',
      }
    },
    computed: {
      overtimeList(){
        let arr=this.constants.map((item)=>{
          return item._id;
        });
        return arr;
      }
    },
    watch:{
    },
    created() {
      this.init();
      this.fields.name.options=this.$store.state.userList || [];
      this.editFields.name.options=this.$store.state.userList || [];
      this.editFields.payForMe.options=this.$store.state.userList || [];
    },
    methods: {
      //应用统计，新增一条统计日志
      apply(){
        this.$confirm('确定发票交了咩？','提示').then(()=>{
          let params={
            countDateBegin:this.constants[0].date,
            overtimeList:this.overtimeList,
            countDateEnd:this.constants[this.constants.length-1].date,
            status:'counted',
            countResult:this.countResult,
            summation:this.summation,
            remark:this.remark
          };
          addCount(params).then(res => {
            this.showCount=false;
            this.constants.length=0;
            this.remark='';
            this.$message({type:'success',message:'应用成功！'})
          }).catch(err =>{});
        }).catch(()=>{})
      },
      //统计
      count(){
        let userList=this.$store.state.userList || [];
        let countResult={};
        this.countResult=[];
        userList.forEach(item=>{
          countResult[item.name]={
            selfCount:0,
            type:item.type
          };
        });
        this.constants.forEach(item=>{
          if(item.payType==='self'){
            countResult[item.name].selfCount+=35;
          }else {
            countResult[item.payForMe].selfCount+=item.payMoney;
            countResult[item.name].selfCount+=(35-item.payMoney);
          }
        });
        this.summation={snacksFund:0,selfCount:0,rest:0};
        for(let i in countResult){
          if(countResult[i].selfCount<0){
            countResult[i].snacksFund=0;
            countResult[i].rest=countResult[i].selfCount;
          }else if(countResult[i].selfCount===0){
            countResult[i].snacksFund=0;
            countResult[i].rest=0;
          }else if(countResult[i].selfCount>0 && countResult[i].selfCount<=35){
            countResult[i].snacksFund=countResult[i].selfCount;
            countResult[i].rest=0;
          }else if(countResult[i].selfCount>35){
            countResult[i].snacksFund=35;
            countResult[i].rest=countResult[i].selfCount-35;
          }
          this.countResult.push({
            name:i,
            selfCount:countResult[i].selfCount,
            snacksFund:countResult[i].snacksFund,
            rest:countResult[i].rest,
            type:countResult[i].type,
          });
          this.summation.snacksFund+=countResult[i].snacksFund;
          this.summation.selfCount+=countResult[i].selfCount;
          this.summation.rest+=countResult[i].rest;
        }
        this.showCount=true;
      },
      //获取所有未统计未应用的加班记录
      init(){
        this.tableLoading=true;
        getOvertimeList({...this.condition,status:'created'}).then(res => {
          this.constants = res.data;
          this.constants.sort((a,b)=>{
            return new Date(a.date).getTime()-new Date(b.date).getTime()
          });
          this.tableLoading=false;
        }).catch(err=>{this.tableLoading=false;})
      },
      //查询
      search(val){
        this.condition={...val};
        this.condition.dateBegin=val.date?val.date[0]:null;
        this.condition.dateEnd=val.date?val.date[1]:null;
        this.init()
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
        let api=addOvertime;
        let Msg='新增成功！';
        if(this.editData._id){
          api= editOvertime;
          Msg='修改成功！';
        }
        api(params).then(res => {
          this.init();
          this.showEditForm=false;
          this.$message({type:'success',message:Msg})
        }).catch(err =>{});
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
.btn_footer{
  margin-top: 26px;
  text-align: center;
}
</style>
