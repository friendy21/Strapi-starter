// app/legal/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Acumen Strategy",
    description: "Privacy Policy for Acumen Strategy - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-display mb-4">Privacy Policy</h1>
                    <p className="text-white/70">Last Updated: January 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    {/* Introduction */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">1. Introduction</h2>
                        <p className="text-primary/80 leading-relaxed">
                            Acumen Strategy (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or &quot;Company&quot;) is committed to protecting your privacy. 
                            This Privacy Policy explains how we collect, use, disclose, and otherwise process personal 
                            information in connection with our wealth management compliance solutions and related services.
                        </p>
                    </div>

                    {/* Information We Collect */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">2. Information We Collect</h2>
                        
                        <h3 className="text-lg font-semibold text-primary mb-3">2.1 Information You Provide Directly</h3>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80 mb-6">
                            <li>Name, email address, and contact information</li>
                            <li>Company and professional details</li>
                            <li>Account credentials and preferences</li>
                            <li>Communications and correspondence with us</li>
                            <li>Payment and billing information</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-primary mb-3">2.2 Information Collected Automatically</h3>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80">
                            <li>Device identifiers and browser information</li>
                            <li>IP address and geographic location (general)</li>
                            <li>Usage data and interaction metrics</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </div>

                    {/* How We Use Information */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">3. How We Use Your Information</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">
                            We use the information we collect for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80">
                            <li>Providing and maintaining our compliance solutions</li>
                            <li>Processing and managing your account</li>
                            <li>Responding to your inquiries and support requests</li>
                            <li>Sending service updates and communications</li>
                            <li>Complying with legal and regulatory obligations</li>
                            <li>Improving our products and services</li>
                            <li>Preventing fraud and ensuring security</li>
                        </ul>
                    </div>

                    {/* Legal Basis */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">4. Legal Basis for Processing</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">
                            We process your personal information based on the following legal grounds:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80">
                            <li><strong>Consent:</strong> Where you have provided explicit consent for specific processing</li>
                            <li><strong>Contract:</strong> To fulfill our obligations under service agreements</li>
                            <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                            <li><strong>Legitimate Interest:</strong> For fraud prevention, security, and service improvement</li>
                        </ul>
                    </div>

                    {/* Data Sharing */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">5. Data Sharing & Third Parties</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">
                            We do not sell your personal information. We may share information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80">
                            <li>Service providers (cloud hosting, payment processors, analytics)</li>
                            <li>Legal authorities when required by law</li>
                            <li>Professional advisors (legal, financial, insurance)</li>
                            <li>Business partners with your explicit consent</li>
                        </ul>
                    </div>

                    {/* Data Retention */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">6. Data Retention</h2>
                        <p className="text-primary/80 leading-relaxed">
                            We retain personal information for as long as necessary to provide services, comply with legal 
                            obligations, and resolve disputes. Retention periods vary based on the type of data and purpose 
                            of processing. When data is no longer needed, we securely delete or anonymize it.
                        </p>
                    </div>

                    {/* Privacy Rights */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">7. Your Privacy Rights</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">
                            Depending on your location, you may have the following rights:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80 mb-4">
                            <li>Right to access your personal information</li>
                            <li>Right to correct inaccurate data</li>
                            <li>Right to delete your information</li>
                            <li>Right to object to processing</li>
                            <li>Right to data portability</li>
                            <li>Right to withdraw consent</li>
                        </ul>
                        <p className="text-primary/80 leading-relaxed">
                            To exercise these rights, please contact us at{" "}
                            <a href="mailto:privacy@acumen-strategy.com" className="text-accent hover:underline">
                                privacy@acumen-strategy.com
                            </a>
                        </p>
                    </div>

                    {/* Security */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">8. Security</h2>
                        <p className="text-primary/80 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information, including 
                            encryption, secure data transmission, access controls, and regular security audits. However, no 
                            method of transmission over the internet is completely secure. We continuously work to improve 
                            our security practices.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">9. Contact Us</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">
                            For privacy-related inquiries, contact us at:
                        </p>
                        <div className="bg-muted p-6 rounded-lg border border-primary/10">
                            <p className="font-semibold text-primary mb-2">Acumen Strategy Privacy Team</p>
                            <p className="text-primary/70">Email: privacy@acumen-strategy.com</p>
                            <p className="text-primary/70">Address: 272 Market Sq, Lake Forest, IL 60045</p>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
