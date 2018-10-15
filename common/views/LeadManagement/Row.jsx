import React from 'react';
import PropTypes from 'prop-types';

const Row = ({ lead, send }) => (
    <tr>
    <td>
      {lead.fn}
    </td>
    <td>
      {lead.ln}
    </td>
    <td>
      {lead.ph}
    </td>
    <td>
    <a href={`https://app.hubspot.com/contacts/4959019/contact/${lead.hs}`} target='_blank'>{lead.hs}</a>
    </td>
    <td>
      -#-
    </td>
    <td>
      -#-
    </td>
    <td>
      {lead.em}
    </td>
    <td>
      <a href={`/auth/account#/#`}>Details </a>
    </td>
    <td>
      <button className='btn btn-xs btn-success' onClick={() => send(lead)}>SEND SMS</button>
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
