'use client'

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LabelList,
} from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const COLORS = ["#84cc16", "#f97316", "#60a5fa", "#a78bfa", "#f472b6"];

function cleanAIText(text) {
    if (!text) return "";
    return text
      .replace(/\\\[|\\\]/g, "")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\times/g, "×")
      .replace(/\s+/g, " ")
      .trim();
  }

/* ---------- Shared UI Components ---------- */
const ActionButton = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-gradient-to-r from-lime-400 to-lime-500 
               text-gray-900 px-5 py-2 rounded-lg font-semibold 
               hover:from-lime-300 hover:to-lime-400 transition disabled:opacity-50"
  >
    {children}
  </button>
);

const InputField = ({ label, value, onChange, type = "number", className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 
                 focus:border-lime-400 focus:ring focus:ring-lime-400/40 outline-none"
    />
  </div>
);

/* ---------- Main Page ---------- */
export default function TaxPlanningPage() {
  const [activeTab, setActiveTab] = useState("profit-loss");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [aiHistory, setAIHistory] = useState([]);
  
  // Comprehensive form state matching Excel structure
  const [formState, setFormState] = useState({
    // Profit and Loss
    sales: "",
    otherTradingIncome: "",
    costOfGoodsSold: "",
    advertisingMarketing: "",
    trainingEvent: "",
    automobileExpense: "",
    vehicleInsurance: "",
    managementMileage: "",
    staffMileage: "",
    fuelExpense: "",
    vehicleMaintenance: "",
    bankCharges: "",
    imtt: "",
    salaries: "",
    consultantExpense: "",
    accountingFees: "",
    equipmentRental: "",
    finesPenalties: "",
    itInternet: "",
    janitorial: "",
    warehouse: "",
    cottage: "",
    mealsEntertainment: "",
    officeSupplies: "",
    otherExpenses: "",
    rentExpense: "",
    
    // Tax Computation
    dividendReceived: "",
    capitalReceipts: "",
    profitOnSale: "",
    interestFinancial: "",
    depreciation: "",
    disallowableSubscriptions: "",
    disallowableLegal: "",
    finesPenaltiesTax: "",
    donations: "",
    recoupment: "",
    incomeReceivedAdvance: "",
    doubtfulDebts: "",
    dividendsNet: "",
    
    // Capital Allowance
    motorVehicles: "",
    moveableAssets: "",
    commercialBuildings: "",
    industrialBuildings: "",
    leaseImprovements: "",
  });

  const handleChange = (k) => (e) =>
    setFormState((s) => ({ ...s, [k]: e.target.value }));

  const callApi = async (endpoint, payload) => {
    const url = `${API_BASE}${endpoint}`;
    const res = await axios.post(url, payload);
    return res.data;
  };

  function buildContextMessage(type, inputs, result) {
    const fmt = (v) =>
      typeof v === "number"
        ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : v;

    if (type === "comprehensive") {
      return `Comprehensive Corporate Tax Calculation for Zimbabwe. 
      Inputs: Sales=${fmt(inputs.sales)}, COGS=${fmt(inputs.costOfGoodsSold)}, Expenses=${fmt(inputs.totalExpenses)}. 
      Result: Taxable Income=${fmt(result.taxableIncome)}, Tax=${fmt(result.taxDue)}, AIDS levy=${fmt(result.aidsLevy)}. 
      Please explain in the Zimbabwean context, under 160 words, and suggest tax optimization strategies.`;
    }
    return `Tax calculation summary for Zimbabwe: Inputs ${JSON.stringify(
      inputs
    )}, Result ${JSON.stringify(
      result
    )}. Provide guidance on deductions or optimization in Zimbabwean context, ≤160 words.`;
  }

  async function sendToAI(message) {
    try {
      const res = await axios.post(`${API_BASE}/chatbot`, { query: message });
      return res.data?.response ?? "(no response)";
    } catch (err) {
      return "(assistant error)";
    }
  }

  function pushAIHistory(question, answer) {
    setAIHistory((h) => [{ q: question, a: answer }, ...h].slice(0, 50));
  }

  // Local calculation fallback
  const calculateComprehensiveTaxLocal = (payload) => {
    const { profitLoss, taxComputation, capitalAllowance } = payload;
    
    // Calculate Gross Profit
    const sales = parseFloat(profitLoss?.sales) || 0;
    const otherTradingIncome = parseFloat(profitLoss?.otherTradingIncome) || 0;
    const costOfGoodsSold = parseFloat(profitLoss?.costOfGoodsSold) || 0;
    
    const grossProfit = (sales + otherTradingIncome) - costOfGoodsSold;
    
    // Calculate Operating Profit
    let totalOperatingExpenses = 0;
    if (profitLoss?.operatingExpenses) {
      totalOperatingExpenses = Object.values(profitLoss.operatingExpenses).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);
    }
    
    // Add individual expenses
    totalOperatingExpenses += parseFloat(profitLoss?.advertisingMarketing) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.trainingEvent) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.bankCharges) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.imtt) || 0;
    totalOperatingExpenses += parseFloat(profitLoss?.salaries) || 0;
    
    const operatingProfit = grossProfit - totalOperatingExpenses;
    
    // Tax Computation
    let totalNonTaxableIncome = 0;
    if (taxComputation?.nonTaxableIncome) {
      totalNonTaxableIncome = Object.values(taxComputation.nonTaxableIncome).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);
    }
    
    let totalNonDeductibleExpenses = 0;
    if (taxComputation?.nonDeductibleExpenses) {
      totalNonDeductibleExpenses = Object.values(taxComputation.nonDeductibleExpenses).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);
    }
    
    let taxableIncome = operatingProfit - totalNonTaxableIncome + totalNonDeductibleExpenses;
    
    // Apply capital allowances
    let totalCapitalAllowance = 0;
    if (capitalAllowance) {
      totalCapitalAllowance = Object.values(capitalAllowance).reduce((sum, val) => {
        return sum + (parseFloat(val) || 0);
      }, 0);
    }
    taxableIncome -= totalCapitalAllowance;
    
    // Ensure taxable income is not negative
    taxableIncome = Math.max(0, taxableIncome);
    
    // Calculate taxes
    const taxDue = taxableIncome * 0.25; // 25% corporate tax
    const aidsLevy = taxDue * 0.03; // 3% AIDS levy
    const totalTax = taxDue + aidsLevy;
    
    return {
      grossProfit,
      operatingProfit,
      taxableIncome,
      taxDue,
      aidsLevy,
      totalTax,
      costOfGoodsSold,
      operatingExpenses: totalOperatingExpenses,
      nonDeductibleExpenses: totalNonDeductibleExpenses,
      capitalAllowances: totalCapitalAllowance
    };
  };

  // Main calculation function
  const calculateComprehensiveTax = async () => {
    setLoading(true);
    try {
      const payload = {
        profitLoss: {
          sales: parseFloat(formState.sales) || 0,
          otherTradingIncome: parseFloat(formState.otherTradingIncome) || 0,
          costOfGoodsSold: parseFloat(formState.costOfGoodsSold) || 0,
          operatingExpenses: {
            advertisingMarketing: parseFloat(formState.advertisingMarketing) || 0,
            trainingEvent: parseFloat(formState.trainingEvent) || 0,
            bankCharges: parseFloat(formState.bankCharges) || 0,
            imtt: parseFloat(formState.imtt) || 0,
            salaries: parseFloat(formState.salaries) || 0,
          }
        },
        taxComputation: {
          nonTaxableIncome: {
            dividendReceived: parseFloat(formState.dividendReceived) || 0,
            capitalReceipts: parseFloat(formState.capitalReceipts) || 0,
            profitOnSale: parseFloat(formState.profitOnSale) || 0,
            interestFinancial: parseFloat(formState.interestFinancial) || 0,
          },
          nonDeductibleExpenses: {
            depreciation: parseFloat(formState.depreciation) || 0,
            disallowableSubscriptions: parseFloat(formState.disallowableSubscriptions) || 0,
            finesPenalties: parseFloat(formState.finesPenaltiesTax) || 0,
            donations: parseFloat(formState.donations) || 0,
          }
        },
        capitalAllowance: {
          motorVehicles: parseFloat(formState.motorVehicles) || 0,
          moveableAssets: parseFloat(formState.moveableAssets) || 0,
          commercialBuildings: parseFloat(formState.commercialBuildings) || 0,
          industrialBuildings: parseFloat(formState.industrialBuildings) || 0,
          leaseImprovements: parseFloat(formState.leaseImprovements) || 0,
        }
      };
      
      let data;
      try {
        // Try to call the API first
        data = await callApi("/calculate/comprehensive-corporate-tax", payload);
      } catch (apiError) {
        console.log("API call failed, using local calculation:", apiError);
        // If API fails, use local calculation
        data = calculateComprehensiveTaxLocal(payload);
      }
      
      setResults((r) => ({ ...r, comprehensive: data }));
      
      const summary = buildContextMessage("comprehensive", payload, data);
      const aiReply = await sendToAI(summary);
      pushAIHistory(summary, aiReply);
      
      setResults((r) => ({
        ...r,
        comprehensive: { ...data, aiExplanation: aiReply },
      }));
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-400 mt-4 mb-4">
            Comprehensive Tax Planning
          </h1>
          <p className="text-gray-300 mt-2">
            Professional tax computation mirroring QPD Income Tax format
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Calculator */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              {/* Fixed Calculate Button - Always Visible */}
              <div className="mb-6 p-4 bg-gradient-to-r from-lime-900/30 to-green-900/30 rounded-lg border border-lime-700/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-lime-300">Ready to Calculate?</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Fill in data across all tabs, then click Calculate to see your comprehensive tax results
                    </p>
                  </div>
                  <ActionButton 
                    onClick={calculateComprehensiveTax} 
                    disabled={loading}
                    className="whitespace-nowrap"
                  >
                    {loading ? "🔄 Calculating..." : "🚀 Calculate Comprehensive Tax"}
                  </ActionButton>
                </div>
              </div>

              <nav className="flex gap-2 mb-6 flex-wrap">
                {[
                  ["profit-loss", "Profit & Loss"],
                  ["tax-computation", "Tax Computation"],
                  ["capital-allowance", "Capital Allowance"],
                  ["quick-calc", "Quick Calc"],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setActiveTab(k)}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      activeTab === k
                        ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/25"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* Tab Instructions */}
              <div className="mb-6">
                {activeTab === "profit-loss" && (
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
                    <p className="text-sm text-blue-300">
                      💡 <strong>Profit & Loss Data:</strong> Enter your business income and expenses. This forms the foundation for your tax calculation.
                    </p>
                  </div>
                )}
                {activeTab === "tax-computation" && (
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700/30">
                    <p className="text-sm text-purple-300">
                      💡 <strong>Tax Adjustments:</strong> Add non-taxable income and non-deductible expenses. These adjust your accounting profit to arrive at taxable income.
                    </p>
                  </div>
                )}
                {activeTab === "capital-allowance" && (
                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30">
                    <p className="text-sm text-green-300">
                      💡 <strong>Capital Allowances:</strong> Enter asset values to claim tax deductions. These reduce your taxable income.
                    </p>
                  </div>
                )}
                {activeTab === "quick-calc" && (
                  <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700/30">
                    <p className="text-sm text-orange-300">
                      💡 <strong>Quick Calculation:</strong> Simplified version for quick estimates. Use when you don't need detailed breakdowns.
                    </p>
                  </div>
                )}
              </div>

              {/* Profit & Loss Form */}
              {activeTab === "profit-loss" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400">Operating Income</h3>
                    <InputField
                      label="Sales"
                      value={formState.sales}
                      onChange={handleChange("sales")}
                    />
                    <InputField
                      label="Other Trading Income"
                      value={formState.otherTradingIncome}
                      onChange={handleChange("otherTradingIncome")}
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400 mt-4">Cost of Goods Sold</h3>
                    <InputField
                      label="Cost of Goods Sold"
                      value={formState.costOfGoodsSold}
                      onChange={handleChange("costOfGoodsSold")}
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400 mt-4">Operating Expenses</h3>
                    <InputField
                      label="Advertising & Marketing"
                      value={formState.advertisingMarketing}
                      onChange={handleChange("advertisingMarketing")}
                    />
                    <InputField
                      label="Training Event"
                      value={formState.trainingEvent}
                      onChange={handleChange("trainingEvent")}
                    />
                    <InputField
                      label="Bank Charges"
                      value={formState.bankCharges}
                      onChange={handleChange("bankCharges")}
                    />
                    <InputField
                      label="IMTT"
                      value={formState.imtt}
                      onChange={handleChange("imtt")}
                    />
                    <InputField
                      label="Salaries"
                      value={formState.salaries}
                      onChange={handleChange("salaries")}
                    />
                  </div>
                </div>
              )}

              {/* Tax Computation Form */}
              {activeTab === "tax-computation" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400">Non-Taxable Income</h3>
                    <InputField
                      label="Dividend Received"
                      value={formState.dividendReceived}
                      onChange={handleChange("dividendReceived")}
                    />
                    <InputField
                      label="Capital Receipts"
                      value={formState.capitalReceipts}
                      onChange={handleChange("capitalReceipts")}
                    />
                    <InputField
                      label="Profit on Sale of Assets"
                      value={formState.profitOnSale}
                      onChange={handleChange("profitOnSale")}
                    />
                    <InputField
                      label="Interest from Financial Institution"
                      value={formState.interestFinancial}
                      onChange={handleChange("interestFinancial")}
                    />
                    
                    <h3 className="md:col-span-2 text-lg font-semibold text-lime-400 mt-4">Non-Deductible Expenses</h3>
                    <InputField
                      label="Depreciation"
                      value={formState.depreciation}
                      onChange={handleChange("depreciation")}
                    />
                    <InputField
                      label="Disallowable Subscriptions"
                      value={formState.disallowableSubscriptions}
                      onChange={handleChange("disallowableSubscriptions")}
                    />
                    <InputField
                      label="Fines & Penalties"
                      value={formState.finesPenaltiesTax}
                      onChange={handleChange("finesPenaltiesTax")}
                    />
                    <InputField
                      label="Donations"
                      value={formState.donations}
                      onChange={handleChange("donations")}
                    />
                  </div>
                </div>
              )}

              {/* Capital Allowance Form */}
              {activeTab === "capital-allowance" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Motor Vehicles"
                      value={formState.motorVehicles}
                      onChange={handleChange("motorVehicles")}
                    />
                    <InputField
                      label="Moveable Assets"
                      value={formState.moveableAssets}
                      onChange={handleChange("moveableAssets")}
                    />
                    <InputField
                      label="Commercial Buildings"
                      value={formState.commercialBuildings}
                      onChange={handleChange("commercialBuildings")}
                    />
                    <InputField
                      label="Industrial Buildings"
                      value={formState.industrialBuildings}
                      onChange={handleChange("industrialBuildings")}
                    />
                    <InputField
                      label="Lease Improvements"
                      value={formState.leaseImprovements}
                      onChange={handleChange("leaseImprovements")}
                    />
                  </div>
                </div>
              )}

              {/* Quick Calculation */}
              {activeTab === "quick-calc" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Gross Profit"
                      value={formState.sales}
                      onChange={handleChange("sales")}
                    />
                    <InputField
                      label="Total Expenses"
                      value={formState.costOfGoodsSold}
                      onChange={handleChange("costOfGoodsSold")}
                    />
                    <InputField
                      label="Non-Taxable Income"
                      value={formState.otherTradingIncome}
                      onChange={handleChange("otherTradingIncome")}
                    />
                    <InputField
                      label="Non-Deductible Expenses"
                      value={formState.imtt}
                      onChange={handleChange("imtt")}
                    />
                  </div>
                </div>
              )}

              {/* Results Display */}
              {results.comprehensive && (
                <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-lime-700/30">
                  <h3 className="text-xl font-semibold text-lime-400 mb-4 flex items-center gap-2">
                    <span>📊</span> Tax Computation Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">Taxable Income</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.taxableIncome || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">Tax @ 25%</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.taxDue || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">AIDS Levy @ 3%</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.aidsLevy || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-gray-400">Total Tax</div>
                      <div className="text-lime-400 font-medium text-lg">${(results.comprehensive.totalTax || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {results.comprehensive.aiExplanation && (
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h4 className="text-md font-semibold text-lime-300 mb-2">AI Tax Guidance</h4>
                      <div className="text-sm text-gray-200 leading-relaxed">
                        {cleanAIText(results.comprehensive.aiExplanation)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Visualization */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                Tax Breakdown Visualization
              </h3>
              <div className="h-64">
                <ComprehensiveChartPanel results={results} />
              </div>
              <div className="mt-4 flex gap-3">
                <ActionButton onClick={() => exportComprehensivePlanToExcel(results, formState)}>
                  Export Full Tax Plan
                </ActionButton>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Print Report
                </button>
              </div>
            </div>

            {/* Excel Uploader */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                Import QPD Excel Template
              </h3>
              <ExcelUploader onParse={(data) => handleExcelImport(data)} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                Tax Summary
              </h3>
              <ComprehensiveSummaryPanel results={results} />
              <div className="mt-4 w-full max-w-full">
                <ChatAssistant
                  aiHistory={aiHistory}
                  setAIHistory={setAIHistory}
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-lime-400 mb-3">
                QPD Tax Tips
              </h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Use capital allowances to reduce taxable income</li>
                <li>• IMTT is 50% deductible for tax purposes</li>
                <li>• Keep detailed records of all business expenses</li>
                <li>• Consider timing of asset purchases for optimal allowances</li>
              </ul>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );

  function handleExcelImport(data) {
    // Map Excel data to form state
    if (data.profitLoss) {
      setFormState(prev => ({
        ...prev,
        sales: data.profitLoss.sales || "",
        otherTradingIncome: data.profitLoss.otherTradingIncome || "",
        costOfGoodsSold: data.profitLoss.costOfGoodsSold || "",
        // Map other fields...
      }));
    }
  }
}

function ComprehensiveChartPanel({ results }) {
  if (!results.comprehensive) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-900 rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-lime-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-sm">No comprehensive tax data yet.</p>
        <p className="text-xs text-gray-500">
          Fill in the forms and calculate to generate charts.
        </p>
      </div>
    );
  }

  const { comprehensive } = results;
  
  const taxBreakdownData = [
    { name: 'Income Tax', value: comprehensive.taxDue || 0 },
    { name: 'AIDS Levy', value: comprehensive.aidsLevy || 0 },
    { name: 'Previous Loss', value: Math.abs(comprehensive.lossBroughtForward) || 0 },
  ];

  const expenseData = [
    { name: 'COGS', value: comprehensive.costOfGoodsSold || 0 },
    { name: 'Operating Exp', value: comprehensive.operatingExpenses || 0 },
    { name: 'Non-Deductible', value: comprehensive.nonDeductibleExpenses || 0 },
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4">
      {/* Tax Breakdown Pie Chart */}
      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={taxBreakdownData}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              label
              animationDuration={800}
            >
              {taxBreakdownData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Expenses Bar Chart */}
      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height={235}>
          <BarChart data={expenseData} animationDuration={800}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
            <Legend verticalAlign="top" />
            <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#e5e7eb" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ComprehensiveSummaryPanel({ results }) {
  if (!results.comprehensive) {
    return (
      <div className="text-gray-400 text-sm">
        Complete the tax computation form to see summary
      </div>
    );
  }

  const { comprehensive } = results;
  
  const items = [
    { label: "Gross Profit", value: comprehensive.grossProfit || 0 },
    { label: "Operating Profit", value: comprehensive.operatingProfit || 0 },
    { label: "Taxable Income", value: comprehensive.taxableIncome || 0 },
    { label: "Total Tax", value: comprehensive.totalTax || 0 },
  ];
  
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm text-gray-300">
            <span>{item.label}</span>
            <span className="text-lime-400 font-medium">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded">
            <div
              className="h-2 bg-lime-400 rounded"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatAssistant({ aiHistory, setAIHistory }) {
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!query.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(`${API_BASE}/chatbot`, { query });
      const assistant = res.data.response ?? "(no response)";
      setAIHistory((h) => [{ q: query, a: assistant }, ...h].slice(0, 50));
      setQuery("");
    } catch {
      setAIHistory((h) => [
        { q: query, a: "(assistant error)" },
        ...h,
      ].slice(0, 50));
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about tax optimization..."
          className="flex-1 p-2 text-sm rounded-md bg-gray-700 text-white border border-gray-600 focus:border-lime-400 outline-none"
        />
        <button
          onClick={send}
          disabled={sending}
          className="px-3 text-sm py-2 bg-lime-400 text-gray-900 rounded-md font-medium hover:bg-lime-300 transition"
        >
          {sending ? "..." : "Ask"}
        </button>
      </div>

      <div className="mt-3 max-h-40 overflow-auto space-y-2">
        {aiHistory.map((h, i) => (
          <div key={i} className="p-2 bg-gray-900 rounded-md">
            <div className="text-sm text-gray-300">Q: {h.q}</div>
            <div className="text-sm text-lime-400 mt-1">A: {cleanAIText(h.a)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExcelUploader({ onParse }) {
  const fileRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file.name);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      
      // Parse different sheets like the QPD template
      const profitLossSheet = workbook.Sheets['Profit and Loss'];
      const taxComputationSheet = workbook.Sheets['Tax Computation'];
      const capitalAllowanceSheet = workbook.Sheets['Capital Allowance Schedule'];
      
      const parsedData = {
        profitLoss: profitLossSheet ? XLSX.utils.sheet_to_json(profitLossSheet, { defval: "" }) : [],
        taxComputation: taxComputationSheet ? XLSX.utils.sheet_to_json(taxComputationSheet, { defval: "" }) : [],
        capitalAllowance: capitalAllowanceSheet ? XLSX.utils.sheet_to_json(capitalAllowanceSheet, { defval: "" }) : [],
      };
      
      onParse?.(parsedData);
      
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      alert("Error parsing Excel file. Please check the format.");
    }
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        className="block w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-md 
                   file:border-0 file:text-sm file:font-semibold 
                   file:bg-lime-400 file:text-gray-900 hover:file:bg-lime-300"
      />
      {uploadedFile && (
        <div className="mt-2 text-sm text-lime-400">
          Uploaded: {uploadedFile}
        </div>
      )}
      <div className="mt-2 text-xs text-gray-400">
        Upload QPD Income Tax Computation Excel template
      </div>
    </div>
  );
}

/* Enhanced Export to Excel matching QPD format */
function exportComprehensivePlanToExcel(results, formState) {
  const XLSX = require("xlsx");
  
  // Create workbook with multiple sheets like the QPD template
  const wb = XLSX.utils.book_new();
  
  // Profit and Loss Sheet
  const profitLossData = [
    ['Account', 'Actual Profit and Loss'],
    ['Operating Income', ''],
    ['Sales', formState.sales || 0],
    ['Other Trading Income', formState.otherTradingIncome || 0],
    ['Total Operating Income', (parseFloat(formState.sales) || 0) + (parseFloat(formState.otherTradingIncome) || 0)],
    [''],
    ['Cost of Goods Sold', ''],
    ['Cost of Goods Sold', formState.costOfGoodsSold || 0],
    ['Total COGS', formState.costOfGoodsSold || 0],
    [''],
    ['Gross Profit', ((parseFloat(formState.sales) || 0) + (parseFloat(formState.otherTradingIncome) || 0)) - (parseFloat(formState.costOfGoodsSold) || 0)],
  ];
  
  const ws1 = XLSX.utils.aoa_to_sheet(profitLossData);
  XLSX.utils.book_append_sheet(wb, ws1, "Profit and Loss");
  
  // Tax Computation Sheet
  const taxComputationData = [
    ['', '', '', '2025 $'],
    ['Estimated Profit as per financial statements', '', '', results.comprehensive?.operatingProfit || 0],
    [''],
    ['A. Less Non taxable income', '', '', ''],
    ['Dividend received', '', formState.dividendReceived || 0, ''],
    ['Capital receipts', '', formState.capitalReceipts || 0, ''],
    ['Profit on sale of assets', '', formState.profitOnSale || 0, ''],
    ['Interest from financial institution', '', formState.interestFinancial || 0, ''],
    ['Profit after non taxable receipts', '', '', results.comprehensive?.taxableIncome || 0],
  ];
  
  const ws2 = XLSX.utils.aoa_to_sheet(taxComputationData);
  XLSX.utils.book_append_sheet(wb, ws2, "Tax Computation");
  
  // Results Summary Sheet
  const summaryData = [
    ['Tax Planning Summary', ''],
    ['Gross Profit', results.comprehensive?.grossProfit || 0],
    ['Operating Profit', results.comprehensive?.operatingProfit || 0],
    ['Taxable Income', results.comprehensive?.taxableIncome || 0],
    ['Tax @ 25%', results.comprehensive?.taxDue || 0],
    ['AIDS Levy @ 3%', results.comprehensive?.aidsLevy || 0],
    ['Total Tax Liability', results.comprehensive?.totalTax || 0],
    [''],
    ['Generated on', new Date().toLocaleDateString()],
  ];
  
  const ws3 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws3, "Summary");
  
  XLSX.writeFile(wb, `qpd-tax-plan-${new Date().toISOString().slice(0, 10)}.xlsx`);
}