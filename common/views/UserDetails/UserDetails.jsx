import React, { Component } from 'react';
import DetailsForm from './DetailsForm';

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      status: "ready",
      message: 'Ready'
    };
  }

  componentWillMount(props) {
    const { getUserDetails, match, dispatch, user } = this.props;
    getUserDetails(match.params.id, user.token);
  }

  saveUserDetails = (redirectAfterSave=false) => {
    const { token } = this.props.user;
    
    this.setState( { 
      status: "busy",
      message: 'Saving the user details...'
    });

    this.props.saveUserDetails(this.props.form['update-create-user'].values, token)
      .then((results) => {
        this.setState( { 
          status: "ok",
          message: `Saved the user details on ` + new Date() 
        });

        if (redirectAfterSave) {
          this.props.push('/users');
        }
      });  
  }
  
  // This will save & redirect
  handleSubmit = (e) => {
    e.preventDefault();
    this.saveUserDetails(true);
  }

  handleSave = (e) => {
    e.preventDefault();
    this.saveUserDetails();
  }

  handleHubSpot = (e) => {
    e.preventDefault();

    const { token } = this.props.user;    
    const { email, accountabilityPartnerComment } = this.props.form['update-create-user'].values;

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
    let form = this.props.form['update-create-user'];
    let jsonStr = "";

    if (form) {
      jsonStr = JSON.stringify(form.values, null, 2);
    }

    return jsonStr;
  }

  render() {
    const mockProfile = { profile: { displayName: 'none' } };
    const { profile } = this.props.user.profiles[0] || mockProfile;
    const { user, message } = this.props;
    return (
      <div>
        <h1>User</h1>
        {user.isAdmin && <div>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <DetailsForm 
                  status={this.state.status}
                  handleSubmit={this.handleSubmit} 
                  handleSave={this.handleSave}
                  handleHubSpot={this.handleHubSpot} />
              </div>
              <div className="col-sm-6">
                <pre>{this.getJSONStr()}</pre>
              </div>
            </div>  
            <div>Status: {this.state.message}</div>
          </div>
        </div>}
        {!user.isAdmin && <h3>You are not authorized to view this page.
        </h3>}
      </div>
    );
  }
}
