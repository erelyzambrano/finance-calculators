import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChevronDown } from 'lucide-react'
import CalculatorLayout from '../CalculatorLayout'
import { formatCurrency, parseInput, getQueryParams } from '../utils'

export default function FutureValueSeries() {
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [years, setYears] = useState(20)
  const [expandedAdvisor, setExpandedAdvisor] = useState(false)

  useEffect(() => {
    const params = getQueryParams()
    if (params.initialInvestment) setInitialInvestment(params.initialInvestment)
    if (params.monthlyContribution) setMonthlyContribution(params.monthlyContribution)
    if (params.annualReturn) setAnnualReturn(params.annualReturn)
    if (params.years) setYears(params.years)
  }, [])

  const initial = parseInput(initialInvestment)
  const monthly = parseInput(monthlyContribution)
  const rate = parseInput(annualReturn) / 100 / 12
  const months = parseInput(years) * 12

  const chartData = []
  let balance = initial
  let totalContributed = initial

  for (let month = 0; month <= months; month++) {
    const year = Math.floor(month / 12)
    
    if (month % 12 === 0 || month === months) {
      chartData.push({
        year,
        month,
        balance,
        contributed: totalContributed,
        growth: Math.max(0, balance - totalContributed)
      })
    }

    if (month < months) {
      balance = balance * (1 + rate) + monthly
      totalContributed += monthly
    }
  }

  const finalBalance = balance
  const totalContributions = initial + (monthly * months)
  const totalGrowth = finalBalance - totalContributions

  const shareParams = {
    initialInvestment, monthlyContribution, annualReturn, years
  }

  return (
    <CalculatorLayout title="Future Value of a Series" shareParams={shareParams}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="eyebrow mb-4">Investment Details</div>
            
            <div className="space-y-4">
              <div>
                <label>Initial Investment ($)</label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label>Monthly Contribution ($)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label>Annual Return (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label>Time Horizon (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div className="divider my-6"></div>

            <div className="space-y-3">
              <div>
                <p className="eyebrow">Projected Balance</p>
                <p className="text-2xl font-fraunces italic text-forest mt-1">{formatCurrency(finalBalance)}</p>
              </div>

              <div>
                <p className="eyebrow">Total Growth</p>
                <p className="text-2xl font-fraunces italic text-copper mt-1">{formatCurrency(totalGrowth)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="eyebrow mb-2">Your Contributions</div>
              <p className="text-xl font-fraunces italic text-ink">{formatCurrency(totalContributions)}</p>
            </div>
            <div className="card">
              <div className="eyebrow mb-2">Growth Earned</div>
              <p className="text-xl font-fraunces italic text-forest">{formatCurrency(totalGrowth)}</p>
            </div>
          </div>

          <div className="card">
            <div className="eyebrow mb-4">Accumulation Over Time</div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorContributed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E2EBE4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E2EBE4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7E8D9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F7E8D9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4C7A3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="contributed" stackId="1" stroke="#0F4029" fill="url(#colorContributed)" name="Contributions" />
                <Area type="monotone" dataKey="growth" stackId="1" stroke="#B5663D" fill="url(#colorGrowth)" name="Growth" />
              </AreaChart>
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
                    <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-2 text-ink-mute">{row.year}</td>
                      <td className="text-right text-ink font-medium">{formatCurrency(row.balance)}</td>
                      <td className="text-right text-forest">{formatCurrency(row.year === 0 ? 0 : 12 * monthly)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-fraunces italic text-ink mb-3">How to Use This</h3>
            <p className="text-sm text-ink-mute">
              This shows how regular contributions compound over time.
            </p>
          </div>

          <div className="card border-copper/30">
            <button
              onClick={() => setExpandedAdvisor(!expandedAdvisor)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-sm font-medium text-copper">For Advisors</h3>
              <ChevronDown className={`w-4 h-4 text-copper transition-transform ${expandedAdvisor ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedAdvisor && (
              <div className="mt-4 pt-4 border-t border-copper/20 text-sm text-ink-mute space-y-3">
                <div>
                  <p className="font-medium text-ink mb-1">Formula (Ordinary Annuity)</p>
                  <p className="text-xs font-mono bg-copper-tint p-2 rounded">
                    FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]
                  </p>
                </div>
                <div>
                  <p className="font-medium text-ink mb-1">CFP Reference</p>
                  <p className="text-xs">CFP Board PKT B.12: Time value of money</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  )
}
