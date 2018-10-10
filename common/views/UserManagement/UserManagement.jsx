import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import FilterOptions from './FilterOptions';

export default class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOptions: {
        verified: true,
        disabled: false,
        enrolled: true,
        studentType: 'ALL',
        studentTypes: [
          { label: 'Day class', value: 'FULL' },
          { label: 'Night class', value: 'PART' },
          { label: 'Day & Night class', value: 'ALL' },
          { label: 'Prep students', value: 'PREP' }
        ]
      }
    };
    this.handleChangeStudentType = this.handleChangeStudentType.bind(this);
    this.handleChangeVerified = this.handleChangeVerified.bind(this);
    this.handleChangeDisabled = this.handleChangeDisabled.bind(this);
    this.handleChangeEnrolled = this.handleChangeEnrolled.bind(this);
    //this.del = this.del.bind(this);
  }

  componentDidMount() {
    const { token } = this.props.user;
    const { filterOptions } = this.state;
    this.props.getAllUsers(token)
    .then((response) => {
      this.props.filterAllUsers(response.value.users, filterOptions);
    });
  }

  handleChangeStudentType(studentType) {
    const { filterOptions } = this.state;
    const { users } = this.props;
    filterOptions.studentType = studentType.value;
    this.setState({ filterOptions }, () => {
      this.props.filterAllUsers(users, this.state.filterOptions);
    });
  }

  handleChangeVerified(e) {
    const { filterOptions } = this.state;
    const { users } = this.props;
    filterOptions.verified = e.target.checked;
    this.setState({ filterOptions }, () => {
      this.props.filterAllUsers(users, this.state.filterOptions);
    });
  }

  handleChangeDisabled(e) {
    const { users } = this.props;
    const { filterOptions } = this.state;
    filterOptions.disabled = e.target.checked;
    this.setState({ filterOptions }, () => {
      this.props.filterAllUsers(users, this.state.filterOptions);
    });
  }

  handleChangeEnrolled(e) {
    const { users } = this.props;
    const { filterOptions } = this.state;
    filterOptions.enrolled = e.target.checked;
    this.setState({ filterOptions }, () => {
      this.props.filterAllUsers(users, this.state.filterOptions);
    });
  }

  // del(id) {
  //   this.props.dispatch(deleteUser(id));
  // }

  render() {
    const { user, users, filteredUsers, deleteUser } = this.props;
    const { filterOptions } = this.state;
    return (
      <div>
        <h1>Users</h1>
        {user.isAdmin && <div>
          <div className="container">
            Stats:
            <ul>
              {users && <li>Total number of users in system: {users.length}</li>}
              {filteredUsers && <li>Total number of users selected: {filteredUsers.length}</li>}
            </ul>
          </div>
          <hr />
          <FilterOptions
            filterOptions={filterOptions}
            handleChangeStudentType={this.handleChangeStudentType}
            handleChangeVerified={this.handleChangeVerified}
            handleChangeDisabled={this.handleChangeDisabled}
            handleChangeEnrolled={this.handleChangeEnrolled}
          />
          <Table users={!!filteredUsers ? filteredUsers : users} del={deleteUser} />
        </div>}
        {!user.isAdmin && <h3>You are not authorized to view this page.
        </h3>}
      </div>
    );
  }
}

UserManagement.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  users: PropTypes.arrayOf(PropTypes.object),
  filteredUsers: PropTypes.arrayOf(PropTypes.object),
  filterAllUsers: PropTypes.func,
  getAllUsers: PropTypes.func,
  del: PropTypes.func
};
