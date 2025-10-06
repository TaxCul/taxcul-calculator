'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, AlertTriangle, Shield, UserCheck, CreditCard, Copyright, Globe } from 'lucide-react'

export default function TermsAndConditions() {
  const effectiveDate = "December 1, 2024"
  const companyName = "TaxPortal"
  const companyAddress = "123 Tax Street, Harare, Zimbabwe"
  const contactEmail = "legal@taxportal.com"

  const sections = [
    {
      icon: UserCheck,
      title: "Acceptance of Terms",
      content: `By accessing and using ${companyName}'s tax calculation services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must immediately discontinue use of our services.`
    },
    {
      icon: Scale,
      title: "Service Description",
      content: `${companyName} provides AI-powered tax calculation tools, tax planning assistance, and related financial computation services. Our platform is designed to assist with tax calculations but does not replace professional tax advice. Users are responsible for verifying calculations with qualified tax professionals.`
    },
    {
      icon: CreditCard,
      title: "User Accounts & Registration",
      content: `To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.`
    },
    {
      icon: Shield,
      title: "User Responsibilities",
      content: `You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services to engage in any fraudulent, illegal, or unauthorized activities. You are solely responsible for the accuracy of the information you provide for tax calculations.`
    },
    {
      icon: Copyright,
      title: "Intellectual Property",
      content: `All content, features, and functionality available on ${companyName}, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of ${companyName} and are protected by international copyright, trademark, and other intellectual property laws.`
    },
    {
      icon: Globe,
      title: "Prohibited Activities",
      content: `You may not: attempt to reverse engineer any software; use the service for any illegal purpose; harass, abuse, or harm another person; upload viruses or malicious code; interfere with the proper working of the service; or attempt to bypass any security measures.`
    }
  ]

  const importantPoints = [
    {
      icon: AlertTriangle,
      title: "No Professional Tax Advice",
      description: "Our services provide calculation tools only and do not constitute professional tax advice. Always consult with a qualified tax professional for specific tax situations."
    },
    {
      icon: Shield,
      title: "Accuracy Disclaimer",
      description: "While we strive for accuracy, tax laws change frequently. We are not responsible for calculation errors resulting from outdated tax rates or legislative changes."
    },
    {
      icon: CreditCard,
      title: "Service Availability",
      description: "We do not guarantee uninterrupted service availability. Maintenance, updates, or unforeseen circumstances may temporarily disrupt access to our services."
    }
  ]

  const legalSections = [
    {
      title: "Limitation of Liability",
      content: `To the fullest extent permitted by applicable law, ${companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.`
    },
    {
      title: "Indemnification",
      content: `You agree to defend, indemnify, and hold harmless ${companyName} and its affiliates, officers, agents, and employees from and against any claims, disputes, demands, liabilities, damages, losses, and costs arising from your violation of these Terms or your use of the services.`
    },
    {
      title: "Termination",
      content: `We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.`
    },
    {
      title: "Governing Law",
      content: `These Terms shall be governed and construed in accordance with the laws of Zimbabwe, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Harare, Zimbabwe.`
    },
    {
      title: "Changes to Terms",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.`
    },
    {
      title: "Contact Information",
      content: `For any questions about these Terms and Conditions, please contact us at ${contactEmail} or write to us at ${companyAddress}.`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mt-4 gap-4 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-2xl">
              <FileText className="w-8 h-8 text-lime-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-lime-400">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Please read these terms carefully before using our tax calculation services. 
            These terms govern your access to and use of {companyName}.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm 
                         px-4 py-2 rounded-full text-gray-300 text-sm border border-gray-700">
            <span>Effective Date:</span>
            <span className="text-lime-400 font-medium">{effectiveDate}</span>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-orange-500/10 border border-orange-400/30 rounded-3xl p-8 mb-12"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-orange-400 mb-3">Important Legal Notice</h2>
              <p className="text-orange-300 leading-relaxed">
                {companyName} provides tax calculation tools for informational purposes only. 
                Our services do not constitute professional tax advice, legal advice, or financial advice. 
                You should consult with qualified tax professionals for specific tax situations. 
                By using our services, you acknowledge this important distinction.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Points Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {importantPoints.map((point, index) => {
            const IconComponent = point.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 text-center"
              >
                <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-lime-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Terms Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-lime-400/10 rounded-xl flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-lime-400 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.section>
            )
          })}
        </div>

        {/* Legal Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-lime-400 text-center mb-8">
            Additional Legal Provisions
          </h2>

          {legalSections.map((section, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {section.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Payment Terms Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mt-12"
        >
          <h2 className="text-2xl font-bold text-lime-400 mb-6">Payment Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Free Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Basic tax calculations available at no cost</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Standard features accessible without payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                  <span>No hidden fees for basic functionality</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Premium Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Clear pricing for advanced features</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Automatic renewal with opt-out option</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Refund policy as per Zimbabwean consumer law</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Data Usage Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-lime-400 mb-6">Data & Privacy</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Your use of {companyName} is also governed by our Privacy Policy, which explains how we collect, 
              use, and protect your personal information. By using our services, you consent to the practices 
              described in our Privacy Policy.
            </p>
            <p>
              We implement reasonable security measures to protect your data, but cannot guarantee absolute 
              security. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </div>
        </motion.div>

        {/* Final Acknowledgment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16 pt-8 border-t border-gray-700/50"
        >
          <div className="bg-lime-400/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <FileText className="w-8 h-8 text-lime-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-lime-400 mb-2">
              Agreement to Terms
            </h3>
            <p className="text-gray-300 text-sm">
              By accessing or using {companyName}'s services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and Conditions. If you do not agree 
              to these terms, please discontinue use of our services immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}