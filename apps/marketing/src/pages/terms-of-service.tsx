import React from "react";

const TermsOfService = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            <strong>Effective Date:</strong> 4 July 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            These Terms of Service ("Terms") govern your use of the
            Hyqueue website and services. By accessing or using our services,
            you agree to be bound by these Terms.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Use of Our Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may use our services only for lawful purposes.</li>
                <li>
                  You agree not to misuse our services or engage in any activity that
                  disrupts or interferes with the functioning of our website.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. Account Registration</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You may be required to create an account to access certain features
                  of our services, such as receiving updates or notifications.
                </li>
                <li>
                  You are responsible for keeping your account information secure and
                  for all activity under your account.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All content on the website, including logos, images, and text, is
                  the property of Hyqueue and is protected by copyright law.
                </li>
                <li>
                  You may not use, reproduce, or distribute any content from our
                  website without our permission.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Limitations of Liability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Hyqueue is not responsible for any damages or losses arising
                  from the use of our website or services.
                </li>
                <li>
                  Our website is provided "as is" and we do not guarantee
                  that it will be error-free or uninterrupted.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Changes to the Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  We may update these Terms from time to time. Any changes will be
                  posted on this page with an updated effective date.
                </li>
                <li>
                  By continuing to use our services, you agree to the updated Terms.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Governing Law</h2>
              <p>
                These Terms are governed by the laws of [Insert Jurisdiction]. Any
                disputes will be resolved in the courts located in [Insert Jurisdiction].
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
              <p>
                If you have any questions or concerns about these Terms of Service,
                please contact us at [Insert Contact Information].
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
