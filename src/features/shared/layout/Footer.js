// src/features/shared/layout/Footer.js

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-primary border-t border-border-light p-md text-text-secondary text-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          <p>&copy; {currentYear} NeuroLedger. All rights reserved.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <ul className="flex space-x-4">
            <li>
              <a
                href="#"
                className="hover:text-primary-500 transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-500 transition-colors"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-500 transition-colors"
              >
                Help
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;