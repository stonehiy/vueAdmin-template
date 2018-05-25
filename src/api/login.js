import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/uaa/sysLogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/uaa/current',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}


