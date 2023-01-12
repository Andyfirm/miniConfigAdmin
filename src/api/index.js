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
export const employeeGetUser = (data) => ajax('/employee/getUser', data) // 查询场馆登录用户信息
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

// 数据源相关
export const getDataSource = (data) => ajax('/dataSource/getDataSource', data) // 查询数据源列表
export const addDataSource = (data) => ajax('/dataSource/addDataSource', data, 'post') // 新增数据源
export const updateDataSource = (data) => ajax('/dataSource/updateDataSource', data, 'post') // 修改数据源
// 支付设置
export const getPayConfig = (data) => ajax('/pay/getPayConfig', data) // 查询支付设置
export const insertWxPayConfig = (data) => ajax('/pay/insertWxPayConfig', data, 'post') // 新增微信支付配置
export const updateWxPayConfig = (data) => ajax('/pay/updateWxPayConfig', data, 'post') // 修改微信支付配置
export const insertZFBPayConfig = (data) => ajax('/pay/insertZFBPayConfig', data, 'post') // 新增支付宝支付配置
export const updateZFBPayConfig = (data) => ajax('/pay/updateZFBPayConfig', data, 'post') // 修改支付宝支付配置
export const getSourceShops = (data) => ajax('/venue/getSourceShops', data) // 查询数据源场馆信息
export const getMerchant = (data) => ajax('/meituanBills/getMerchant', data) // 查询美团商户配置
export const addMerchant = (data) => ajax('/meituanBills/addMerchant', data, 'post') // 新增美团商户配置
export const modifyMerchant = (data) => ajax('/meituanBills/modifyMerchant', data, 'post') // 修改删除美团商户配置
export const serachChooseMenu = (data) => ajax('/configFunction/serachChooseMenu', data) // 查询已选择导航栏配置
export const serachMenu = (data) => ajax('/configFunction/serachMenu', data) // 查询菜单配置列表
export const getConfigInfo = (data) => ajax('/configFunction/getConfigInfo', data)
export const addConfigInfo = (data) => ajax('/configFunction/addConfigInfo', data, 'post') // 勾选前台功能权限
export const getFunctionNodeInfo = (data) => ajax('/configFunction/getFunctionNodeInfo', data) // 查询已配置信息
export const insertMenue = (data) => ajax('/employee/insertMenue', data, 'post') // 勾选员工功能权限
export const getEmployeeCanConfigInfo = (data) => ajax('/configFunction/getEmployeeCanConfigInfo', data) // 查询员工所有配置功能
export const insertEmployeeConfigInfo = (data) => ajax('/configFunction/insertEmployeeConfigInfo', data, 'post') // 新增员工配置功能
export const insertFunctionNode = (data) => ajax('/configFunction/insertFunctionNode', data, 'post') // 新增功能节点
export const insertEFunctionNode = (data) => ajax('/configFunction/insertEFunctionNode', data, 'post') // 新增员工功能节点
export const getTbPushMessageModel = (data) => ajax('/message/getTbPushMessageModel', data) // 查询消息配置模板列表
export const getPushType = (data) => ajax('/message/getPushType', data) // 查询模板消息类型
export const insertTbPushMessageModel = (data) => ajax('/message/insertTbPushMessageModel', data, 'post') // 新增配置模板
export const deleteTbPushMessageModel = (data) => ajax('/message/deleteTbPushMessageModel', data, 'post') // 删除消息配置模板
export const updateTbPushMessageModel = (data) => ajax('/message/updateTbPushMessageModel', data, 'post') // 修改消息配置模板
export const getTbEPushMessageModel = (data) => ajax('/message/getTbEPushMessageModel', data) // 查询员工模板消息类型
export const insertTbEPushMessageModel = (data) => ajax('/message/insertTbEPushMessageModel', data, 'post') // 新增员工配置模板
export const deleteTbEPushMessageModel = (data) => ajax('/message/deleteTbEPushMessageModel', data, 'post') // 删除员工消息配置模板
export const updateTbEPushMessageModel = (data) => ajax('/message/updateTbEPushMessageModel', data, 'post') // 修改员工消息配置模板
export const getTbEPushType = (data) => ajax('/message/getTbEPushType', data) // 查询员工推送类型
export const getUser = (data) => ajax('/user/getUser', data) // 查询用户角色
export const registUser = (data) => ajax('/user/registUser', data, 'post') // 添加用户角色
export const getClubMemberCodes = (data) => ajax('/user/getClubMemberCodes', data) // 查询数据源来源列表
export const deleteUser = (data) => ajax('/user/deleteUser', data, 'post') // 删除用户角色
export const getRole = (data) => ajax('/user/getRole', data) // 查询用户角色
export const selectSmsMessage = (data) => ajax('/configFunction/selectSmsMessage', data) // 查询短信配置
export const updateSmsMessage = (data) => ajax('/configFunction/updateSmsMessage', data, 'post') // 修改短信配置
export const insertSmsMessage = (data) => ajax('/configFunction/insertSmsMessage', data, 'post') // 新增短信配置
export const deleteSmsMessage = (data) => ajax('/configFunction/deleteSmsMessage', data, 'post') // 删除短信配置
// 菜单配置模块
export const insertMenu = (data) => ajax('/configFunction/insertMenu', data, 'post') // 新增菜单配置
export const updateMenu = (data) => ajax('/configFunction/updateMenu', data, 'post') // 修改菜单配置
export const deleteMenu = (data) => ajax('/configFunction/deleteMenu', data, 'post') // 删除菜单配置
