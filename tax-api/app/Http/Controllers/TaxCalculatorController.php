<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaxRate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaxCalculatorController extends Controller
{
    public function calculateVATImportedServices(Request $request) {
        $value = $request->input('value');
        $isMarketValue = $request->input('isMarketValue', false); // Default to false
        $rate = $this->getTaxRate('VAT');
        $marketValue = $isMarketValue ? $value : max($value, $this->getMarketValue($value));
        $vat = $marketValue * $rate;

        return response()->json(['vat' => $vat]);
    }

    private function getMarketValue($value) {
        // Logic to determine market value based on other criteria if needed
        return $value; // Placeholder
    }

    public function calculateVATTaxableSupplies(Request $request) {
        $amount = $request->input('amount');
        $rate = $this->getTaxRate('VAT'); // Fetching VAT rate dynamically
        $vat = $amount * $rate;

        return response()->json(['vat' => $vat]);
    }

    public function calculateWithholdingTaxRoyalties(Request $request) {
        $value = $request->input('value');
        $dtaRate = $this->getTaxRate('Withholding_Royalties');
        $taxDue = $value * $dtaRate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateWithholdingTaxFees(Request $request) {
        $value = $request->input('value');
        $dtaRate = $this->getTaxRate('Withholding_Fees');
        $taxDue = $value * $dtaRate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateWithholdingTaxInterest(Request $request) {
        $value = $request->input('value');
        $dtaRate = $this->getTaxRate('Withholding_Interest');
        $taxDue = $value * $dtaRate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateWithholdingTaxTenders(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Withholding_Tenders'); // Fetching rate dynamically
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateCorporateIncomeTax(Request $request) {
        $profits = $request->input('profits');
        $deductions = $request->input('deductions', 0);
        $nonDeductible = $request->input('nonDeductible', 0); // e.g. fines, private expenses
        $recoupments = $request->input('recoupments', 0);     // recovered allowances

        $adjustedIncome = $profits - ($deductions - $nonDeductible) + $recoupments;
        $taxRate = $this->getTaxRate('Corporate_Income');
        $taxDue = $adjustedIncome * $taxRate;

        // AIDS Levy 3%
        $aidsLevy = $taxDue * 0.03;
        $totalTax = $taxDue + $aidsLevy;

        return response()->json([
            'taxableIncome' => $adjustedIncome,
            'taxDue' => $taxDue,
            'aidsLevy' => $aidsLevy,
            'totalTax' => $totalTax
        ]);
    }

    public function calculateIndividualIncomeTax(Request $request) {
        $grossIncome = $request->input('income');
        $exemptIncome = $request->input('exemptIncome', 0);
        $deductions = $request->input('deductions', 0);

        $taxableIncome = max(0, $grossIncome - $exemptIncome - $deductions);

        $bands = DB::table('paye_bands')->orderBy('min_income')->get();
        $taxDue = 0;

        foreach ($bands as $band) {
            $bandMax = $band->max_income ?? INF; // upper limit
            if ($taxableIncome >= $band->min_income && $taxableIncome <= $bandMax) {
                // Formula: (Income * Rate) - Deduct
                $taxDue = ($taxableIncome * $band->rate) - $band->deduct;
                break;
            }
        }

        // AIDS Levy 3%
        $aidsLevy = $taxDue * 0.03;
        $totalTax = $taxDue + $aidsLevy;

        return response()->json([
            'taxableIncome' => $taxableIncome,
            'taxDue' => $taxDue,
            'aidsLevy' => $aidsLevy,
            'totalTax' => $totalTax
        ]);
    }

    private function getTaxRate($category) {
        $taxRate = TaxRate::where('category', $category)->first();
        return $taxRate ? $taxRate->rate : 0; // Return the rate or 0 if not found
    }

    public function calculateCapitalAllowances(Request $request) {
        $qualifyingAssets = $request->input('qualifyingAssets');
        $allowanceRate = $request->input('allowanceRate', 0.10); // Default to 10%
        $totalAllowances = 0;

        foreach ($qualifyingAssets as $assetValue) {
            $totalAllowances += $assetValue * $allowanceRate;
        }

        return response()->json(['totalAllowances' => $totalAllowances]);
    }

    public function calculateVATDeferment(Request $request) {
        $equipmentValue = $request->input('equipmentValue');
        $threshold = $request->input('threshold', 10000); // Default threshold example
        return response()->json(['defermentDays' => ($equipmentValue >= $threshold) ? $this->getDefermentDays($equipmentValue) : 0]);
    }

    private function getDefermentDays($equipmentValue) {
        return 30; // Example
    }

    public function calculateTaxRelief(Request $request) {
        $taxableIncome = $request->input('taxableIncome');
        $reliefs = $request->input('reliefs', []);
        return response()->json(['taxableIncomeWithRelief' => $taxableIncome - array_sum($reliefs)]);
    }

    public function calculateTaxCredits(Request $request) {
        $taxableIncome = $request->input('taxableIncome');
        $credits = $request->input('credits', []);
        return response()->json(['taxableIncomeWithCredits' => $taxableIncome - array_sum($credits)]);
    }

    public function calculateAgricultureTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Agriculture');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateInsuranceTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Insurance');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateFinancialTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Financial');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculateHealthcareTax(Request $request) {
        $value = $request->input('value');
        $rate = $this->getTaxRate('Healthcare');
        $taxDue = $value * $rate;

        return response()->json(['taxDue' => $taxDue]);
    }

    public function calculatePAYE(Request $request) {
        // Retrieve input values
        $currentSalary = $request->input('currentSalary');
        $currentBonus = $request->input('currentBonus', 0);
        $irregularCommission = $request->input('irregularCommission', 0);
        $otherIrregularEarnings = $request->input('otherIrregularEarnings', 0);
        $exemptions = $request->input('exemptions', 0);
        $housingBenefit = $request->input('housingBenefit', 0);
        $vehicleBenefit = $request->input('vehicleBenefit', 0);
        $educationBenefit = $request->input('educationBenefit', 0);
        $nonTaxableEarnings = $request->input('nonTaxableEarnings', 0);
        $pensionContributions = $request->input('pensionContributions', 0);
        $nssaContributions = $request->input('nssaContributions', 0);
        $totalDeductions = $request->input('totalDeductions', 0);
        $medicalContributions = $request->input('medicalContributions', 0);
        $medicalExpenses = $request->input('medicalExpenses', 0);
        $credits = $request->input('credits', 0);
        $aidsLevy = $request->input('aidsLevy', 0);

        // Calculate total income
        $totalIncome = $currentSalary + $currentBonus + $irregularCommission + $otherIrregularEarnings + $housingBenefit + $vehicleBenefit + $educationBenefit;

        // Calculate taxable income
        $taxableIncome = $totalIncome - $exemptions - $nonTaxableEarnings - $pensionContributions - $nssaContributions - $totalDeductions - $medicalContributions - $medicalExpenses;
        
        // Ensure taxable income is not negative
        $taxableIncome = max(0, $taxableIncome);

        // Calculate PAYE based on tax bands (implement your logic here)
        $payeDue = $this->calculateTaxBasedOnBands($taxableIncome);

        // Consider tax credits and AIDS Levy
        $payeDue -= $credits; // Subtract credits
        $payeDue += $aidsLevy; // Add AIDS Levy if applicable

        return response()->json([
            'taxableIncome' => $taxableIncome,
            'payeDue' => max(0, $payeDue), // Ensure PAYE due is not negative
        ]);
    }

    private function calculateTaxBasedOnBands($taxableIncome) {
        $bands = DB::table('paye_bands')->orderBy('min_income')->get();
        $taxDue = 0;

        foreach ($bands as $band) {
            $bandMax = $band->max_income ?? INF; // Upper limit
            if ($taxableIncome > $band->min_income) {
                $bandAmount = min($taxableIncome, $bandMax) - $band->min_income;
                $taxDue += ($bandAmount * $band->rate) - $band->deduct; // Apply the rate and deduct fixed amount
                $taxableIncome -= $bandAmount; // Reduce taxable income
                if ($taxableIncome <= 0) break; // Stop if no taxable income remains
            }
        }

        // AIDS Levy 3%
        $aidsLevy = $taxDue * 0.03;
        $totalTax = $taxDue + $aidsLevy;

        return $totalTax;
    }

    public function calculateComprehensiveCorporateTax(Request $request) {
        try {
            $profitLoss = $request->input('profitLoss', []);
            $taxComputation = $request->input('taxComputation', []);
            $capitalAllowance = $request->input('capitalAllowance', []);

            Log::info('Received comprehensive tax calculation request:', [
                'profitLoss' => $profitLoss,
                'taxComputation' => $taxComputation,
                'capitalAllowance' => $capitalAllowance
            ]);

            // Calculate Gross Profit
            $sales = floatval($profitLoss['sales'] ?? 0);
            $otherTradingIncome = floatval($profitLoss['otherTradingIncome'] ?? 0);
            $costOfGoodsSold = floatval($profitLoss['costOfGoodsSold'] ?? 0);
            
            $grossProfit = ($sales + $otherTradingIncome) - $costOfGoodsSold;
            
            // Calculate Operating Profit (sum all operating expenses)
            $totalOperatingExpenses = 0;
            if (isset($profitLoss['operatingExpenses'])) {
                foreach ($profitLoss['operatingExpenses'] as $expense) {
                    $totalOperatingExpenses += floatval($expense ?? 0);
                }
            }

            // Add individual expense fields if provided
            $totalOperatingExpenses += floatval($profitLoss['advertisingMarketing'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['trainingEvent'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['bankCharges'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['imtt'] ?? 0);
            $totalOperatingExpenses += floatval($profitLoss['salaries'] ?? 0);

            $operatingProfit = $grossProfit - $totalOperatingExpenses;
            
            // Tax Computation - Non-taxable income
            $totalNonTaxableIncome = 0;
            if (isset($taxComputation['nonTaxableIncome'])) {
                foreach ($taxComputation['nonTaxableIncome'] as $income) {
                    $totalNonTaxableIncome += floatval($income ?? 0);
                }
            }

            // Tax Computation - Non-deductible expenses
            $totalNonDeductibleExpenses = 0;
            if (isset($taxComputation['nonDeductibleExpenses'])) {
                foreach ($taxComputation['nonDeductibleExpenses'] as $expense) {
                    $totalNonDeductibleExpenses += floatval($expense ?? 0);
                }
            }

            // Start with operating profit and adjust for tax purposes
            $taxableIncome = $operatingProfit;
            
            // Subtract non-taxable income
            $taxableIncome -= $totalNonTaxableIncome;
            
            // Add back non-deductible expenses
            $taxableIncome += $totalNonDeductibleExpenses;
            
            // Add tax income (recoupments, etc.)
            $totalTaxIncome = 0;
            if (isset($taxComputation['taxIncome'])) {
                foreach ($taxComputation['taxIncome'] as $income) {
                    $totalTaxIncome += floatval($income ?? 0);
                }
            }
            $taxableIncome += $totalTaxIncome;
            
            // Deduct tax expenditure (allowances, etc.)
            $totalTaxExpenditure = 0;
            if (isset($taxComputation['taxExpenditure'])) {
                foreach ($taxComputation['taxExpenditure'] as $expense) {
                    $totalTaxExpenditure += floatval($expense ?? 0);
                }
            }
            $taxableIncome -= $totalTaxExpenditure;
            
            // Apply capital allowances
            $totalCapitalAllowance = 0;
            if (isset($capitalAllowance)) {
                foreach ($capitalAllowance as $assetValue) {
                    $totalCapitalAllowance += floatval($assetValue ?? 0);
                }
            }
            $taxableIncome -= $totalCapitalAllowance;
            
            // Ensure taxable income is not negative
            $taxableIncome = max(0, $taxableIncome);
            
            // Calculate taxes (Zimbabwe corporate tax rate: 25%)
            $taxRate = $this->getTaxRate('Corporate_Income') ?: 0.25;
            $taxDue = $taxableIncome * $taxRate;
            
            // AIDS Levy (3%)
            $aidsLevy = $taxDue * 0.03;
            $totalTax = $taxDue + $aidsLevy;

            return response()->json([
                'grossProfit' => round($grossProfit, 2),
                'operatingProfit' => round($operatingProfit, 2),
                'taxableIncome' => round($taxableIncome, 2),
                'taxDue' => round($taxDue, 2),
                'aidsLevy' => round($aidsLevy, 2),
                'totalTax' => round($totalTax, 2),
                'costOfGoodsSold' => round($costOfGoodsSold, 2),
                'operatingExpenses' => round($totalOperatingExpenses, 2),
                'nonDeductibleExpenses' => round($totalNonDeductibleExpenses, 2),
                'capitalAllowances' => round($totalCapitalAllowance, 2),
                'calculationDetails' => [
                    'sales' => $sales,
                    'otherTradingIncome' => $otherTradingIncome,
                    'nonTaxableIncome' => $totalNonTaxableIncome,
                    'taxIncome' => $totalTaxIncome,
                    'taxExpenditure' => $totalTaxExpenditure
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Comprehensive corporate tax calculation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Calculation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

}