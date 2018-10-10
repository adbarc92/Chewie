import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import './DetailsForm.css';

let DetailsForm = (props) => {
  const { handleSubmit, handleSave, handleHubSpot, status } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group  row">
        <label className="col-sm-4" htmlFor="id">ID</label>
        <Field className="col-sm-8" disabled={'true'} name="id" id="id" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="email">Email</label>
        <Field className="col-sm-8" disabled={'true'} name="email" id="email" component="input" type="email" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="moodleUserId">Moodle User ID</label>
        <Field className="col-sm-8" disabled={'true'} name="moodleUserId" id="moodleUserId" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="fullName">Full Name</label>
        <Field className="col-sm-8" name="fullName" id="fullName" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="firstName">First Name</label>
        <Field className="col-sm-8" name="firstName" id="firstName" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="lastName">Last Name</label>
        <Field className="col-sm-8" name="lastName" id="lastName" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="username">User Name</label>
        <Field className="col-sm-8" name="username" id="username" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="wakatimeApiKey">WakaTime Api Key</label>
        <Field className="col-sm-8" name="wakatimeApiKey" id="wakatimeApiKey" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="accountabilityPartnerEmailId">Accountability Email ID</label>
        <Field className="col-sm-8" name="accountabilityPartnerEmailId" id="accountabilityPartnerEmailId" component="input" type="text" />
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <Field name="inClass" id="inClass" component="input" type="checkbox" />
            <label htmlFor="inClass">In Class</label>
          </div>
          <div className="form-group">
            <Field disabled={'true'} name="emailVerified" id="emailVerified" component="input" type="checkbox" />
            <label htmlFor="emailVerified">emailVerified</label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <Field name="isAdmin" id="isAdmin" component="input" type="checkbox" />
            <label htmlFor="isAdmin">Admin</label>
          </div>
          <div className="form-group">
            <Field name="disabled" id="disabled" component="input" type="checkbox" />
            <label htmlFor="disabled">Disabled</label>
          </div>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-sm-12">
          <label htmlFor="accountabilityPartnerComment">Comments</label>
          <br/>
          <Field
            name="accountabilityPartnerComment"
            id="accountabilityPartnerComment"
            component="textarea" rows="10" cols="75"
          />
        </div>
      </div>

      <button className="btn btn-info" onClick={handleSave}>Save</button>
      <button className="btn btn-info" type="submit">Save & Close</button>
      <button className="btn btn-info" onClick={handleHubSpot}>Post to HubSpot</button>
      
      <span className="status-indicator">
        { status === 'busy' ?
            <i className="fa fa-spinner fa-spin fa-2x fa-fw"></i>
            :
            status === 'error' ?
            <i className="fa fa-exclamation fa-2x fa-fw"></i>
            :
            <i className="fa fa-check fa-2x fa-fw"></i>
        }
      </span>
    </form>
  );
};

DetailsForm = reduxForm({
  form: 'update-create-user', // a unique identifier for this form
  enableReinitialize: true
})(DetailsForm);

DetailsForm = connect(state => ({
  initialValues: state.userDetails.details
}))(DetailsForm);

export default DetailsForm;
