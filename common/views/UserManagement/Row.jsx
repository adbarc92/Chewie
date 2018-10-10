import React from 'react';
import PropTypes from 'prop-types';

const Row = ({ user, del }) => (
    <tr>
    <td>
      <span style={{ color: user.inClass ? '#8BC670' : '#FF566F', marginRight: '10px' }}><i className="fa fa-circle" /></span>
      {user.studentType === 'FULL' && <i style={{ marginRight: '10px' }} className="fa fa-sun" />}
      {user.studentType === 'PART' && <i style={{ marginRight: '10px' }} className="fa fa-moon" />}
      {user.fullName}
    </td>
    <td>
      {user.email}
      <span style={{ color: '#FF566F', float: 'right' }}>
        {!user.accountabilityPartnerEmailAddress && <i style={{ marginRight: '10px' }} className="fa fa-hands-helping" />}
        {!user.emailVerified && <i style={{ marginRight: '10px' }} className="fa fa-envelope" />}
        {!user.wakatimeApiKey && <i style={{ marginRight: '10px' }} className="fa fa-code" />}
      </span>
    </td>
    <td><a href={`/auth/account#/user/${user.id}`}>details</a><button className='btn btn-xs btn-danger' onClick={() => del(user.token, user.id)}>DELETE</button></td>
  </tr>
);

Row.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object,
  ]),
  del: PropTypes.func
};

export default Row;
