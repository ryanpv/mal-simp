import React from "react";
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, } from '@testing-library/react';
import { StateProvider } from "../contexts/StateContexts";
import { AuthProvider } from "../contexts/AuthContext";
import { DisplayDataProvider } from "../contexts/DisplayDataContext";
import { BrowserRouter } from "react-router-dom";

import HomePage from "../components/HomePage";

  afterEach(cleanup)

  it('should take a snapshot', async () => {
    const { asFragment } = render(
      <BrowserRouter>
        <StateProvider>
          <AuthProvider>
            <DisplayDataProvider>
              <HomePage />
            </DisplayDataProvider>
          </AuthProvider>
        </StateProvider>
      </BrowserRouter>
    )


    // expect(await screen.findByText(/loaded/i).toBeInTheDocument())   
    expect(asFragment(<HomePage />)).toMatchSnapshot()

  })

  