import ajax from './ajax'

export const getRoleByUser = (data) => ajax('/user/getRoleByUser', data) // 查询用户角色
export const getMenue = (data) => ajax('/user/getMenue', data) // 查询已分配的角色权限
export const login = (data) => ajax('/land/login', data, 'post') // 账号登录
export const mobileLogin = (data) => ajax('/land/mobileLogin', data, 'post') // 手机号登录
export const getVCode = (data) => ajax('/land/getVCode', data) // 获取验证码
export const updatePassword = (data) => ajax('/employee/updatePassword', data, 'post') // 修改场馆登录角色密码
export const getCustomerInfo = (data) => ajax('/venue/getCustomerInfo', data) // 查询商家信息
export const getLoginImagefo = (data) => ajax('/venue/getLoginImagefo', data) // 查询登录图片信息
export const insertCustomerInfo = (data) => ajax('/venue/insertCustomerInfo', data, 'post', {contentType: 'multipart/form-data'}) // 新增商家信息
export const updateCustomerInfo = (data) => ajax('/venue/updateCustomerInfo', data, 'post', {contentType: 'multipart/form-data'}) // 修改商家信息
export const updateLoginImagefo = (data) => ajax('/venue/updateLoginImagefo', data, 'post', {contentType: 'multipart/form-data'}) // 上传启动图图片
export const getShops = (data) => ajax('/venue/getShops', data) // 查询场馆
export const updateShopsInfo = (data) => ajax('/venue/updateShopsInfo', data, 'post', {contentType: 'multipart/form-data'}) // 修改分店信息
export const insertDescriptionImage = (data) => ajax('/common/insertDescriptionImage', data, 'post', {contentType: 'multipart/form-data'}) // 新增说明图片
export const deleteDescriptionImage = (data) => ajax('/common/deleteDescriptionImage', data) // 删除说明图片
export const searchRole = (data) => ajax('/employee/searchRole', data) // 查询场馆用户角色信息
export const getMenueemployee = (data) => ajax('/employee/getMenue', data) // 查询后台所有权限
export const insertRole = (data) => ajax('/employee/insertRole', data, 'post') // 新增场馆用户角色
export const updateRole = (data) => ajax('/employee/updateRole', data, 'post') // 修改场馆用户角色
export const deleteRole = (data) => ajax('/employee/deleteRole', data, 'post') // 删除场馆用户角色
export const getUser = (data) => ajax('/employee/getUser', data) // 查询场馆登录用户信息
export const UsergetVCode = (data) => ajax('/user/getVCode', data) // 修改用户绑定手机号获取验证码
export const empldeleteUser = (data) => ajax('/employee/deleteUser', data, 'post') // 删除场馆用户
export const insertUser = (data) => ajax('/employee/insertUser', data, 'post') // 新增登录用户信息
export const updateUser = (data) => ajax('/user/updateUser', data, 'post') // 修改角色信息
export const updateUserMobile = (data) => ajax('/user/updateUserMobile', data, 'post') // 修改用户绑定手机号
export const updateUserRole = (data) => ajax('/employee/updateUserRole', data, 'post') // 修改用户角色
