import toastMessage from '../Utils/ToastMessage';

async function getBitcoinPrice(currency: string): Promise<number> {
  const URL = `https://api.coinbase.com/v2/prices/BTC-${currency}/buy`;

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Error to get bitcoin price!');
    }

    const {
      data: {amount},
    }: {data: {amount: number}} = await response.json();

    return await Promise.resolve(amount);
  } catch (error) {
    console.log('Ocorreu um erro ao obter os dados da API', error);
    toastMessage(`${error}`);
    return 0;
  }
}

async function getBitcoinAmountBlockChain(address: string): Promise<number> {
  const URL = `https://blockchain.info/rawaddr/${address}`;
  try {
    const response = await fetch(URL);
    if (response.status !== 200) {
      throw new Error('Error to get wallet values!');
    }

    const data = await response.json();
    const balanceSatoshis = data.final_balance;
    const balanceBitcoin = balanceSatoshis / 100000000; // 1 Bitcoin = 100,000,000 Satoshis
    return balanceBitcoin;
  } catch (error) {
    console.log('Ocorreu um erro ao obter os dados da API', error);
    toastMessage(`${error}`);
    return 0;
  }
}

async function getBitcoinAmountBlockCypher(address: string): Promise<number> {
  const URL = `https://api.blockcypher.com/v1/btc/main/addrs/${address}`;
  try {
    const response = await fetch(URL);
    if (response.status !== 200) {
      throw new Error('Error to get wallet values!');
    }

    const data = await response.json();

    const sumBalance = Array.isArray(data)
      ? data.reduce(
          (accum: any, curr: any) => (accum += curr.balance ? curr.balance : 0),
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

async function getBalances(addresses: string[]): Promise<number[]> {
  const balances: number[] = await Promise.all(
    addresses.map(address => getBitcoinAmountBlockChain(address)),
  );
  return balances;
}

export {
  getBitcoinPrice,
  getBitcoinAmountBlockChain,
  getBitcoinAmountBlockCypher,
  getBalances,
};
