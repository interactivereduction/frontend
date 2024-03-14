import React from 'react';
import Instrument from '../../src/Instrument';
import { mount } from '@cypress/react';

describe('<Instrument />', () => {
  beforeEach(() => {
    mount(<Instrument />);
  });
});
