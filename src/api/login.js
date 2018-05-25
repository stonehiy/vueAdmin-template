import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/auth/sysLogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/current',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/auth/sysLogout',
    method: 'post'
  })
}


