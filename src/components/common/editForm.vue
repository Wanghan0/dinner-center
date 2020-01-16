<!--created by wanghan-->
<template>
  <div class="area-form">
    <el-form ref="form" :inline="true" :rules="rules" :model="formDataNew" class="demo-form-inline"
             :label-width="labelWidth">
      <el-form-item :label="item.label" v-for="(item,key,index) in fields" :key="index" :prop="key"
                    :required="item.required">
        <el-input
          v-if="item.type === 'input'"
          v-model.trim="formDataNew[key]"
          :disabled="itemDisabled(item)"
          clearable size="small"
          :placeholder="item.place">
        </el-input>
        <el-input
          v-if="item.type === 'password'"
          v-model.trim="formDataNew[key]"
          :disabled="itemDisabled(item)"
          clearable show-password size="small"
          :placeholder="item.place">
        </el-input>
        <el-input
          v-if="item.type === 'textarea'"
          type="textarea"
          v-model.trim="formDataNew[key]"
          :disabled="itemDisabled(item)"
          :rows="item.rows"
          :autosize="item.autosize"
          clearable size="small"
          :placeholder="item.place">
        </el-input>

        <el-select
          v-else-if="item.type === 'select' && item.keyValue"
          :disabled="itemDisabled(item)"
          v-model="formDataNew[key]"
          :multiple="item.multiple===true"
          :filterable="item.filterable===null"
          clearable size="small"
          :placeholder="item.place">
          <el-option
            v-for="(one,index) in item.options"
            :key="one[item.keyValue.key || item.keyValue.value]"
            :label="one[item.keyValue.label]"
            :value="one[item.keyValue.value]">
          </el-option>
        </el-select>
        <el-select
          v-else-if="item.type === 'select' && !item.keyValue"
          :disabled="itemDisabled(item)"
          v-model="formDataNew[key]"
          clearable filterable size="small"
          :placeholder="item.place">
          <el-option
            v-for="(one,index) in item.options"
            :key="one.label?one.value:one"
            :label="one.label || one"
            :value="one.label?one.value:one">
          </el-option>
        </el-select>
        <el-radio-group
          v-else-if="item.type === 'radio'"
          :disabled="itemDisabled(item)"
          v-model="formDataNew[key]"
          :style="{width: item.width}">
          <el-radio
            v-for="(one,index) in item.options"
            :key="one.label?one.value:one"
            :label="one.label?one.value:one">
            {{one.label || one}}
          </el-radio>
        </el-radio-group>
        <el-input-number
          v-else-if="item.type==='number'"
          v-model="formDataNew[key]"
          :disabled="itemDisabled(item)"
          controls-position="right"
          :min="item.min" :max="item.max" :step="item.step" :precision="item.precision"
          size="small"
        ></el-input-number>
        <el-date-picker
          v-else-if="item.type === 'datetime'"
          v-model="formDataNew[key]"
          :disabled="itemDisabled(item)"
          size="small" type="datetime" :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'" placeholder="选择时间范围">
        </el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="formDataNew[key]"
          :disabled="itemDisabled(item)"
          size="small" type="date" :value-format="item.valueFormat || 'yyyy-MM-dd'" placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'dates'"
          v-model="formDataNew[key]"
          :disabled="itemDisabled(item)"
          size="small" type="dates" :value-format="item.valueFormat || 'yyyy-MM-dd'" placeholder="选择日期">
        </el-date-picker>
        <el-checkbox v-else-if="item.type === 'checkbox'" v-model="formDataNew[key]"></el-checkbox>
      </el-form-item>
      <slot name="el-form-item" :item="formDataNew"></slot>
    </el-form>
    <div class="footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="$emit('close')">取消</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: '',
    components: {},
    props:[
      'fields', //表单字段
      'rules', //字段校验
      'labelWidth', //表单label的宽度
      'editData', //表单对象
      'keyField', //唯一主键
      'watchTimely', //是否实时监听表单字段的值
    ],
    data() {
      return {
        formDataNew: {}
      }
    },
    computed: {},
    watch: {
      formDataNew: {
        handler: function (val) {
          if (this.watchTimely) {
            this.$emit('update', val)
          }
        },
        deep: true
      }
    },
    created() {
      this.init();
    },
    methods: {
      //是否禁填
      itemDisabled(item) {
        if (item.disabled) {
          return true;
        } else if (this.editData._id && item.editDisabled) { //修改时禁填
          return true
        } else {
          return false;
        }
      },
      //field对象转化为表单所需
      init() {
        if (this.editData._id || this.editData._id === 0) {
          this.formDataNew = {...this.editData}
        } else {
          Object.keys(this.fields).forEach(key => {
            if (this.editData[key] === 0 || this.fields[key].value === 0) {//兼容0
              this.formDataNew[key] = 0;
            }
            if (this.fields[key].value === undefined && this.fields[key].type === 'number') {//el-input-number会将null显示为0，undefined才显示空
              this.formDataNew[key] = undefined;
            } else {//新增,要求新增时editData置空
              this.formDataNew[key] = this.fields[key].value || null;
            }
          });
        }
        this.formDataNew = {...this.formDataNew};  //用来更新视图，否则表单验证效果不刷新
      },
      save() {
        this.$refs.form.validate().then(() => {
          this.$emit('save', this.formDataNew)
        }).catch(() => {
        })
      },
    }
  }

</script>

<style scoped>
  .area-form {
    margin: 10px 0;
  }

  .el-select, .el-input, .el-radio-group, .el-input-number--small {
    width: 220px;
  }

  .footer {
    text-align: center;
  }
</style>
