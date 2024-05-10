import React from 'react';
import Instruments from '../../src/Instruments';
import { mount } from '@cypress/react';

describe('<Instruments />', () => {
  beforeEach(() => {
    mount(<Instruments />);
  });
});
