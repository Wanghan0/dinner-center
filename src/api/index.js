import http from './public'

/*----------------示例-----------------*/

// 项目列表查询
export const getList = (that,params) => {
  return http.fetchGet('demo/testList',that,params)
};
// 新增
export const add = (that,params) => {
  return http.fetchPost('demo/testAdd',that,params)
};
// 编辑
export const edit = (that,params) => {
  return http.fetchPost('demo/testEdit',that,params)
};
// 删除
export const del = (that,params) => {
  return http.fetchPost('demo/del',that,params)
};
// 项目列表查询
export const getList2 = (that,params) => {
  return http.fetchGet('example2/testList2',that,params)
};
// 新增
export const add2 = (that,params) => {
  return http.fetchPost('example2/testAdd2',that,params)
};
// 编辑
export const edit2 = (that,params) => {
  return http.fetchPost('example2/testEdit2',that,params)
};
// 删除
export const del2 = (that,params) => {
  return http.fetchPost('example2/del2',that,params)
};

/*----------------用户管理-----------------*/

// 登录
export const login = (params) => {
  return http.fetchGet('users/login',params)
};
// 用户列表查询
export const getUserList = (params) => {
  return http.fetchGet('users/list',params)
};
// 新增用户
export const addUser = (params) => {
  return http.fetchPost('users/add',params)
};
// 编辑用户
export const editUser = (params) => {
  return http.fetchPost('users/edit',params)
};
// 删除用户
export const delUser = (params) => {
  return http.fetchPost('users/del',params)
};


/*----------------加班记录-----------------*/

// 列表查询
export const getOvertimeList = (params) => {
  return http.fetchGet('overtime/list',params)
};
// 新增
export const addOvertime = (params) => {
  return http.fetchPost('overtime/add',params,true)
};
// 编辑
export const editOvertime = (params) => {
  return http.fetchPost('overtime/edit',params)
};
// 删除
export const delOvertime = (params) => {
  return http.fetchPost('overtime/del',params)
};

/*----------------付账记录-----------------*/

// 列表查询
export const getPayList = (params) => {
  return http.fetchGet('pay/list',params)
};
// 新增
export const addPay = (params) => {
  return http.fetchPost('pay/add',params)
};
// 编辑
export const editPay = (params) => {
  return http.fetchPost('pay/edit',params)
};
// 删除
export const delPay = (params) => {
  return http.fetchPost('pay/del',params)
};

/*----------------统计记录-----------------*/

// 列表查询
export const getCountList = (params) => {
  return http.fetchGet('count/list',params)
};
// 新增
export const addCount = (params) => {
  return http.fetchPost('count/add',params)
};
// 编辑
export const editCount = (params) => {
  return http.fetchPost('count/edit',params)
};
