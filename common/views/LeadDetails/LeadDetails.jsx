import React, { Component } from 'react';
import LeadDetailsForm from './LeadDetailsForm';
import { getMessages, messageInput } from './actions';
import Table from './Table';
import axios from 'axios';

export default class LeadDetails extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageInput = this.handleMessageInput.bind(this);
    this.handleSendSms = this.handleSendSms.bind(this);

    this.state = {
      status: "ready",
      message: 'Ready'
    };
  }

  componentWillMount(props) {
    const { getLeadDetails, getMessages, match, dispatch, user } = this.props;
    getLeadDetails(match.params.id, user.token);
    getMessages(match.params.id, user.token);
  }

  saveLeadDetails = (redirectAfterSave=false) => {
    const { token } = this.props.user;

    this.setState( {
      status: "busy",
      message: 'Saving the user details...'
    });

    this.props.saveLeadDetails(this.props.form['update-create-lead'].values, token)
      .then((results) => {
        this.setState( {
          status: "ok",
          message: `Saved the user details on ` + new Date()
        });

        if (redirectAfterSave) {
          this.props.push('/leads');
        }
      });
  }

  // This will save & redirect
  handleSubmit = (e) => {
    e.preventDefault();
    this.saveLeadDetails(true);
  }

  handleMessageInput = (event) => {
    const { dispatch } = this.props;
    const { value } = event.target;
    this.props.messageInput(value);
   
  }

  handleSendSms(event) {
    event.preventDefault()
    const { leadMessage } = this.props;

    const campaignMessage = {
      leads: [
        {ph:this.props.details.ph,
          fn: this.props.details.fn,
          ln: this.props.details.ln,
        },
      ],
      // fr: '8507532018',
      fr: process.env.ADMIN_MOBILE,
      message: leadMessage.leadMessage,
    }
    console.log('client', campaignMessage)
    axios.post('/api/Proxies/sendCampaignToQueue', campaignMessage )
    .then( res => console.log('message sent'))
    .catch(function (error) {
      console.log(error);
    });
  }

  handleSave = (e) => {
    e.preventDefault();
    this.saveLeadDetails();
  }

  handleHubSpot = (e) => {
    e.preventDefault();

    const { token } = this.props.user;
    const { email, accountabilityPartnerComment } = this.props.form['update-create-lead'].values;

    // Replace all line feeds with HTML <br/> so that HubSpot can display them properly.
    const comment = accountabilityPartnerComment.replace(new RegExp("\n", "g"), "<br/>");

    this.setState( {
      status: "busy",
      message: `Trying to save the accountability partner comment in the HubSpot...`
    });

    this.props.sendCommentToHubSpot(email, comment, token)
      .then(res => {
        let now = new Date();

        this.setState( {
          status: "ok",
          message: `HubSpot note saved on ${now}.`
         });
      })
      .catch(err => {
        this.setState( {
          status: "error",
          message: "Error: Cannot attach accountability partner comment to the user in the HubSpot!"
        });
      });
  }

  getJSONStr = () => {
    let form = this.props.form['update-create-lead'];
    let jsonStr = "";

    if (form) {
      jsonStr = JSON.stringify(form.values, null, 2);
    }

    return jsonStr;
  }

  render() {
    
    const mockProfile = { profile: { displayName: 'none' } };
    const { profile } = this.props.user.profiles[0] || mockProfile;
    const { user, message, messages, leadMessage } = this.props;
    return (
      <div>
        <h1>Lead</h1>
        {user.isAdmin && <div>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <LeadDetailsForm
                  status={this.state.status}
                  handleSubmit={this.handleSubmit}
                  handleSave={this.handleSave}
                  handleHubSpot={this.handleHubSpot}
                  handleSendSms={this.handleSendSms}
                  handleMessageInput={this.handleMessageInput}
                  leadMessage={this.leadMessage}
                 
                   />
              </div>
              <div className="col-sm-6">
                <pre>{this.getJSONStr()}</pre>
              </div>
            </div>
            <div>Status: {this.state.message}</div>
            <div className="row">
              {messages && <Table messages={messages} />}
            </div>
          </div>
        </div>}
        {!user.isAdmin && <h3>You are not authorized to view this page.
        </h3>}
      </div>
    );
  }
}
