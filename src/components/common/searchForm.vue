<!--created by wanghan-->
<template>
  <div class="area-form" @keyup.enter="onSearch">
    <el-form ref="form" :inline="true" :model="formDataNew" class="demo-form-inline">
      <el-form-item :label="item.label" v-for="(item,key,index) in fields" :key="index" :prop="key">
        <el-input v-if="item.type === 'input'" v-model.trim="item.value" clearable size="small"
                  :placeholder="item.place"></el-input>
        <el-select
          v-else-if="item.type === 'select' && item.keyValue"
          v-model="item.value"
          clearable filterable size="small"
          :placeholder="item.place">
          <el-option
            v-for="(one,index) in item.options"
            v-if="one[item.keyValue.label] || one[item.keyValue.label]===0"
            :key="one[item.keyValue.key || item.keyValue.value]"
            :label="one[item.keyValue.label]"
            :value="one[item.keyValue.value]">
          </el-option>
        </el-select>
        <el-select
          v-else-if="item.type === 'select' && !item.keyValue"
          v-model="item.value"
          clearable filterable size="small"
          :placeholder="item.place">
          <el-option
            v-for="(one,index) in item.options"
            v-if="one.label || one || one.label===0 || one===0"
            :key="one.label?one.value:one"
            :label="one.label || one"
            :value="one.label?one.value:one">
          </el-option>
        </el-select>
        <el-input-number
          v-else-if="item.type==='number'"
          v-model="item.value"
          :min="item.min" :max="item.max" :step="item.step" :precision="item.precision"
          controls-position="right"
          size="small"
        ></el-input-number>
        <el-date-picker
          v-else-if="item.type === 'datetime'" v-model="item.value" size="small"
          type="datetime" :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'" placeholder="选择时间范围">
        </el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'date'" v-model="item.value" size="small"
          type="date" :value-format="item.valueFormat || 'yyyy-MM-dd'" placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'daterange'"
          v-model="item.value"
          :value-format="item.valueFormat || 'yyyy-MM-dd'"
          :picker-options="item.pickerOptions || null"
          type="daterange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'datetimerange'"
          v-model="item.value"
          :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
          :picker-options="item.pickerOptions || null"
          type="datetimerange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-checkbox v-else-if="item.type === 'checkbox'" v-model="item.value"></el-checkbox>
        <template v-else-if="item.type === 'customItem'">
          <slot name="customItem" :item="item" :field="key" :index="index" :formData="formDataNew"></slot>
        </template>
      </el-form-item>
      <slot name="el-form-item" :item="formDataNew"></slot>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSearch">搜索</el-button>
        <el-button size="small" @click="resetSearchForm">重置</el-button>
        <slot name="operateBtn" :formDataNew="formDataNew"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: '',
    components: {},
    props: [
      'fields',   //搜索字段
      'watchTimely'  //是否实时监听搜索字段的值
    ],
    data() {
      return {
        formDataNew: {}  //由于formDataNew初始没有声明具体属性，直接对其属性赋值会出现视图不更新的情况，务必使用vm.$set进行赋值
      }
    },
    computed: {},
    watch: {
      fields: {
        handler: function (val) {
          if (this.watchTimely) {
            this.init();
          }
        },
        deep: true
      },

    },
    created() {
      this.init();
    },
    methods: {
      //field对象转化为表单所需
      init() {
        Object.keys(this.fields).forEach(key => {
          if (this.fields[key].value === '' || this.fields[key].value === undefined) {
            this.$set(this.formDataNew, key, null)
          } else {
            this.$set(this.formDataNew, key, this.fields[key].value)
          }
        });
      },
      //搜索
      onSearch() {
        this.init();
        this.$emit('search', this.formDataNew)
      },
      //重置
      resetSearchForm() {
        Object.keys(this.fields).forEach(key => {
          if (this.fields[key].type === 'number') {//number组件会将null置0
            this.$set(this.fields[key], 'value', undefined)
          } else {
            this.$set(this.fields[key], 'value', null)
          }
        });
      },
    }
  }

</script>

<style scoped>
  .area-form {
    /*background: #e6e8eb;*/
    /*padding: 20px;*/
    padding-top: 20px;
    /*margin-bottom: 20px;*/
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-select, .el-input, .el-input-number--small {
    width: 220px;
  }
</style>
