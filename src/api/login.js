import request from '@/utils/request'



/**
 * uaa/oauth/token
 */
export function token(username, password) {
  return request({
    url: '/uaa/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic YnJvd3Nlcjo=',
    },
    responseType: 'json',
    data: {
      username,
      password,
      scope: 'ui',
      grant_type: 'password'
    }
  })
}
export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}


