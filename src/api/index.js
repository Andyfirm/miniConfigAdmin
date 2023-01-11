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
export const getInfERole = (data) => ajax('/infe/getInfERole', data) // 查询员工角色信息
export const getEmployeeConfigInfo = (data) => ajax('/configFunction/getEmployeeConfigInfo', data) // 查询员工已配置信息
export const insertERole = (data) => ajax('/infe/insertERole', data, 'post') // 新增员工角色
export const updateInfERole = (data) => ajax('/infe/updateInfERole', data, 'post') // 修改员工角色信息
export const getInfEInfo = (data) => ajax('/infe/getInfEInfo', data) // 查询所有员工信息
export const getEJtInfo = (data) => ajax('/infe/getEJtInfo', data) // 查询教练信息
export const updateEUserRole = (data) => ajax('/infe/updateEUserRole', data, 'post') // 配置员工角色
export const updateEUserPassword = (data) => ajax('/infe/updateEUserPassword', data, 'post') // 修改员工密码
export const updateEJtInfo = (data) => ajax('/infe/updateEJtInfo', data, 'post', {contentType: 'multipart/form-data'}) // 编辑员工信息-教练
export const getEBreakTime = (data) => ajax('/infe/getEBreakTime', data) // 查询教练休息时间
export const insertEBreakTime = (data) => ajax('/infe/insertEBreakTime', data, 'post') // 新增教练休息时间
// 票模块
export const getTicketType = (data) => ajax('/ticket/getTicketType', data) // 查询购票类型列表
export const insertTicketType = (data) => ajax('/ticket/insertTicketType', data, 'post') // 新增票类型
export const updateTicketType = (data) => ajax('/ticket/updateTicketType', data, 'post') // 修改票类型
export const getOnlineTicketInfo = (data) => ajax('/ticket/getOnlineTicketInfo', data) // 查询票列表
export const getSaleTicketExplanation = (data) => ajax('/ticket/getSaleTicketExplanation', data) // 查询购票说明
export const updateSaleTicketExplanation = (data) => ajax('/ticket/updateSaleTicketExplanation', data, 'post') // 修改购票说明
export const getTbAppointConfig = (data) => ajax('/ticket/getTbAppointConfig', data, 'post') // 查询退款设置列表
export const insertTbAppointConfig = (data) => ajax('/ticket/insertTbAppointConfig', data, 'post') // 增加退款设置
export const updateTbAppointConfig = (data) => ajax('/ticket/updateTbAppointConfig', data, 'post') // 修改退款设置
export const deleteTbAppointConfig = (data) => ajax('/ticket/deleteTbAppointConfig', data, 'post') // 删除退款设置
export const getInfCs = (data) => ajax('/tuanke/getInfCs', data) // 查询线下卡种
export const getTbCardTicket = (data) => ajax('/ticket/getTbCardTicket', data) // 查询会员卡购票限制列表
export const insertTbCardTicket = (data) => ajax('/ticket/insertTbCardTicket', data, 'post') // 增加会员卡购票限制
export const updateTbCardTicket = (data) => ajax('/ticket/updateTbCardTicket', data, 'post') // 修改会员卡购票限制
export const deleteTbCardTicket = (data) => ajax('/ticket/deleteTbCardTicket', data, 'post') // 删除会员卡购票限制
