import {
  baseUrl
} from './env'
import axios from 'axios'
import {Message} from 'element-ui'
axios.defaults.timeout = 10000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
//timeout后每2秒重新尝试发送请求2次
axios.defaults.retry = 2;
axios.defaults.retryDelay = 2000;

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.code == '4000009') {    //接入登录后，若接口返回code为4000009，则页面跳转到返回的message地址上进行登录
    window.location = response.data.message;
  }
  return response;

}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default {
  fetchGet(url, params = {},noMsg) {
    url = baseUrl + url;
    return new Promise((resolve, reject) => {
      axios.get(url, {params}).then(res => {
        if (res.data.code == '200') {
          resolve(res.data)
        } else {
          Message({message: res.data.message, type: 'warning'});
          reject(res.data);
        }
      }).catch(error => {
        console.log(url, error);
        Message({message: '网络错误！请稍后再试', type: 'warning'});
        reject(error)
      })
    })
  },
  fetchPost(url, params = {}, noMessage) {
    url = baseUrl + url;
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(res => {
        if (res.data.code == '200') {
          resolve(res.data)
        } else {
          if (!noMessage) {
            Message({message: res.data.message, type: 'warning'});
          }
          reject(res.data);
        }
      }).catch(error => {
        console.log(url, error);
        Message({message: '网络错误！请稍后再试', type: 'warning'});
        reject(error)
      })
    })
  },
  fetchPost2(url, that, params = {}) {
    url = baseUrl + url;
    return new Promise((resolve, reject) => {
      axios.post(url, params, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
        if (res.data.code == '200') {
          resolve(res.data)
        } else {
          that.$message({message: res.data.message, type: 'warning'});
          reject(res.data);
        }
      }).catch(error => {
        console.log(url, error);
        that.$message({message: '网络错误！请稍后再试', type: 'warning'});
        reject(error)
      })
    })
  },
  fetchDelete(url, that) {
    url = baseUrl + url;
    return new Promise((resolve, reject) => {
      axios.delete(url, {}).then(res => {
        if (res.data.code == '200') {
          resolve(res.data)
        } else {
          that.$message({message: res.data.message, type: 'warning'});
          reject(res.data);
        }
      }).catch(error => {
        console.log(url, error);
        that.$message({message: '网络错误！请稍后再试', type: 'warning'});
        reject(error)
      })
    })
  },

  //使用api center上的mock时需要用到jQuery请求避免跨域报错
  /*  fetchPost (url, params = {}) {
      url=baseUrl+url;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: url,
          type: 'post',
          data: params,
          success: function(res){
            resolve(res);
          },
          error: function(error){
            reject(error)
          }
        });
      })
    },*/


};
//确认操作提示框
export const confirm=(that,text,surefuc)=>{
  that.$confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    surefuc();
  }).catch(() => {});
};
