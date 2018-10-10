import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import UserManagement from '../../common/views/UserManagement/UserManagement';
import Row from '../../common/views/UserManagement/Row';
import Table from '../../common/views/UserManagement/Table';

function setup() {
  const props = {
    getAllUsers: jest.fn(() => Promise.resolve({})),
    filterAllUsers: jest.fn(),
    dispatch: jest.fn(),
    user: {
      profiles: []
    }
  };

  const enzymeWrapper = mount(<UserManagement {...props} />);

  return {
    props,
    enzymeWrapper
  };
}

describe('UserManagement Component', () => {
  it('renders a <UserManagement /> component', () => {
    const { enzymeWrapper } = setup();
    // const wrapperTable = shallow(<Table users={[{username: 'test', email: 'test' }]} />);

    // const wrapperRow = shallow(<Row user={{username: 'test', email: 'test' }} />);

    // expect(wrapperRow.contains(<button className='btn btn-success'>Details</button>)).to.equal(true);
    // expect(wrapperRow.exists()).to.equal(true);

    // expect(wrapperTable.find(Row)).to.have.length(1);
  });

  it('renders a <Table /> component', () => {
    // const { enzymeWrapper } = setup();

    const wrapper = shallow(<Table users={[{ fullName: 'test', email: 'test' }]} />);
    expect(wrapper.find(Row)).to.have.length(1);
  });

  it('renders a <Row /> component', () => {
    // const { enzymeWrapper } = setup();

    const wrapper = shallow(<Row user={{ fullName: 'test', email: 'test', id: 'test' }} />);
    expect(wrapper.contains(<a href="/auth/account#/user/test">details</a>)).to.equal(true);
    expect(wrapper.exists()).to.equal(true);
  });
});
