import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

export default class LeadManagement extends Component {
  constructor(props) {
    super(props);
    this.state = { quickMessage: '' };
  }

  componentDidMount() {
    const { token } = this.props.user;
    const aId = this.props.account.id;
    this.props.getAllLeads(token, aId);
    this.handleQuickMessage = this.handleQuickMessage.bind(this);
    this.send = this.send.bind(this);
  }

  handleQuickMessage(e) {
    this.setState({ quickMessage: e.target.value });
  }

  send(lead, aId) {
    this.props.sendSMSMessage(this.props.user.token, this.state.quickMessage, lead, aId);
  }

  render() {
    const { user, leads, account } = this.props;
    return (
      <div>
        <h1>Leads</h1>
        {user.isAdmin && <div>
          <div className="container">
            <div className="row">
              <h2>Stats:</h2>
              <ul>
                {leads && <li>Total number of leads in system: {leads.length}</li>}
              </ul>
            </div>
            <div className="row">
                <label htmlFor="quickMessage"><h3>Quick Message</h3></label>
            </div>
            <div className="row">
              <textarea
                name="quickMessage"
                id="quickMessage"
                onChange={this.handleQuickMessage}
              />
            </div>
          </div>
          <hr />
          {leads && <Table leads={leads} send={this.send} aId={account.id} />}
        </div>}
        {!user.isAdmin && <h3>You are not authorized to view this page.</h3>}
      </div>
    );
  }
}

LeadManagement.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  account: PropTypes.objectOf(PropTypes.any),
  leads: PropTypes.arrayOf(PropTypes.object),
  getAllLeads: PropTypes.func
};
