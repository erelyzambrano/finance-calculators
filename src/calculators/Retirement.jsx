import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown } from 'lucide-react'
import CalculatorLayout from '../CalculatorLayout'
import { formatCurrency, parseInput, getQueryParams } from '../utils'

export default function Retirement() {
  const [currentSavings, setCurrentSavings] = useState(150000)
  const [annualContribution, setAnnualContribution] = useState(20000)
  const [yearsToRetirement, setYearsToRetirement] = useState(20)
  const [annualReturn, setAnnualReturn] = useState(6.5)
  const [expandedAdvisor, setExpandedAdvisor] = useState(false)

  useEffect(() => {
    const params = getQueryParams()
    if (params.currentSavings) setCurrentSavings(params.currentSavings)
    if (params.annualContribution) setAnnualContribution(params.annualContribution)
    if (params.yearsToRetirement) setYearsToRetirement(params.yearsToRetirement)
    if (params.annualReturn) setAnnualReturn(params.annualReturn)
  }, [])

  const current = parseInput(currentSavings)
  const contribution = parseInput(annualContribution)
  const years = parseInput(yearsToRetirement)
  const rate = parseInput(annualReturn) / 100

  const projection = []
  let balance = current

  for (let year = 0; year <= years; year++) {
    projection.push({
      year,
      balance,
      contributed: current + (contribution * year),
      growth: Math.max(0, balance - (current + contribution * year))
    })
    if (year < years) {
      balance = balance * (1 + rate) + contribution
    }
  }

  const finalBalance = balance
  const totalContributions = current + (contribution * years)
  const totalGrowth = finalBalance - totalContributions

  const shareParams = { currentSavings, annualContribution, yearsToRetirement, annualReturn }

  return (
    <CalculatorLayout title="Retirement Savings Projection" shareParams={shareParams}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="eyebrow mb-4">Retirement Plan</div>
            <div className="space-y-4">
              <div>
                <label>Current Retirement Savings ($)</label>
                <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} className="input-field mt-1" />
              </div>
              <div>
                <label>Annual Contribution ($)</label>
                <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} className="input-field mt-1" />
              </div>
              <div>
                <label>Years Until Retirement</label>
                <input type="number" value={yearsToRetirement} onChange={(e) => setYearsToRetirement(e.target.value)} className="input-field mt-1" />
              </div>
              <div>
                <label>Assumed Annual Return (%)</label>
                <input type="number" step="0.01" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} className="input-field mt-1" />
              </div>
            </div>
            <div className="divider my-6"></div>
            <div className="space-y-3">
              <div>
                <p className="eyebrow">Projected Nest Egg</p>
                <p className="text-2xl font-fraunces italic text-forest mt-1">{formatCurrency(finalBalance)}</p>
              </div>
              <div>
                <p className="eyebrow">Investment Growth</p>
                <p className="text-2xl font-fraunces italic text-copper mt-1">{formatCurrency(totalGrowth)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="eyebrow mb-2">Total You'll Contribute</div>
              <p className="text-xl font-fraunces italic text-ink">{formatCurrency(totalContributions)}</p>
            </div>
            <div className="card">
              <div className="eyebrow mb-2">Growth from Returns</div>
              <p className="text-xl font-fraunces italic text-forest">{formatCurrency(totalGrowth)}</p>
            </div>
          </div>
          <div className="card">
            <div className="eyebrow mb-4">Accumulation Projection</div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={projection}>
                <defs>
                  <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F4029" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#0F4029" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="copperGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B5663D" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#B5663D" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4C7A3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="contributed" stackId="a" fill="url(#forestGrad)" name="Contributions" />
                <Bar dataKey="growth" stackId="a" fill="url(#copperGrad)" name="Growth" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="eyebrow mb-4">Year-by-Year Projection</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs uppercase tracking-widest text-ink-mute py-2">Year</th>
                    <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Balance</th>
                    <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Annual Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {projection.map((row, idx) => {
                    const prevBalance = idx > 0 ? projection[idx - 1].balance : current
                    const yearGrowth = row.balance - prevBalance - contribution
                    return (
                      <tr key={idx} className={idx === projection.length - 1 ? 'border-t-2 border-forest font-bold' : 'border-b border-border/50'}>
                        <td className="py-2 text-ink-mute">{row.year}</td>
                        <td className="text-right text-ink font-medium">{formatCurrency(row.balance)}</td>
                        <td className="text-right text-forest">{formatCurrency(Math.max(0, yearGrowth))}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-fraunces italic text-ink mb-3">How to Use This</h3>
            <p className="text-sm text-ink-mute">This projection estimates your retirement savings.</p>
          </div>
          <div className="card border-copper/30">
            <button onClick={() => setExpandedAdvisor(!expandedAdvisor)} className="w-full flex items-center justify-between">
              <h3 className="text-sm font-medium text-copper">For Advisors</h3>
              <ChevronDown className={`w-4 h-4 text-copper transition-transform ${expandedAdvisor ? 'rotate-180' : ''}`} />
            </button>
            {expandedAdvisor && (
              <div className="mt-4 pt-4 border-t border-copper/20 text-sm text-ink-mute space-y-3">
                <div>
                  <p className="font-medium text-ink mb-1">CFP Reference</p>
                  <p className="text-xs">CFP Board PKT E.1: Retirement savings needs analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  )
}
