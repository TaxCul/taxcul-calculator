"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import { Search, BookOpen, Calculator, ShieldCheck } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqCategories = {
    all: { name: "All Questions", icon: BookOpen },
    individual: { name: "Individual Tax", icon: Calculator },
    business: { name: "Business Tax", icon: ShieldCheck },
    vat: { name: "VAT", icon: Calculator },
    compliance: { name: "Compliance", icon: ShieldCheck }
  };

  const faqs = [
    {
      question: "What is VAT in Zimbabwe and how does it work?",
      answer: "Value Added Tax (VAT) in Zimbabwe is a consumption tax levied on the supply of goods and services at a standard rate of 14.5%. It applies to most goods and services, with some exceptions for basic food items, medical services, and educational materials. Businesses with annual taxable supplies exceeding $60,000 must register for VAT.",
      category: "vat"
    },
    {
      question: "How is withholding tax calculated for different types of payments?",
      answer: "Withholding tax rates vary by payment type: 15% for royalties and fees to non-residents, 10% for contract payments, and 30% for payments to non-residents without tax clearance certificates. For residents, withholding tax applies to certain payments like interest and dividends at specified rates.",
      category: "business"
    },
    {
      question: "What are the current income tax rates for individuals in Zimbabwe?",
      answer: "Individual income tax in Zimbabwe follows a progressive tax bracket system: 0% on the first $10,000, 20% on income between $10,001 and $50,000, 25% on income between $50,001 and $100,000, and 30% on income above $100,000. These rates are subject to annual budget reviews.",
      category: "individual"
    },
    {
      question: "Are there any tax reliefs or deductions available for individuals?",
      answer: "Yes, individuals can claim deductions for medical expenses, pension contributions (up to $5,000 annually), insurance premiums, and certain educational expenses. There are also specific reliefs for disabled persons and additional dependents beyond the basic personal relief.",
      category: "individual"
    },
    {
      question: "When are corporate tax returns due in Zimbabwe?",
      answer: "Corporate tax returns are due within 4 months after the company's financial year-end. For companies with December year-ends, returns are due by April 30th. Quarterly provisional tax payments are required, with final balancing payments due with the annual return.",
      category: "business"
    },
    {
      question: "What records should businesses maintain for tax purposes?",
      answer: "Businesses must maintain: sales and purchase records, bank statements, payroll records, asset registers, VAT records, and supporting documents for all deductions claimed. Records should be kept for at least 6 years from the end of the tax year.",
      category: "compliance"
    },
    {
      question: "How does the tax amnesty program work?",
      answer: "Tax amnesty programs allow taxpayers to regularize their tax affairs without penalties. Typically, these programs require full disclosure of undeclared income and payment of principal taxes while waiving penalties and interest. Specific terms vary by amnesty period.",
      category: "compliance"
    },
    {
      question: "What are the penalties for late tax filing or payment?",
      answer: "Late filing attracts a penalty of $50 per month or 5% of the tax due, whichever is greater. Late payment incurs interest at 10% per annum plus a 10% penalty on the outstanding amount. Repeated offenses may lead to higher penalties.",
      category: "compliance"
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 bg-gradient-to-br from-gray-800/20 to-gray-900/40 rounded-3xl">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-lime-400/10 rounded-2xl">
              <HiQuestionMarkCircle className="w-8 h-8 text-lime-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-lime-400">
              FAQ Center
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get answers to common questions about Zimbabwean tax laws and calculations
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions about taxes, rates, deadlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/60 border border-gray-600 
                         rounded-2xl text-white placeholder-gray-400 focus:outline-none 
                         focus:border-lime-400 focus:ring-2 focus:ring-lime-400/50 
                         transition-all duration-300 backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {Object.entries(faqCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium 
                           transition-all duration-300 ${
                  activeCategory === key
                    ? 'bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/25'
                    : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/60 hover:text-white border border-gray-600/50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </motion.div>

        {/* Results Count */}
        {searchTerm && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mb-6"
          >
            Found {filteredFaqs.length} answer{filteredFaqs.length !== 1 ? 's' : ''} for "{searchTerm}"
          </motion.p>
        )}

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => {
              const isActive = activeIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/40 rounded-2xl border border-gray-700/50 
                             hover:border-lime-400/30 transition-all duration-300 
                             backdrop-blur-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-6 text-left 
                               hover:bg-gray-700/30 transition-all duration-300 group"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-lime-300 transition-colors">
                        {faq.question}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          faq.category === 'individual' ? 'bg-blue-500/20 text-blue-300' :
                          faq.category === 'business' ? 'bg-green-500/20 text-green-300' :
                          faq.category === 'vat' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-orange-500/20 text-orange-300'
                        }`}>
                          {faqCategories[faq.category]?.name}
                        </span>
                      </div>
                    </div>
                    <HiChevronDown
                      className={`w-6 h-6 text-lime-400 transform transition-transform duration-300 flex-shrink-0 ${
                        isActive ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-600/50 pt-4">
                            <p className="text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* No Results State */}
          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="p-4 bg-gray-800/40 rounded-2xl border border-gray-700/50">
                <HiQuestionMarkCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-400">
                  {searchTerm 
                    ? `No results found for "${searchTerm}". Try different keywords.`
                    : "No questions available in this category."
                  }
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 pt-8 border-t border-gray-700/50"
        >
          <p className="text-gray-400 mb-4">
            Still have questions?
          </p>
          <button className="px-6 py-3 bg-lime-400 text-gray-900 font-semibold rounded-xl 
                           hover:bg-lime-500 transition-all duration-300 shadow-lg 
                           hover:shadow-lime-400/25">
            Contact Tax Support
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;