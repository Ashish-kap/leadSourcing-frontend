import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  <strong>Effective Date:</strong> September 21, 2025
                </p>
              </div>

              <Separator className="mb-8" />

              {/* Introduction */}
              <div className="mb-8 space-y-4 text-sm sm:text-base leading-relaxed">
                <p className="text-foreground">
                  Leadhuntr ("we", "our", or "us") is committed to protecting
                  your privacy. This Privacy Policy explains how we collect,
                  use, and protect your personal information when you use our
                  website{" "}
                  <a
                    href="https://leadhuntr.vercel.app"
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://leadhuntr.vercel.app
                  </a>{" "}
                  (the "Site").
                </p>
                <p>
                  By using our Site, you agree to the terms of this Privacy
                  Policy.
                </p>
              </div>
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  1. Information We Collect
                </h2>
                <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Personal Information You Provide
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                      <li>Name</li>
                      <li>Email address</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      This information is collected when you fill out forms or
                      interact with features that require input.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Automatically Collected Information
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                      <li>IP address</li>
                      <li>Browser type and device information</li>
                      <li>Usage data</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      This is collected via cookies and tracking tools like
                      Google Analytics.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  2. How We Use Your Information
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground ml-4">
                  <li>Improve and optimize the Site and our services</li>
                  <li>Understand user behavior and preferences</li>
                  <li>
                    Provide access to features, including user authentication
                    via OAuth
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  3. Use of Cookies
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground ml-4">
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Enhance user experience</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground">
                  You can manage your cookie preferences through your browser
                  settings.
                </p>
              </section>

              {/* Section 4 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  4. Third‑Party Services
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We use the following third‑party service:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground ml-4">
                  <li>
                    <strong>Google Analytics</strong> – to analyze traffic and
                    usage trends on the Site. Google may collect data according
                    to its own{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We do <strong>not</strong> share your personal data with third
                  parties for marketing or advertising purposes.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  5. User Accounts and Authentication
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Users may create an account or log in via{" "}
                  <strong>OAuth‑based authentication</strong>. By logging in,
                  you agree to share basic information (e.g., name, email) from
                  your authentication provider.
                </p>
              </section>

              {/* Section 6 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  6. International Users
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Our services are available globally. If you are accessing the
                  Site from regions with data protection laws (like the{" "}
                  <strong>EU/EEA</strong>), we process your data in accordance
                  with those regulations, including <strong>GDPR</strong>.
                </p>
              </section>

              {/* Section 7 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  7. Children's Privacy
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  The Site is not specifically directed to children under the
                  age of 13. We do not knowingly collect personal data from
                  children. If you believe we have collected such data, please
                  contact us to request deletion.
                </p>
              </section>

              {/* Section 8 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  8. Data Security
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We implement reasonable technical and organizational measures
                  to protect your data. However, no system is 100% secure.
                </p>
              </section>

              {/* Section 9 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  9. Your Rights
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Depending on your location, you may have rights regarding your
                  personal data, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground ml-4">
                  <li>Accessing your data</li>
                  <li>Requesting correction or deletion</li>
                  <li>Withdrawing consent (where applicable)</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground">
                  To make such requests, please contact us at the email below.
                </p>
              </section>

              {/* Section 10 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We may update this Privacy Policy from time to time. We
                  encourage you to review it periodically. Changes are effective
                  when posted on this page.
                </p>
              </section>

              {/* Section 11 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 pt-8">
                  11. Contact Us
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  If you have questions or concerns about this Privacy Policy,
                  please contact us at:
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  <strong>Email:</strong> srigbok@gmail.com
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
