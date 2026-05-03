import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown } from 'lucide-react'
import CalculatorLayout from '../CalculatorLayout'
import { calculateRMD, buildRMDProjection, formatCurrency, rmdUniformLifetimeTable, parseInput, getQueryParams } from '../utils'

export default function RMD() {
  const [currentAge, setCurrentAge] = useState(72)
  const [accountBalance, setAccountBalance] = useState(500000)
  const [annualReturn, setAnnualReturn] = useState(5)
  const [expandedAdvisor, setExpandedAdvisor] = useState(false)

  useEffect(() => {
    const params = getQueryParams()
    if (params.currentAge) setCurrentAge(params.currentAge)
    if (params.accountBalance) setAccountBalance(params.accountBalance)
    if (params.annualReturn) setAnnualReturn(params.annualReturn)
  }, [])

  const age = parseInput(currentAge)
  const balance = parseInput(accountBalance)
  const returnRate = parseInput(annualReturn)

  const currentRMD = calculateRMD(age, balance)
  const projection = buildRMDProjection(age, balance, returnRate)

  const shareParams = {
    currentAge, accountBalance, annualReturn
  }

  const divisor = rmdUniformLifetimeTable[age]
  const isValidAge = divisor !== undefined

  return (
    <CalculatorLayout title="RMD Calculator" shareParams={shareParams}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="eyebrow mb-4">RMD Details</div>
            
            <div className="space-y-4">
              <div>
                <label>Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  min="72"
                  max="115"
                  className="input-field mt-1"
                />
                {!isValidAge && (
                  <p className="text-xs text-copper mt-1">Age must be 72 or older</p>
                )}
              </div>

              <div>
                <label>Account Balance ($)</label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label>Assumed Annual Return (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div className="divider my-6"></div>

            {isValidAge && (
              <div className="space-y-3">
                <div>
                  <p className="eyebrow">Current RMD</p>
                  <p className="text-2xl font-fraunces italic text-forest mt-1">{formatCurrency(currentRMD)}</p>
                </div>

                <div>
                  <p className="eyebrow">Life Expectancy Divisor</p>
                  <p className="text-2xl font-fraunces italic text-ink mt-1">{divisor}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isValidAge ? (
            <>
              <div className="card bg-gradient-to-br from-forest/5 to-copper/5 border-forest/10">
                <div className="eyebrow mb-2">Your Current RMD</div>
                <p className="text-3xl font-fraunces italic text-forest mb-3">{formatCurrency(currentRMD)}</p>
                <p className="text-sm text-ink-mute">
                  You must withdraw at least this amount from your retirement accounts by December 31st.
                </p>
              </div>

              <div className="card">
                <div className="eyebrow mb-4">10-Year RMD Projection</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4C7A3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="rmd" fill="#0F4029" name="RMD" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <div className="eyebrow mb-4">Detailed RMD Projection</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs uppercase tracking-widest text-ink-mute py-2">Year</th>
                        <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Age</th>
                        <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Beginning Balance</th>
                        <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">RMD</th>
                        <th className="text-right text-xs uppercase tracking-widest text-ink-mute py-2">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projection.map((row, idx) => (
                        <tr key={idx} className="border-b border-border/50">
                          <td className="py-2 text-ink-mute">{row.year}</td>
                          <td className="text-right text-ink-mute">{row.age}</td>
                          <td className="text-right text-ink">{formatCurrency(row.beginningBalance)}</td>
                          <td className="text-right text-forest font-medium">{formatCurrency(row.rmd)}</td>
                          <td className="text-right text-ink">{formatCurrency(row.endingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-fraunces italic text-ink mb-3">How to Use This</h3>
                <p className="text-sm text-ink-mute mb-3">
                  Once you reach age 72, you must take a Required Minimum Distribution (RMD) from your traditional IRAs each year.
                </p>
                <p className="text-sm text-ink-mute">
                  RMD must be taken by December 31st each year. Shortfalls are penalized at 25% of the undistributed amount.
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
                      <p className="font-medium text-ink mb-1">Formula</p>
                      <p className="text-xs font-mono bg-copper-tint p-2 rounded">
                        RMD = Account Balance (as of Dec 31 prior year) / Life Expectancy Divisor
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-ink mb-1">Key Rules</p>
                      <ul className="text-xs space-y-1">
                        <li>• RMDs required starting age 72 (SECURE Act 2.0)</li>
                        <li>• Deadline: December 31st each year</li>
                        <li>• Penalty: 25% of shortfall (reduced to 10% if corrected timely)</li>
                        <li>• Roth IRAs exempt during owner's lifetime</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-ink mb-1">CFP Reference</p>
                      <p className="text-xs">CFP Board PKT E.2: Distributions from retirement accounts</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card bg-copper-tint border-copper/30">
              <p className="text-sm text-ink-mute">
                RMDs are required beginning at age 72 under the SECURE Act 2.0. Please enter an age of 72 or older.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  )
}
