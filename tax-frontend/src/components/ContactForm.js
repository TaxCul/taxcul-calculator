'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, User, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'

// Move InputField component OUTSIDE to prevent recreation
const InputField = ({ label, icon: Icon, type = 'text', name, value, onChange, error, placeholder, required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full pl-10 pr-4 py-4 bg-gray-800/60 border rounded-2xl text-white 
                   placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300
                   ${error 
                     ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                     : 'border-gray-600 focus:border-lime-400 focus:ring-lime-400/50'
                   }`}
      />
    </div>
    {error && (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    )}
  </div>
)

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email Us',
      value: 'culverwell@culverwellvenge.com',
      description: 'We\'ll respond within 24 hours'
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: '+263 71 488 9981',
      description: 'Mon-Fri from 8AM to 5PM'
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'Harare, Zimbabwe',
      description: 'Zimbabwe'
    }
  ]

  const subjectOptions = [
    'Tax Calculation Help',
    'Technical Support',
    'Feature Request',
    'Partnership Inquiry',
    'General Question',
    'Bug Report'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/50 rounded-3xl">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/20 rounded-2xl">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-lime-400 mb-4">
              Message Sent!
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Thank you for reaching out! We've received your message and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-4 bg-lime-400 text-gray-900 font-semibold rounded-2xl 
                         hover:bg-lime-500 transition-all duration-300 shadow-lg 
                         hover:shadow-lime-400/25"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/50 rounded-3xl">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-lime-400 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about tax calculations? Our team is here to help you with any inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-lime-400 mb-6">
              Contact Information
            </h3>
            
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gray-800/40 rounded-2xl 
                             border border-gray-700/50 hover:border-lime-400/30 
                             transition-all duration-300"
                >
                  <div className="p-3 bg-lime-400/10 rounded-xl">
                    <IconComponent className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {method.label}
                    </h4>
                    <p className="text-lime-400 font-medium mb-1">
                      {method.value}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {method.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}

            {/* Quick Support Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20"
            >
              <h4 className="font-semibold text-blue-400 mb-2">
                Quick Support
              </h4>
              <p className="text-gray-300 text-sm">
                For urgent tax calculation issues, mention "Urgent" in your message and we'll prioritize your request.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  icon={User}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                  required
                />
                <InputField
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number (Optional)"
                  icon={Phone}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+263 XXX XXX XXX"
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 bg-gray-800/60 border rounded-2xl text-white 
                               focus:outline-none focus:ring-2 transition-all duration-300
                               ${errors.subject 
                                 ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                                 : 'border-gray-600 focus:border-lime-400 focus:ring-lime-400/50'
                               }`}
                  >
                    <option value="">Select a subject</option>
                    {subjectOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Message <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your tax calculation needs, questions, or issues..."
                    rows={6}
                    className={`w-full pl-10 pr-4 py-4 bg-gray-800/60 border rounded-2xl text-white 
                               placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300
                               ${errors.message 
                                 ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                                 : 'border-gray-600 focus:border-lime-400 focus:ring-lime-400/50'
                               }`}
                  />
                </div>
                {errors.message && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </div>
                )}
                <div className="text-right text-sm text-gray-400">
                  {formData.message.length}/5000 characters
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 
                           flex items-center justify-center gap-3 shadow-lg
                           ${isSubmitting 
                             ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                             : 'bg-lime-400 text-gray-900 hover:bg-lime-500 hover:shadow-lime-400/25'
                           }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}