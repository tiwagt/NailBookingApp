import React from 'react';

export function TermsOfService() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()} </p>
      <p>Welcome to Nath Nails! These Terms of Service govern your use of our services. By accessing or using our services, you agree to be bound by these terms.</p>

      <h2 className="text-2xl font-semibold mt-4">Use of Our Services</h2>
      <p>You must be at least 18 years old to use our services. You agree to provide accurate and complete information when creating an account or making a booking.</p>

      <h2 className="text-2xl font-semibold mt-4">User Responsibilities</h2>
      <p>You are responsible for maintaining the confidentiality of your account information and agree not to use our services for any unlawful purpose.</p>

      <h2 className="text-2xl font-semibold mt-4">Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Nath Nails shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>

      <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
      <p>If you have any questions about these Terms of Service, please contact us at [TO BE PROVIDED].</p>
    </div>
  );
} 