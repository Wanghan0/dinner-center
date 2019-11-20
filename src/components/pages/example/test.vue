<template>
  <div>
    <p class="title">王晗测试</p>
    <el-input v-model.trim="test" ></el-input>
    <el-input v-model.trim="test_1" ></el-input>
    <p>{{whtest}}</p>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: '',
    components: {
    },
    data() {
      return {
        test:'王晗测试',
        test_1:'hajhjah'
      }
    },
    computed: {
      whtest(){
        return this.test+'whwhwhwhwh'+this.test_1
      }
    },
    watch:{
      test(val){
        console.log(123)
      },
      test_1(val){
        console.log(456)
      }
    },
    created() {
    },
    methods: {
    }
  }

</script>

<style scoped>

</style>
