import React from 'react';

export function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
      <p>At Nath Nails, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our services.</p>
      
      <h2 className="text-2xl font-semibold mt-4">Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li><strong>Personal Information:</strong> We may collect personal information that you provide to us, such as your name, email address, and phone number when you create an account or make a booking.</li>
        <li><strong>Usage Data:</strong> We may collect information about how you use our services, including your IP address, browser type, and pages visited.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4">How We Use Your Information</h2>
      <p>We may use the information we collect for various purposes, including:</p>
      <ul className="list-disc ml-6">
        <li>To provide and maintain our services</li>
        <li>To notify you about changes to our services</li>
        <li>To allow you to participate in interactive features of our services</li>
        <li>To provide customer support</li>
        <li>To gather analysis or valuable information so that we can improve our services</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4">Your Rights</h2>
      <p>You have the right to access the personal information we hold about you, request correction of any inaccurate information, and request deletion of your personal information.</p>

      <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at [your email address].</p>
    </div>
  );
}
