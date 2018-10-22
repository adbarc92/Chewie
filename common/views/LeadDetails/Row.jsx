import React from 'react';
import PropTypes from 'prop-types';

const Row = ({ message, send, aId }) => (
    <tr>
    <td>
      {message.in && 'Inbound'}
      {message.rv && 'Reviewed'}
    </td>
    <td>
      {message.fr}
    </td>
    <td>
      {message.to}
    </td>
    <td>
      {message.tx}
    </td>
  </tr>
);

Row.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object,
  ]),
  send: PropTypes.func
};

export default Row;
