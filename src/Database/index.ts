import AsyncStorage from '@react-native-async-storage/async-storage';
import tostMessage from '../Utils/ToastMessage';
import {storedData, storedParams} from '../types';

async function storeData(
  key: string,
  value: storedData | storedParams,
): Promise<boolean> {
  try {
    const data = await AsyncStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (e) {
    // saving error
    console.log('Ocorreu um erro ao salvar os dados', e);
    tostMessage(`Não foi possível salvar os dados!: ${e}`);
    return false;
  }
}

async function getStoredData(key: string): Promise<storedData | storedParams> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const json: storedData = await JSON.parse(value);

      // value previously stored

      return await Promise.resolve(json);
    } else {
      return {Error: 'No data found'};
    }
  } catch (e) {
    // error reading value
    console.log('Ocorreu um erro ao obter os dados armazenados', e);
    return {Error: 'Ocorreu um erro ao obter os dados armazenados'};
  }
}

export {storeData, getStoredData};
