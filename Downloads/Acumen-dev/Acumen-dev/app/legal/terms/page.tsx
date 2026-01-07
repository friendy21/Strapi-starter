// app/legal/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Acumen Strategy",
    description: "Terms of Service for Acumen Strategy - Read our terms and conditions for using our wealth management compliance solutions.",
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-display mb-4">Terms of Service</h1>
                    <p className="text-white/70">Last Updated: January 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Acceptance */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">1. Acceptance of Terms</h2>
                        <p className="text-primary/80 leading-relaxed">
                            By using Acumen Strategy&apos;s services, including Glynac, Tollbooth, Prairie Hill Holdings,
                            and WMCI, you agree to comply with these Terms of Service. If you do not agree, you may not
                            use our services. We reserve the right to modify these terms at any time, and your continued
                            use constitutes acceptance of changes.
                        </p>
                    </div>

                    {/* Services Description */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">2. Services Description</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">
                            Acumen Strategy provides software, products, and services designed to help wealth management
                            firms navigate compliance requirements and scale their operations. Our services include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80">
                            <li><strong>Glynac:</strong> Compliance-first AI workspace for wealth management</li>
                            <li><strong>Tollbooth:</strong> Automated options execution platform</li>
                            <li><strong>Prairie Hill Holdings:</strong> Institutional NNN real estate solutions</li>
                            <li><strong>WMCI:</strong> Wealth management education and training</li>
                        </ul>
                    </div>

                    {/* User Obligations */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">3. User Obligations</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">You agree to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80">
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Use our services in compliance with applicable laws and regulations</li>
                            <li>Not share access credentials or allow unauthorized use</li>
                            <li>Report any security breaches or unauthorized access promptly</li>
                            <li>Comply with all applicable financial industry regulations</li>
                        </ul>
                    </div>

                    {/* Intellectual Property */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">4. Intellectual Property</h2>
                        <p className="text-primary/80 leading-relaxed">
                            All content, software, trademarks, and intellectual property related to our services are owned
                            by Acumen Strategy or our licensors. You are granted a limited, non-exclusive, non-transferable
                            license to use our services for your internal business purposes. You may not copy, modify,
                            distribute, or create derivative works without our prior written consent.
                        </p>
                    </div>

                    {/* Prohibited Activities */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">5. Prohibited Activities</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">You may not use our services for:</p>
                        <ul className="list-disc pl-6 space-y-2 text-primary/80">
                            <li>Any illegal or unauthorized purpose</li>
                            <li>Violating securities laws or financial regulations</li>
                            <li>Attempting to gain unauthorized access to our systems</li>
                            <li>Interfering with or disrupting our services</li>
                            <li>Transmitting malware, viruses, or malicious code</li>
                            <li>Reverse engineering or decompiling our software</li>
                            <li>Reselling or redistributing our services without authorization</li>
                        </ul>
                    </div>

                    {/* Confidentiality */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">6. Confidentiality</h2>
                        <p className="text-primary/80 leading-relaxed">
                            Both parties agree to maintain the confidentiality of proprietary information exchanged during
                            the course of using our services. This includes, but is not limited to, business strategies,
                            client data, and technical specifications. Confidentiality obligations survive the termination
                            of these terms for a period of three (3) years.
                        </p>
                    </div>

                    {/* Limitation of Liability */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">7. Limitation of Liability</h2>
                        <p className="text-primary/80 leading-relaxed">
                            To the fullest extent permitted by law, Acumen Strategy is not liable for indirect, incidental,
                            special, or consequential damages. Our total liability is limited to fees paid in the 12 months
                            preceding the claim. We are not responsible for any losses arising from investment decisions,
                            regulatory actions, or third-party services.
                        </p>
                    </div>

                    {/* Indemnification */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">8. Indemnification</h2>
                        <p className="text-primary/80 leading-relaxed">
                            You agree to indemnify and hold Acumen Strategy harmless from any claims, damages, or costs
                            arising from your violation of these terms, applicable laws, or third-party rights. This
                            includes any claims related to your use of our services in violation of financial regulations
                            or securities laws.
                        </p>
                    </div>

                    {/* Termination */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">9. Termination</h2>
                        <p className="text-primary/80 leading-relaxed">
                            Either party may terminate this agreement with 30 days written notice. We may suspend or
                            terminate your account immediately for non-compliance, violation of these terms, or
                            legal/regulatory requirements. Upon termination, you forfeit rights to use the services
                            and must destroy any confidential information in your possession.
                        </p>
                    </div>

                    {/* Dispute Resolution */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">10. Dispute Resolution</h2>
                        <p className="text-primary/80 leading-relaxed">
                            Disputes will be resolved through binding arbitration under Illinois law, excluding class
                            actions. Each party covers its own legal fees unless otherwise determined by the arbitrator.
                            Arbitration proceedings take place in Lake County, Illinois. For urgent matters, either party
                            may seek injunctive relief in state or federal courts.
                        </p>
                    </div>

                    {/* Governing Law */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">11. Governing Law</h2>
                        <p className="text-primary/80 leading-relaxed">
                            These Terms of Service are governed by and construed in accordance with the laws of the
                            State of Illinois, without regard to its conflict of law provisions. Any legal action or
                            proceeding arising under these terms will be brought exclusively in the courts located in
                            Lake County, Illinois.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-2xl font-display text-primary mb-4">12. Contact Information</h2>
                        <p className="text-primary/80 leading-relaxed mb-4">
                            For questions about these terms, contact us at:
                        </p>
                        <div className="bg-muted p-6 rounded-lg border border-primary/10">
                            <p className="font-semibold text-primary mb-2">Acumen Strategy Legal Team</p>
                            <p className="text-primary/70">Email: legal@acumen-strategy.com</p>
                            <p className="text-primary/70">Address: 272 Market Sq, Lake Forest, IL 60045</p>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
