import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

const Table = ({ leads, send, aId }) => (
  <table className={'table'}>
    <thead>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Phone</th>
        <th>HubSpot</th>
        <th>Count</th>
        <th>Review</th>
        <th>Email</th>
        <th>Details</th>
        <th>Send</th>
      </tr>
    </thead>
    <tbody>
      {leads.map(lead => <Row key={lead.hs} lead={lead} send={send} aId={aId} />)}
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
