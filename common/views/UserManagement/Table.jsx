import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

const Table = ({ users, del }) => (
  <table className={'table'}>
    <thead>
      <tr>
        <th>Full name</th>
        <th>Email</th>
        <th>View</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => <Row key={user.username} user={user} del={del} />)}
    </tbody>
  </table>
);

Table.propTypes = {
  users: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ])
};

export default Table;
