import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown } from 'lucide-react'
import CalculatorLayout from '../CalculatorLayout'
import { buildAmortizationSchedule, calculateMonthlyPayment, formatCurrency, parseInput, getQueryParams } from '../utils'

export default function Amortization() {
  const [principal, setPrincipal] = useState(300000)
  const [annualRate, setAnnualRate] = useState(6.5)
  const [years, setYears] = useState(30)
  const [expandedAdvisor, setExpandedAdvisor] = useState(false)

  useEffect(() => {
    const params = getQueryParams()
    if (params.principal) setPrincipal(params.principal)
    if (params.annualRate) setAnnualRate(params.annualRate)
    if (params.years) setYears(params.years)
  }, [])

  const months = parseInput(years) * 12
  const monthlyPayment = calculateMonthlyPayment(parseInput(principal), parseInput(annualRate), months)
  const schedule = buildAmortizationSchedule(parseInput(principal), parseInput(annualRate), monthlyPayment, months)
  const totalPaid = monthlyPayment * months
  const totalInterest = totalPaid - parseInput(principal)

  const chartData = []
  for (let year = 0; year <= parseInput(years); year++) {
    const monthIndex = year * 12 - 1
    const monthData = schedule[monthIndex] || schedule[schedule.length - 1]
    if (monthData) {
      chartData.push({ year, balance: monthData.balance })
    }
  }

  const shareParams = { principal, annualRate, years }

  return (
    <CalculatorLayout title="Amortization Calculator" shareParams={shareParams}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="eyebrow mb-4">Loan Details</div>
            <div className="space-y-4">
              <div>
                <label>Loan Amount ($)</label>
                <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="input-field mt-1" />
              </div>
              <div>
                <label>Annual Interest Rate (%)</label>
                <input type="number" step="0.01" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="input-field mt-1" />
              </div>
              <div>
                <label>Loan Term (Years)</label>
                <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="input-field mt-1" />
              </div>
            </div>
            <div className="divider my-6"></div>
            <div className="space-y-3">
              <div>
                <p className="eyebrow">Monthly Payment</p>
                <p className="text-2xl font-fraunces italic text-forest mt-1">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div>
                <p className="eyebrow">Total Interest Paid</p>
                <p className="text-2xl font-fraunces italic text-copper mt-1">{formatCurrency(totalInterest)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="eyebrow mb-2">Total Payments</div>
              <p className="text-2xl font-fraunces italic text-ink">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="card">
              <div className="eyebrow mb-2">Principal Repaid</div>
              <p className="text-2xl font-fraunces italic text-forest">{formatCurrency(parseInput(principal))}</p>
            </div>
          </div>
          <div className="card">
            <div className="eyebrow mb-4">Remaining Balance Over Time</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4C7A3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="balance" stroke="#0F4029" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="eyebrow mb-4">Amortization Schedule</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs uppercase tracking-widest text-ink-mute py-2">Month</th>
                    <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Payment</th>
                    <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Principal</th>
                    <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Interest</th>
                    <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, 120).map((row, idx) => (
                    <tr key={idx} className={idx % 12 === 11 ? 'border-b-2 border-border' : 'border-b border-border/50'}>
                      <td className="py-2 text-ink-mute">{row.month}</td>
                      <td className="text-right text-ink">{formatCurrency(row.payment)}</td>
                      <td className="text-right text-forest">{formatCurrency(row.principal)}</td>
                      <td className="text-right text-copper">{formatCurrency(row.interest)}</td>
                      <td className="text-right text-ink font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-fraunces italic text-ink mb-3">How to Use This</h3>
            <p className="text-sm text-ink-mute">Enter your loan amount, interest rate, and term.</p>
          </div>
          <div className="card border-copper/30">
            <button onClick={() => setExpandedAdvisor(!expandedAdvisor)} className="w-full flex items-center justify-between">
              <h3 className="text-sm font-medium text-copper">For Advisors</h3>
              <ChevronDown className={`w-4 h-4 text-copper transition-transform ${expandedAdvisor ? 'rotate-180' : ''}`} />
            </button>
            {expandedAdvisor && (
              <div className="mt-4 pt-4 border-t border-copper/20 text-sm text-ink-mute space-y-3">
                <div>
                  <p className="font-medium text-ink mb-1">Monthly Payment Formula</p>
                  <p className="text-xs font-mono bg-copper-tint p-2 rounded">P = (L × r × (1+r)^n) / ((1+r)^n - 1)</p>
                </div>
                <div>
                  <p className="font-medium text-ink mb-1">CFP Reference</p>
                  <p className="text-xs">CFP Board PKT B.10: Financing strategies</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  )
}
