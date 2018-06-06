import request from '@/utils/request'


//获取用户列表
export function getUserList(params) {
  return request({
    url: '/uc/user/lists',
    method: 'get',
    params
  })
}


//通过id获取用户
//http://127.0.0.1:11111/uc/user/get?id=127'
export function getUserById(id) {
  return request({
    url: '/uc/user/get',
    method: 'get',
    params: {
      id,
    },
  })
}

//新增用户
/*
 {
 "email": "string",
 "id": 0,
 "name": "string",
 "phoneNumber": "string",
 "type": "string",
 "username": "string"
 }
 */
export function addUser(sysUser) {
  return request({
    url: '/uc/user/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/application/json',
    },
    data: sysUser,


  })
}
//修改用户
export function updateUser(sysUser) {
  return request({
    url: '/uc/user/update',
    method: 'post',
    data: sysUser,
  })
}

//删除用户
//get /user/delete/{username}
export function deleteAuthClient(username) {
  return request({
    url: '/user/delete/' + username,
    method: 'get',
  })
}


