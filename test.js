function getCurrencySymbol(locale, currency) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  });

  const parts = formatter.formatToParts(1);
  const symbolPart = parts.find(p => p.type === 'currency');

  // Garantir que não seja undefined
  return symbolPart ? symbolPart.value : '';
}

// Exemplos de uso
console.log(getCurrencySymbol('en-US', 'USD')); // $
console.log(getCurrencySymbol('en-US', 'BRL')); // R$
console.log(getCurrencySymbol('en-US', 'GBP')); // £
console.log(Intl.DateTimeFormat().resolvedOptions().locale);

const address = [
  'bc1qrms36rtgk0w4yeqkwc4urg5kk5jv4rfxlgy0x8',
  'bc1q2vp8d7t3tt8r64kxxzaj8hpp0m5rgpy5u2lzng',
  'bc1qhnfnfp3pxmwnvt55kex7wvjw7ll7wa0lzee4z7',
];
async function getBitcoinAmountBlockChain(address) {
  const URL = `https://blockchain.info/multiaddr?active=${address}&n=0&format=json`; /* Address Separate by | (pipeline) */
  try {
    const response = await fetch(URL);
    if (response.status !== 200) {
      throw new Error('Error to get wallet values!');
    }

    const data = await response.json();
    console.log('DATA================', data.addresses);
    const sumBalance = Array.isArray(data.addresses)
      ? data.addresses.reduce(
          (accum, curr) =>
            (accum += curr.final_balance ? curr.final_balance : 0),
          0,
        )
      : data.balance;

    const balanceSatoshis = sumBalance;
    const balanceBitcoin = sumBalance / 100000000; // 1 Bitcoin = 100,000,000 Satoshis;;
    return balanceBitcoin;
  } catch (error) {
    console.log('Ocorreu um erro ao obter os dados da API', error);
    toastMessage(`${error}`);
    return 0;
  }
}
const addresses = address.join('|');
const amount = await getBitcoinAmountBlockChain(addresses);

console.log(amount);
