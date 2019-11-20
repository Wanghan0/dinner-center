<template>
  <div>
    <p class="title">example1
      <button type="button" class="btn btn-add" @click="openAdd">新增</button>
    </p><br>
    <div class="search">
      <ul>
        <li>
          <label>姓名：</label>
          <el-input v-model.trim="condition.name" clearable></el-input>
        </li>
        <li>
          <label>年龄：</label>
          <el-input v-model.trim="condition.age" clearable></el-input>
        </li>
        <li>
          <label>性别：</label>
          <el-select v-model="condition.sex">
            <el-option value="" label="全部"></el-option>
            <el-option value="男" label="男"></el-option>
            <el-option value="女" label="女"></el-option>
          </el-select>
        </li>

        <li>
          <button type="button" class="btn btn-add" @click="search">查询</button>
        </li>
      </ul>
    </div>
    <div class="table_wrap table-detail">
      <table class="table">
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>性别</th>
          <th>年龄</th>
          <th>爱好</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item,index) in dataList" :key="index">
          <td>{{item._id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.sex}}</td>
          <td>{{item.age}}</td>
          <td>{{item.like}}</td>
          <td>
            <button type="button" class="btn btn-intab" @click="openEdit(item)">编辑</button>
            <button type="button" class="btn btn-intab" @click="del(item)">删除</button>
          </td>
        </tr>
        <tr v-show="dataList.length==0">
          <td class="italic" colspan="7">暂无内容...</td>
        </tr>
      </table>
      <page v-if="totalPage>1" :total-page="totalPage" :init-page="searchParam.page" v-on:goPage="nextPage"></page>
      <loading v-show="isLoading"></loading>
    </div>
    <div class="pup" v-if="addEdit">
      <div class="popup">
        <p class="title-pop title">{{operateType =='add'?'新增':'更新'}}<a href="javascript:;" class="icon-close" @click="addEdit=false;"></a></p>
        <div class="create-dio">
          <el-form :inline="true" :model="editDataP" :rules="rules" label-width="220px" ref="editDataP" class="demo-form-inline">
            <el-form-item label="名称" prop="name">
              <el-input v-model.trim="editDataP.name"></el-input>
              <span>{{editDataP.test}}</span>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-input v-model.trim="editDataP.sex"></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model.trim="editDataP.age"></el-input>
            </el-form-item>
            <el-form-item label="爱好" prop="like">
              <el-input v-model.trim="editDataP.like"></el-input>
            </el-form-item>
          </el-form>
          <p class="pop_btn">
            <button type="button" class="btn btn-add" @click="save('editDataP')">确定</button>
            <button type="button" class="btn btn-delete" @click="addEdit=false;">取消</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { confirm } from '../../../api/public.js'
  import {add,edit,del,getList} from '../../../api/index.js'
  import loading from '../../common/loading.vue'
  import page from '../../common/page.vue'
  export default {
    name: '',
    components: {
      loading,
      page
    },
    data() {
      return {
        condition:{},
        searchParam: {
          page: 1,
          pageSize: 3 ,
        },
        searchParam_:{
          page: 1,
          pageSize: 3 ,
        },
        totalPage: 1,
        isLoading:false,
        dataList:[],
        editDataP: {
          name:'王晗',
          sex:'女',
          age:22,
          like:'黄景瑜',
        },
        rules: {},
        addEdit: false,
        operateId:null,
        operateType:'add'
      }
    },
    computed: {
      // editDataP: {
      //   test: function () {
      //     return this.editDataP.name + '99999999'
      //   }
      // }
    },
    watch:{
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        getList(this,this.searchParam_).then(res => {
          this.dataList = res.data;
          this.totalPage=Math.ceil(res.total/this.searchParam_.pageSize);
          this.$message({type: 'success', message: '查找成功'});
        }).catch(err=>{})
      },
      //翻页
      nextPage(jumpPage) {
        this.searchParam.page = jumpPage.page;
        this.searchParam_.page = jumpPage.page;
        this.init();
      },
      //查询
      search() {
        this.searchParam.page = 1;
        this.searchParam_= {...this.searchParam,...this.condition};
        this.init();
      },
      //打开新建弹框
      openAdd() {
        this.editDataP= {
          name:'王晗',
          sex:'女',
          age:22,
          like:'黄景瑜',
        };
        this.addEdit = true;
        this.operateType = 'add';
        this.operateId=null;
      },
      //打开编辑弹框
      openEdit(item) {
        this.addEdit = true;
        this.operateType = 'edit';
        this.operateId = item._id;
        this.editDataP = {...item};
      },
      //提交编辑新建内容
      save(val) {
        this.$refs[val].validate((valid) => {
          if (valid) {
            let params = this.editDataP;
            params._id=this.operateId;
            let str = '';
            if (this.operateType === 'add') {
              add(this,params).then(res => {
                this.init();
                this.addEdit = false;
                this.$message({type: 'success', message: '添加成功'});
              }).catch(err=>{})
            } else if (this.operateType === 'edit') {
              edit(this,params).then(res => {
                this.init();
                this.addEdit = false;
                this.$message({type: 'success', message: '修改成功'});
              }).catch(err=>{})
            }

          } else {
            return false;
          }
        });
      },
      //删除
      del(item) {
        let that = this;
        confirm(that, '确定删除吗？', function () {
          del(that,{_id:item._id}).then(res => {
            that.init();
            that .$message({type: 'success', message: '删除成功'});
          }).catch(err=>{})
        })
      },
    },
    filters:{

    }
  }

</script>

<style scoped>
  .main{
    width: 500px;
    height: 500px;
    border: 1px solid #55a532;
    margin: 50px 20px 20px 220px;
    text-align: center;
  }
  .el-input,.el-select{
    width: 220px;
  }
</style>
