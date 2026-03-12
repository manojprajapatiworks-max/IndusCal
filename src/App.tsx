/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Admin from './pages/admin/Admin';

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}
