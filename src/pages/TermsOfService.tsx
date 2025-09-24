import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Terms of Service
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  <strong>Effective Date:</strong> September 21, 2025
                </p>
              </div>

              <Separator className="mb-8" />

              {/* Introduction */}
              <div className="mb-8 space-y-4 text-sm sm:text-base leading-relaxed">
                <p className="text-foreground">
                  Welcome to CazaLead! These Terms of Service ("Terms") govern
                  your access to and use of our website located at{" "}
                  <a
                    href="https://cazalead.com"
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://cazalead.com
                  </a>{" "}
                  (the "Site") and any related services provided by CazaLead
                  ("we", "our", or "us").
                </p>
                <p className="text-foreground">
                  By using the Site, you agree to be bound by these Terms. If
                  you do not agree, do not use the Site.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    1. Use of the Site
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      You must be at least 13 years old to use the Site. By
                      using the Site, you represent that you are eligible to use
                      it and that any information you provide is accurate and
                      complete.
                    </p>
                    <p>
                      We grant you a limited, non-exclusive, non-transferable
                      license to use the Site in accordance with these Terms.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    2. User Accounts
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      To access certain features, you may need to sign in using
                      a third-party OAuth provider (e.g., Google). You are
                      responsible for maintaining the confidentiality of your
                      account credentials and for all activity under your
                      account.
                    </p>
                    <p>
                      We reserve the right to suspend or terminate your access
                      if we believe your use violates these Terms or is harmful
                      to other users or the Site.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    3. User Conduct
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>You agree not to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                      <li>Use the Site for any unlawful purpose</li>
                      <li>
                        Attempt to gain unauthorized access to the Site or other
                        accounts
                      </li>
                      <li>Interfere with or disrupt the Site's operation</li>
                      <li>Upload or transmit any malicious code or viruses</li>
                      <li>Harvest or scrape personal data from other users</li>
                    </ul>
                    <p>
                      We may remove or disable access to any content that
                      violates these Terms.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    4. Intellectual Property
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      All content on the Site — including text, code, graphics,
                      logos, and software — is the property of CazaLead or its
                      licensors and is protected by intellectual property laws.
                    </p>
                    <p>
                      You may not copy, modify, distribute, sell, or lease any
                      part of our Site or services without our prior written
                      consent.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    5. Third-Party Services
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      We use third-party services like{" "}
                      <strong>Google Analytics</strong> to understand user
                      behavior. These services may collect data under their own
                      terms and privacy policies. We are not responsible for any
                      third-party websites or services linked to or from the
                      Site.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    6. Privacy
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      Your use of the Site is also governed by our{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>
                      , which explains how we collect and use your data.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    7. Termination
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      We reserve the right to suspend or terminate your access
                      to the Site at any time, without notice, for any reason,
                      including if you violate these Terms.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    8. Disclaimer of Warranties
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      The Site is provided "as is" and "as available" without
                      warranties of any kind, either express or implied. We do
                      not guarantee that the Site will be error-free, secure, or
                      always available.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    9. Limitation of Liability
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      To the fullest extent permitted by law, CazaLead shall not
                      be liable for any indirect, incidental, special,
                      consequential, or punitive damages, or any loss of data,
                      use, or profits, arising from your use of the Site.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    10. Modifications to Terms
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      We may update these Terms at any time. If we do, we'll
                      notify users via the Site or other appropriate means.
                      Continued use of the Site after changes constitutes
                      acceptance of the new Terms.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    11. Governing Law
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      These Terms shall be governed by and interpreted in
                      accordance with the laws of the jurisdiction in which
                      CazaLead operates, without regard to its conflict of law
                      principles.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                    12. Contact Us
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                    <p>
                      If you have any questions about these Terms, please
                      contact us at:
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:srigbok@gmail.com"
                        className="text-primary hover:underline font-medium"
                      >
                        srigbok@gmail.com
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
