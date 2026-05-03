import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChevronDown } from 'lucide-react'
import CalculatorLayout from '../CalculatorLayout'
import { solveTVM, formatCurrency, parseInput, getQueryParams } from '../utils'

export default function TimeValueOfMoney() {
  const [solveFor, setSolveFor] = useState('fv')
  const [pv, setPv] = useState(10000)
  const [fv, setFv] = useState('')
  const [pmt, setPmt] = useState(0)
  const [n, setN] = useState(10)
  const [rate, setRate] = useState(6)
  const [expandedAdvisor, setExpandedAdvisor] = useState(false)

  useEffect(() => {
    const params = getQueryParams()
    if (params.solveFor) setSolveFor(params.solveFor)
    if (params.pv) setPv(params.pv)
    if (params.fv) setFv(params.fv)
    if (params.pmt) setPmt(params.pmt)
    if (params.n) setN(params.n)
    if (params.rate) setRate(params.rate)
  }, [])

  let result = 0
  if (solveFor === 'fv') result = solveTVM(parseInput(pv), 0, parseInput(pmt), parseInput(n), parseInput(rate), 'fv')
  else if (solveFor === 'pv') result = solveTVM(0, parseInput(fv), parseInput(pmt), parseInput(n), parseInput(rate), 'pv')
  else if (solveFor === 'pmt') result = solveTVM(parseInput(pv), parseInput(fv), 0, parseInput(n), parseInput(rate), 'pmt')
  else if (solveFor === 'n') result = solveTVM(parseInput(pv), parseInput(fv), parseInput(pmt), 0, parseInput(rate), 'n')
  else if (solveFor === 'rate') result = solveTVM(parseInput(pv), parseInput(fv), parseInput(pmt), parseInput(n), 0, 'rate')

  const shareParams = { solveFor, pv, fv, pmt, n, rate }
  const timelineData = []
  const r = parseInput(rate) / 100
  let balance = parseInput(pv)
  for (let year = 0; year <= parseInput(n); year++) {
    balance = parseInput(pv) * Math.pow(1 + r, year) + parseInput(pmt) * (Math.pow(1 + r, year) - 1) / r
    timelineData.push({ year, balance })
  }

  return (
    <CalculatorLayout title="Time Value of Money" shareParams={shareParams}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="eyebrow mb-4">What to Solve For</div>
            <div className="space-y-3 mb-6">
              {['fv', 'pv', 'pmt', 'n', 'rate'].map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input type="radio" name="solveFor" value={option} checked={solveFor === option} onChange={(e) => setSolveFor(e.target.value)} className="mr-3" />
                  <span className="text-sm text-ink">{option === 'fv' && 'Future Value'}{option === 'pv' && 'Present Value'}{option === 'pmt' && 'Payment'}{option === 'n' && 'Number of Periods'}{option === 'rate' && 'Interest Rate'}</span>
                </label>
              ))}
            </div>
            <div className="divider my-6"></div>
            <div className="space-y-4">
              {solveFor !== 'pv' && (<div><label>Present Value ($)</label><input type="number" value={pv} onChange={(e) => setPv(e.target.value)} className="input-field mt-1" /></div>)}
              {solveFor !== 'fv' && (<div><label>Future Value ($)</label><input type="number" value={fv} onChange={(e) => setFv(e.target.value)} className="input-field mt-1" /></div>)}
              {solveFor !== 'pmt' && (<div><label>Payment per Period ($)</label><input type="number" value={pmt} onChange={(e) => setPmt(e.target.value)} className="input-field mt-1" /></div>)}
              {solveFor !== 'n' && (<div><label>Number of Periods (Years)</label><input type="number" value={n} onChange={(e) => setN(e.target.value)} className="input-field mt-1" /></div>)}
              {solveFor !== 'rate' && (<div><label>Annual Interest Rate (%)</label><input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="input-field mt-1" /></div>)}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-gradient-to-br from-forest/5 to-copper/5">
            <div className="eyebrow mb-2">Result</div>
            <div className="text-4xl font-fraunces italic text-forest">{solveFor === 'rate' ? result.toFixed(2) + '%' : formatCurrency(result)}</div>
          </div>
          <div className="card">
            <div className="eyebrow mb-4">Growth Over Time</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4C7A3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="balance" fill="#0F4029" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="text-lg font-fraunces italic text-ink mb-3">How to Use This</h3>
            <p className="text-sm text-ink-mute">Enter values and select what to solve for.</p>
          </div>
          <div className="card border-copper/30">
            <button onClick={() => setExpandedAdvisor(!expandedAdvisor)} className="w-full flex items-center justify-between">
              <h3 className="text-sm font-medium text-copper">For Advisors</h3>
              <ChevronDown className={`w-4 h-4 text-copper transition-transform ${expandedAdvisor ? 'rotate-180' : ''}`} />
            </button>
            {expandedAdvisor && (<div className="mt-4 pt-4 border-t border-copper/20 text-sm text-ink-mute"><p className="text-xs">CFP Board PKT B.12: Time value of money</p></div>)}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  )
}
