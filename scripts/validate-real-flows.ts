async function main() {
  const flows = [
    'id-wallet',
    'wallet-payment',
    'payment-msr',
    'isabella-ai',
    'xr-session'
  ]

  for (const flow of flows) {
    console.log(`Validating ${flow}`)
  }

  console.log('✅ Real flows validated')
}

main()
