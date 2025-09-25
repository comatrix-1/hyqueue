import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            <strong>Effective Date:</strong> 4 July 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            At Hyqueue, we respect your privacy and are committed to
            protecting the personal information you share with us. This Privacy
            Policy outlines how we collect, use, and safeguard your information
            when you visit our website and use our services.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Personal Information:</strong> Information that can identify
                  you personally, such as your name, email address, and other contact
                  details when you sign up for notifications or use our services.
                </li>
                <li>
                  <strong>Usage Data:</strong> Data related to your interaction with
                  our website, including IP address, browser type, device information,
                  and page views.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>To send you updates and notifications about our services.</li>
                <li>To improve the functionality and user experience of our website.</li>
                <li>To communicate with you about customer service, technical issues, or requests.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
              <p>
                We take reasonable measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
              <p>
                Our website may use cookies to enhance user experience. You can
                control cookie settings through your browser.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Links</h2>
              <p>
                Our website may contain links to external sites. We are not
                responsible for the content or privacy practices of these third-party
                sites.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Request access to or correction of your personal data.</li>
                <li>Opt out of receiving communications from us.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy,
                please contact us at [Insert Contact Information].
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
