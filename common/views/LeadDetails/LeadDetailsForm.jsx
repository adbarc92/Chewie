import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import './LeadDetailsForm.css';

let LeadDetailsForm = (props) => {
  const { handleSubmit, handleSave, handleHubSpot, status } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group  row">
        <label className="col-sm-4" htmlFor="id">Id</label>
        <Field className="col-sm-8" disabled={'true'} name="id" id="id" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="em">Email</label>
        <Field className="col-sm-8" disabled={'true'} name="em" id="em" component="input" type="email" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="fn">First Name</label>
        <Field className="col-sm-8" name="fn" id="fn" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="ln">Last Name</label>
        <Field className="col-sm-8" name="ln" id="ln" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="ph">Phone Number</label>
        <Field className="col-sm-8" name="ph" id="ph" component="input" type="text" />
      </div>
      <div className="form-group row">
        <label className="col-sm-4" htmlFor="hs">HubSpot Id</label>
        <Field className="col-sm-8" name="hs" id="hs" component="input" type="text" />
      </div>
      <div className="form-group row">
          <Field name="dnc" id="dnc" component="input" type="checkbox" />
          <label htmlFor="dnc">Do Not Call</label>
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

LeadDetailsForm = reduxForm({
  form: 'update-create-lead', // a unique identifier for this form
  enableReinitialize: true
})(LeadDetailsForm);

LeadDetailsForm = connect(state => ({
  initialValues: state.leadDetails.details
}))(LeadDetailsForm);

export default LeadDetailsForm;
