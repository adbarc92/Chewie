import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const FilterOptions = ({ filterOptions, handleChangeStudentType, handleChangeVerified, handleChangeDisabled, handleChangeEnrolled }) => (
  <div className="row">
    <div className="col col-xs-12 col-md-3">
      <Select
        onChange={handleChangeStudentType}
        options={filterOptions.studentTypes}
        placeholder="Student Type"
        value={filterOptions.studentType}
      />
    </div>
    <div className="col col-xs 12 col-md-3">
      <div className="form-group">
        <input
          name="isEnrolled"
          id="isEnrolled"
          type="checkbox"
          checked={filterOptions.enrolled}
          onChange={handleChangeEnrolled}
        />
        <label htmlFor="isEnrolled">Enrolled</label>
      </div>
      <div className="form-group">
        <input
          name="isVerified"
          id="isVerified"
          type="checkbox"
          checked={filterOptions.verified}
          onChange={handleChangeVerified}
        />
        <label htmlFor="isVerified">Verified</label>
      </div>
      <div className="form-group">
        <input
          name="isDisabled"
          id="isDisabled"
          type="checkbox"
          checked={filterOptions.disabled}
          onChange={handleChangeDisabled}
        />
        <label htmlFor="isDisabled">Disabled</label>
      </div>
    </div>
  </div>
);

FilterOptions.propTypes = {
  filterOptions: PropTypes.objectOf(PropTypes.any),
  handleChangeStudentType: PropTypes.func,
  handleChangeVerified: PropTypes.func,
  handleChangeDisabled: PropTypes.func,
  handleChangeEnrolled: PropTypes.func
};

export default FilterOptions;
