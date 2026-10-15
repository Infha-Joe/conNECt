import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import VerifyEmail from './pages/VerifyEmail.jsx';

async function run() {
  try {
    const { container } = render(
      <MemoryRouter initialEntries={['/verify-email/123']}>
        <Routes>
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>
    );
    console.log("Rendered successfully");
  } catch (err) {
    console.log("Crash:", err);
  }
}
run();
