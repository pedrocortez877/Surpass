import axios from 'axios'

const AUTH_TOKEN = 'myToken'
const REMEMBER_PARAM = 'accesstoken'

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

api.interceptors.request.use(function (config) {
  const authToken = window.localStorage.getItem(AUTH_TOKEN);
  if (authToken) {
    config.headers[REMEMBER_PARAM] = authToken;
  }
  return config
}, function (error) {
  return Promise.reject(error)
});

api.interceptors.response.use(function (response) {
  const token = response.data.accesstoken;
  console.log(token);
  if (token) {
    window.localStorage.setItem('myToken', token)
  }

  return response
}, function (error) {
  return Promise.reject(error)
});

export default api;