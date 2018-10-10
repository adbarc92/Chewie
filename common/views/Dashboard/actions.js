import axios from 'axios';
var Promise = require("bluebird");

export const GET_USER_COUNT = 'GET_USER_COUNT';

export function getUserCount(token) {
  return {
    type: GET_USER_COUNT,
    payload: axios({
      method: 'get',
      url: '/api/users/count',
      headers: { Authorization: token }
    })
      .then(response => response.data.count)
      .catch((error) => {
        console.log(error)
      })
  };
}
