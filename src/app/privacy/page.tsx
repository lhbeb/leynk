import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-accent/20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center">
          {/* Left: Back to Home */}
          <div className="flex-1">
            <Link
              href="/"
              className="inline-flex items-center text-text-primary/60 hover:text-text-primary transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          
          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image 
                src="/leynk-logo.svg" 
                alt="Leynk" 
                width={180} 
                height={49}
                priority
              />
            </Link>
          </div>
          
          {/* Right: Empty space for balance */}
          <div className="flex-1"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-text-primary/80 space-y-6">
            <p className="text-sm text-text-primary/60 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">1. Introduction</h2>
              <p>
                Welcome to Leynk.co ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website leynk.co.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-text-primary mb-3">2.1 Information You Provide</h3>
              <p>
                We collect information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create a user profile on our platform</li>
                <li>Subscribe to notifications for a user's updates</li>
                <li>Contact us for support or report issues</li>
                <li>Interact with our website features</li>
              </ul>
              <p className="mt-4">
                This information may include your username, email address, profile picture, bio, links, and any other information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p>
                When you visit our website, we automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and geolocation data (country, city)</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Click patterns and interactions with links</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and manage user profiles</li>
                <li>Send notifications and updates (if you subscribe)</li>
                <li>Analyze usage patterns and website traffic</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">4. Data Storage and Security</h2>
              <p>
                We use Supabase, a third-party database and storage service, to store your information. Your data is stored securely using industry-standard security measures. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              <p className="mt-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">5. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain information. You can control cookie preferences through our Cookie Preferences page. For more information, please visit our Cookie Preferences page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">6. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> For database and file storage services</li>
                <li><strong>Telegram:</strong> For sending notifications (if you subscribe)</li>
                <li><strong>IP Geolocation Services:</strong> For determining location based on IP address</li>
              </ul>
              <p className="mt-4">
                These third-party services have their own privacy policies governing the collection and use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">7. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Withdraw consent for data processing (where applicable)</li>
                <li>Unsubscribe from notifications at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us through the Report page or by accessing your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">8. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 bg-accent/5 rounded-xl p-6 border border-accent/10">
                <p className="font-semibold text-text-primary">Raveloo Retailers LLC</p>
                <p>EIN: 38-4276758</p>
                <p>5830 E 2nd St, Ste 7000</p>
                <p>Casper, WY 82609</p>
                <p>Phone: +1 (912) 923-1747</p>
                <p className="mt-4"><Link href="/contact" className="text-accent hover:underline font-medium">Message us through our contact form</Link></p>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-6 border-t border-accent/10">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text-primary/50 mb-6">
              <Link
                href="/cookie-preferences"
                className="hover:text-text-primary transition-colors"
              >
                Cookie Preferences
              </Link>
              <span className="text-text-primary/30">·</span>
              <Link
                href="/report"
                className="hover:text-text-primary transition-colors"
              >
                Report
              </Link>
              <span className="text-text-primary/30">·</span>
              <Link
                href="/privacy"
                className="hover:text-text-primary transition-colors font-semibold"
              >
                Privacy
              </Link>
            </div>
            
            {/* Powered by Leynk */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex flex-col items-center gap-2 group"
              >
                <span className="text-xs text-text-primary/40 group-hover:text-text-primary/60 transition-colors">Powered by</span>
                <Image 
                  src="/leynk-logo.svg" 
                  alt="Leynk" 
                  width={150} 
                  height={41}
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

