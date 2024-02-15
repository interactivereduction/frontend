import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from '@cypress/react';
import HomePage from './HomePage';

describe('HomePage Component Tests', () => {
  beforeEach(() => {
    // Before each test, mount the HomePage component wrapped in BrowserRouter
    // This setup is necessary since HomePage uses Link components for routing
    mount(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  });

  it('displays correct title size for desktop', () => {
    cy.get('h2').should('have.css', 'font-size', '32px');
  });

  it('renders the title correctly in two parts', () => {
    cy.contains('Data reduction and processing').should('be.visible');
    cy.contains('for large-scale science facilities').should('be.visible');
  });

  // TODO: currently a false test as the light / dark mode setting
  // it('changes button background color on hover', () => {
  //   cy.get('[data-testid="browse-button"]').first()
  //     .should("have.css", "background-color", "rgb(25, 118, 210)") // Asserts the default color
  //     .realHover() // Simulates a real hover event over the button
  //     .should('have.css', 'background-color', "rgb(21, 101, 192)"); // Asserts the hover color
  // });
});
