export const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatPercent = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00%'
  return (value * 100).toFixed(2) + '%'
}

export const formatNumber = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00'
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const parseInput = (value) => {
  const num = parseFloat(value) || 0
  return num
}

export const copyShareUrl = (path, params) => {
  const baseUrl = window.location.origin
  const queryString = new URLSearchParams(params).toString()
  const shareUrl = `${baseUrl}${path}?${queryString}`
  
  navigator.clipboard.writeText(shareUrl).then(() => {
    alert('Calculator link copied to clipboard!')
  }).catch(() => {
    alert('Copy this link to share: ' + shareUrl)
  })
}

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = isNaN(value) ? value : parseFloat(value)
  }
  return result
}

export const solveTVM = (pv = 0, fv = 0, pmt = 0, n = 0, rate = 0, solve = 'fv') => {
  const r = rate / 100
  
  if (solve === 'fv') {
    return pv * Math.pow(1 + r, n) + pmt * (Math.pow(1 + r, n) - 1) / r
  }
  
  if (solve === 'pv') {
    const annuity = pmt * (Math.pow(1 + r, n) - 1) / r
    return (fv - annuity) / Math.pow(1 + r, n)
  }
  
  if (solve === 'pmt') {
    if (Math.abs(r) < 0.00001) return (fv - pv) / n
    return (fv - pv * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) * r
  }
  
  if (solve === 'n') {
    if (Math.abs(r) < 0.00001) return (fv - pv) / pmt
    const numerator = (fv * r + pmt) / (pv * r + pmt)
    if (numerator <= 0) return 0
    return Math.log(numerator) / Math.log(1 + r)
  }
  
  if (solve === 'rate') {
    let guess = 0.05
    for (let i = 0; i < 100; i++) {
      const r_guess = guess
      const fn = pv * Math.pow(1 + r_guess, n) + pmt * (Math.pow(1 + r_guess, n) - 1) / r_guess - fv
      const fn_prime = pv * n * Math.pow(1 + r_guess, n - 1) + pmt * (n * Math.pow(1 + r_guess, n - 1) * r_guess - (Math.pow(1 + r_guess, n) - 1)) / (r_guess * r_guess)
      
      const next_guess = r_guess - fn / fn_prime
      if (Math.abs(next_guess - guess) < 0.0001) {
        return next_guess * 100
      }
      guess = next_guess
    }
    return guess * 100
  }
  
  return 0
}

export const buildAmortizationSchedule = (principal, annualRate, monthlyPayment, months) => {
  const monthlyRate = annualRate / 100 / 12
  const schedule = []
  let balance = principal
  
  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate
    const principalPayment = monthlyPayment - interest
    balance -= principalPayment
    
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
    })
  }
  
  return schedule
}

export const calculateMonthlyPayment = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / months
  return (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
}

export const rmdUniformLifetimeTable = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9,
  78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7,
  84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.6, 89: 12.8,
  90: 12.0, 91: 11.3, 92: 10.6, 93: 9.9, 94: 9.2, 95: 8.6,
  96: 8.0, 97: 7.4, 98: 6.9, 99: 6.4, 100: 5.9, 101: 5.4,
  102: 4.9, 103: 4.5, 104: 4.1, 105: 3.7, 106: 3.4, 107: 3.1,
  108: 2.8, 109: 2.5, 110: 2.2, 111: 2.0, 112: 1.8, 113: 1.6,
  114: 1.4, 115: 1.2
}

export const calculateRMD = (age, balance) => {
  const divisor = rmdUniformLifetimeTable[age] || 1.2
  return balance / divisor
}

export const buildRMDProjection = (startAge, startBalance, annualReturn) => {
  const projection = []
  let balance = startBalance
  const r = annualReturn / 100
  
  for (let i = 0; i < 10; i++) {
    const age = startAge + i
    const rmd = calculateRMD(age, balance)
    projection.push({
      year: i + 1,
      age,
      beginningBalance: balance,
      rmd,
      endingBalance: Math.max(0, balance - rmd) * (1 + r)
    })
    balance = Math.max(0, balance - rmd) * (1 + r)
  }
  
  return projection
}
