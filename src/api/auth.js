import request from '@/utils/request'


//获取OAuth2客户端列表
export function getAuthClientList(params) {
  return request({
    url: '/auth/client/client/list',
    method: 'get',
    params
  })
}


//通过id获取OAuth2客户端
export function getAuthClientById(id) {
  return request({
    url: '/auth/client/client/get/' + id,
    method: 'get',
  })
}

//新增OAuth2客户端
export function addAuthClient(client) {
  return request({
    url: '/client/client/add',
    method: 'post',
    date: client,
  })
}
//修改OAuth2客户端
export function updateAuthClient(client) {
  return request({
    url: '/client/client/update',
    method: 'post',
    date: client,
  })
}

//删除OAuth2客户端
export function deleteAuthClient(id) {
  return request({
    url: '/client/client/delete/'+id,
    method: 'post',
  })
}


