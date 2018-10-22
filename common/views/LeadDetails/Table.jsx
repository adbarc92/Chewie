import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

const Table = ({ messages }) => (
  <table className={'table'}>
    <thead>
      <tr>
        <th>Inbound</th>
        <th>From</th>
        <th>To</th>
        <th>Text</th>
      </tr>
    </thead>
    <tbody>
      {messages.map(message => <Row key={message.id} message={message} />)}
    </tbody>
  </table>
);

Table.propTypes = {
  leads: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ])
};

export default Table;
