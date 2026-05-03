import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown } from 'lucide-react'
import CalculatorLayout from '../CalculatorLayout'
import { parseInput, getQueryParams } from '../utils'

const federalBrackets = { '10': 0.10, '12': 0.12, '22': 0.22, '24': 0.24, '32': 0.32, '35': 0.35, '37': 0.37 }

export default function TaxEquivalentYield() {
  const [municipalYield, setMunicipalYield] = useState(3.5)
  const [federalRate, setFederalRate] = useState('24')
  const [stateRate, setStateRate] = useState(5.75)
  const [localRate, setLocalRate] = useState(0)
  const [expandedAdvisor, setExpandedAdvisor] = useState(false)

  useEffect(() => {
    const params = getQueryParams()
    if (params.municipalYield) setMunicipalYield(params.municipalYield)
    if (params.federalRate) setFederalRate(params.federalRate)
    if (params.stateRate) setStateRate(params.stateRate)
    if (params.localRate) setLocalRate(params.localRate)
  }, [])

  const muniYield = parseInput(municipalYield) / 100
  const fedRate = federalBrackets[federalRate] || 0.24
  const stateTax = parseInput(stateRate) / 100
  const localTax = parseInput(localRate) / 100
  const totalTaxRate = fedRate + stateTax + localTax
  const tey = muniYield / (1 - totalTaxRate)

  const assumedTaxableYield = 5.0 / 100
  const taxOnTaxable = assumedTaxableYield * totalTaxRate
  const afterTaxTaxable = assumedTaxableYield - taxOnTaxable

  const comparisonData = [
    { name: 'Taxable Bond (5%)', yield: 5.0, afterTaxYield: assumedTaxableYield * (1 - totalTaxRate) * 100, fill: '#B5663D' },
    { name: 'Municipal Bond', yield: municipalYield * 100, afterTaxYield: municipalYield * 100, fill: '#0F4029' }
  ]

  const shareParams = { municipalYield, federalRate, stateRate, localRate }

  return (
    <CalculatorLayout title="Tax-Equivalent Yield" shareParams={shareParams}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="eyebrow mb-4">Bond & Tax Info</div>
            <div className="space-y-4">
              <div>
                <label>Municipal Bond Yield (%)</label>
                <input type="number" step="0.01" value={municipalYield} onChange={(e) => setMunicipalYield(e.target.value)} className="input-field mt-1" />
              </div>
              <div>
                <label>Federal Tax Bracket (%)</label>
                <select value={federalRate} onChange={(e) => setFederalRate(e.target.value)} className="input-field mt-1">
                  <option value="10">10%</option>
                  <option value="12">12%</option>
                  <option value="22">22%</option>
                  <option value="24">24%</option>
                  <option value="32">32%</option>
                  <option value="35">35%</option>
                  <option value="37">37%</option>
                </select>
              </div>
              <div>
                <label>State Tax Rate (%) - Optional</label>
                <input type="number" step="0.01" value={stateRate} onChange={(e) => setStateRate(e.target.value)} className="input-field mt-1" />
              </div>
              <div>
                <label>Local Tax Rate (%) - Optional</label>
                <input type="number" step="0.01" value={localRate} onChange={(e) => setLocalRate(e.target.value)} className="input-field mt-1" />
              </div>
            </div>
            <div className="divider my-6"></div>
            <div className="space-y-3">
              <div>
                <p className="eyebrow">Combined Tax Rate</p>
                <p className="text-2xl font-fraunces italic text-copper mt-1">{(totalTaxRate * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="eyebrow">Effective Yield (Muni)</p>
                <p className="text-2xl font-fraunces italic text-forest mt-1">{(muniYield * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-gradient-to-br from-forest/5 to-copper/5">
            <div className="eyebrow mb-2">Tax-Equivalent Yield</div>
            <p className="text-4xl font-fraunces italic text-forest mb-2">{(tey * 100).toFixed(2)}%</p>
            <p className="text-sm text-ink-mute">A taxable bond would need this yield to match your municipal bond's after-tax return.</p>
          </div>
          <div className="card">
            <div className="eyebrow mb-4">Yield Comparison</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4C7A3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toFixed(2) + '%'} />
                <Bar dataKey="afterTaxYield" name="After-Tax Yield" fill="#0F4029" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <p className="eyebrow mb-2">5% Taxable Bond</p>
              <p className="text-sm text-ink-mute mb-3">Gross yield before tax</p>
              <p className="text-2xl font-fraunces italic text-ink mb-4">5.00%</p>
              <p className="text-xs text-ink-mute mb-2">Tax at {(totalTaxRate * 100).toFixed(1)}%</p>
              <p className="text-lg font-fraunces text-copper">−{(taxOnTaxable * 100).toFixed(2)}%</p>
              <div className="border-t border-border mt-4 pt-3">
                <p className="eyebrow mb-1">After-Tax Yield</p>
                <p className="text-xl font-fraunces italic text-forest">{(afterTaxTaxable * 100).toFixed(2)}%</p>
              </div>
            </div>
            <div className="card">
              <p className="eyebrow mb-2">Municipal Bond</p>
              <p className="text-sm text-ink-mute mb-3">Tax-free yield</p>
              <p className="text-2xl font-fraunces italic text-forest mb-4">{(municipalYield * 100).toFixed(2)}%</p>
              <p className="text-xs text-ink-mute mb-2">No federal tax</p>
              <p className="text-lg font-fraunces text-forest">$0.00</p>
              <div className="border-t border-border mt-4 pt-3">
                <p className="eyebrow mb-1">Effective Yield</p>
                <p className="text-xl font-fraunces italic text-forest">{(municipalYield * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-fraunces italic text-ink mb-3">How to Use This</h3>
            <p className="text-sm text-ink-mute">Compare municipal bond after-tax yields to taxable equivalents.</p>
          </div>
          <div className="card border-copper/30">
            <button onClick={() => setExpandedAdvisor(!expandedAdvisor)} className="w-full flex items-center justify-between">
              <h3 className="text-sm font-medium text-copper">For Advisors</h3>
              <ChevronDown className={`w-4 h-4 text-copper transition-transform ${expandedAdvisor ? 'rotate-180' : ''}`} />
            </button>
            {expandedAdvisor && (<div className="mt-4 pt-4 border-t border-copper/20 text-sm text-ink-mute"><div><p className="font-medium text-ink mb-1">Formula</p><p className="text-xs font-mono bg-copper-tint p-2 rounded">TEY = Municipal Yield / (1 − Total Tax Rate)</p></div><div><p className="font-medium text-ink mb-1">CFP Reference</p><p className="text-xs">CFP Board PKT B.16: Tax strategies</p></div></div>)}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  )
}
