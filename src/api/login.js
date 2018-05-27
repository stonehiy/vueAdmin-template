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

export function getInfo() {
  return request({
    url: '/auth/current',
    method: 'get',
  })
}

export function logout(accessToken) {
  return request({
    url: '/auth/sysLogout',
    method: 'get',
    params: {
      'accessToken': accessToken,
    },
  })
}


