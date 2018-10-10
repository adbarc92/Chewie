import axios from 'axios';
import _ from 'lodash';

export const DELETE_USER = 'DELETE_USER';
export const GET_ALL_USERS = 'GET_ALL_USERS';
export const FILTER_ALL_USERS = 'FILTER_ALL_USERS';

const formatData = filteredUsers =>
  filteredUsers.sort((a, b) => {
    const keyA = (_.get(a, 'fullName', 'Zz Zz').toUpperCase());
    const keyB = (_.get(b, 'fullName', 'Zz Zz').toUpperCase());
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

export function deleteUser(token, userId) {
  return {
    type: DELETE_USER,
    payload: axios({
      method: 'delete',
      url: `/api/users/${userId}`,
      headers: { Authorization: token }
    })
      .then(response => ({ user: userId, count: response.data }))
  };
}

export function getAllUsers(token) {
  return {
    type: GET_ALL_USERS,
    payload: axios({
      method: 'get',
      url: '/api/users',
      headers: { Authorization: token }
    })
      .then(response => ({ users: formatData(response.data) }))
  };
}

export function filterAllUsers(users, filterOptions) {
  const filteredUsers = users.filter((user) => {
    if (filterOptions.studentType === 'ALL') {
      return (
        (user.studentType === 'FULL' || user.studentType === 'PART')
        &&
        user.emailVerified === filterOptions.verified
        &&
        user.disabled === filterOptions.disabled
        &&
        user.enrolled === filterOptions.enrolled
      );
    }
    return (
      user.studentType === filterOptions.studentType
      &&
      user.emailVerified === filterOptions.verified
      &&
      user.disabled === filterOptions.disabled
      &&
      user.enrolled === filterOptions.enrolled
    );
  });
  return {
    type: FILTER_ALL_USERS,
    payload: ({ filteredUsers: formatData(filteredUsers) })
  };
}
