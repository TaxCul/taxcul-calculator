'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Zap, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'

const TaxCalculatorPreview = () => {
  const [income, setIncome] = useState('')
  const [taxType, setTaxType] = useState('individual')
  const [taxDue, setTaxDue] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const taxRates = {
    individual: 0.25,
    corporate: 0.25,
    vat: 0.15,
    withholding: 0.15
  }

  const taxLabels = {
    individual: 'Individual Income Tax',
    corporate: 'Corporate Tax',
    vat: 'VAT',
    withholding: 'Withholding Tax'
  }

  const calculateTax = async () => {
    if (!income || parseFloat(income) <= 0) return
    
    setIsCalculating(true)
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const value = parseFloat(income)
    const rate = taxRates[taxType]
    const calculatedTax = Math.max(0, value * rate)
    
    setTaxDue(calculatedTax)
    setIsCalculating(false)
    setShowResult(true)
  }

  const resetCalculator = () => {
    setIncome('')
    setTaxDue(null)
    setShowResult(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateTax()
    }
  }

  // Auto-hide result after 8 seconds
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setShowResult(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [showResult])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-10 p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/80 rounded-3xl 
                 border border-lime-400/30 shadow-2xl hover:shadow-lime-400/10 
                 transition-all duration-500 max-w-md mx-auto backdrop-blur-sm"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-lime-400/10 rounded-2xl">
            <Calculator className="w-8 h-8 text-lime-400" />
          </div>
          <h2 className="text-3xl font-bold text-lime-400">
            Quick Tax Calc
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          Get instant tax estimates for different tax types
        </p>
      </div>

      {/* Tax Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Tax Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(taxLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTaxType(key)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                taxType === key
                  ? 'bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/25'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">$</span>
            </div>
            <input
              type="number"
              placeholder="Enter amount"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-4 bg-gray-700/50 border border-gray-600 
                         rounded-xl text-white placeholder-gray-400 focus:outline-none 
                         focus:border-lime-400 focus:ring-2 focus:ring-lime-400/50 
                         transition-all duration-300"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <motion.button
          onClick={calculateTax}
          disabled={!income || parseFloat(income) <= 0 || isCalculating}
          whileHover={{ scale: !income ? 1 : 1.02 }}
          whileTap={{ scale: !income ? 1 : 0.98 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 
                     flex items-center justify-center gap-3 ${
                       !income || parseFloat(income) <= 0
                         ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                         : 'bg-lime-400 text-gray-900 hover:bg-lime-500 shadow-lg hover:shadow-xl'
                     }`}
        >
          {isCalculating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Calculate Tax
            </>
          )}
        </motion.button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {showResult && taxDue !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 p-6 bg-gradient-to-r from-lime-400/10 to-green-400/5 
                       rounded-2xl border border-lime-400/20"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-lime-400" />
                <h3 className="text-lg font-semibold text-lime-400">
                  Tax Estimate
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tax Type:</span>
                  <span className="text-white font-medium">{taxLabels[taxType]}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tax Rate:</span>
                  <span className="text-lime-400 font-bold">
                    {(taxRates[taxType] * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">Tax Due:</span>
                    <span className="text-lime-400 font-bold text-xl">
                      ${taxDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={resetCalculator}
                className="mt-4 w-full py-2 px-4 bg-gray-700/50 hover:bg-gray-600/50 
                           text-gray-300 rounded-lg transition-all duration-300 
                           flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Calculate Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!income && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-lime-400 flex-shrink-0" />
            <p className="text-sm text-gray-400">
              Enter an amount above to calculate your tax estimate
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-lime-400" />
          <span className="text-sm font-medium text-lime-400">Quick Tip</span>
        </div>
        <p className="text-xs text-gray-400">
          Use our full calculators for detailed breakdowns, deductions, and AI-powered optimization suggestions.
        </p>
      </div>
    </motion.div>
  )
}

export default TaxCalculatorPreview