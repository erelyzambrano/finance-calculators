import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import TimeValueOfMoney from './calculators/TimeValueOfMoney'
import Amortization from './calculators/Amortization'
import FutureValueSeries from './calculators/FutureValueSeries'
import Retirement from './calculators/Retirement'
import RMD from './calculators/RMD'
import TaxEquivalentYield from './calculators/TaxEquivalentYield'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tvm" element={<TimeValueOfMoney />} />
        <Route path="/amortization" element={<Amortization />} />
        <Route path="/fv-series" element={<FutureValueSeries />} />
        <Route path="/retirement" element={<Retirement />} />
        <Route path="/rmd" element={<RMD />} />
        <Route path="/tey" element={<TaxEquivalentYield />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
