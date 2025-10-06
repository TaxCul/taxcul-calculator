'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Maximize2, Minimize2, Bot, User } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Tax Assistant. I can help you with tax calculations, deductions, compliance questions, and optimization strategies. How can I assist you today?",
      sender: 'bot'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const toggleChatbot = () => setIsOpen(!isOpen)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userInput = input
    setMessages(prev => [...prev, { text: userInput, sender: 'user' }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatbot`,
        { query: userInput }
      )

      setMessages(prev => [
        ...prev,
        { text: res.data.response, sender: 'bot' },
      ])
    } catch (err) {
      console.error('Chatbot Error:', err)
      setMessages(prev => [
        ...prev,
        { 
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or check your internet connection.", 
          sender: 'bot' 
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const quickQuestions = [
    "What are tax-deductible expenses?",
    "How do I calculate capital gains tax?",
    "What's the current corporate tax rate?",
    "How can I reduce my tax liability?"
  ]

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-lime-400 to-lime-500 
                   rounded-full shadow-2xl shadow-lime-500/25 hover:shadow-lime-500/40 
                   transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-gray-900" />
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-gray-900"
            />
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed z-50 ${isExpanded 
              ? 'inset-4 md:inset-20 bg-gray-900 rounded-2xl' 
              : 'bottom-24 right-6 w-96 h-[475px]'
            }`}
          >
            <div className={`flex flex-col bg-gray-900 border border-lime-400/50 rounded-2xl 
                           shadow-2xl h-full ${isExpanded ? 'rounded-2xl' : 'rounded-2xl'}`}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 
                            rounded-t-2xl border-b border-lime-400/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lime-400 rounded-lg">
                    <Bot className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lime-400">Tax Assistant</h3>
                    <p className="text-xs text-gray-400">AI-powered tax guidance</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleExpand}
                    className="p-2 text-gray-400 hover:text-lime-400 transition-colors"
                  >
                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={toggleChatbot}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900/50">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === 'user' 
                        ? 'bg-lime-400 text-gray-900' 
                        : 'bg-gray-700 text-lime-400'
                    }`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-lime-400 text-gray-900 rounded-br-none'
                        : 'bg-gray-800 text-white rounded-bl-none border border-gray-700'
                    } break-words overflow-hidden`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap overflow-wrap-anywhere word-break-break-word">
                        {msg.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <Bot size={16} className="text-lime-400" />
                    </div>
                    <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-700">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Questions */}
                {messages.length <= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-4 border-t border-gray-700"
                  >
                    <p className="text-xs text-gray-400 mb-3">QUICK QUESTIONS</p>
                    <div className="grid grid-cols-1 gap-2">
                      {quickQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(question)}
                          className="text-left p-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg 
                                   text-gray-300 hover:text-lime-300 transition-all duration-200 
                                   border border-gray-700 hover:border-lime-400/30"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t rounded-b-2xl border-gray-700 bg-gray-900">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about taxes, deductions, compliance..."
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl
                             text-white placeholder-gray-400 focus:outline-none focus:border-lime-400
                             focus:ring-2 focus:ring-lime-400 focus:ring-opacity-50 transition-all"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="px-4 py-3 bg-lime-400 text-gray-900 rounded-xl hover:bg-lime-500 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-all
                             flex items-center gap-2 font-medium"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by AI • Provides general guidance only
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot