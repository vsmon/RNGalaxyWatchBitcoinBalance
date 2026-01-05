import React, {useState, useRef, useEffect} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  View,
  AppState,
  Dimensions,
  Easing,
  ScaledSize,
  SafeAreaView,
  Platform,
  Button,
  PermissionsAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {getStoredData, storeData} from '../../Database/index';
import {
  getBitcoinAmountBlockCypher,
  getBitcoinPrice,
  receiveMessageFromMobile,
  sendMessageToWatch,
  getBitcoinAmountBlockChain,
} from '../../Services';
import ModalSettings from '../../Components/ModalSettings';

import {storedData, storedParams} from '../../types';
import FormatNumber from '../../Utils/FormatNumberToLocaleString';
import CalculateVariation from '../../Utils/CalculateVariation';
import CustomScrollView from '../../Components/CustomScrollView';
import {watchEvents, WearConnectivity} from 'react-native-wear-connectivity';
import toastMessage from '../../Utils/ToastMessage';
import isWatch from '../../Utils/IsWatch';
import getCurrencySymbol from '../../Utils/CurrencySymbol';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const fontScale = Dimensions.get('window').fontScale;

type Home = {
  darkMode: boolean;
  backgroundStyle: any;
};

function Home(): JSX.Element {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scaleOnPressValue = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [bitcoinPrice, setBitcoinPrice] = useState<number>(0);
  const [bitcoinBalance, setBitcoinBalance] = useState<number>(0);
  const [bitcoinProfit, setBitcoinProfit] = useState<number>(0);
  const [currencySymbol, setCurrencySymbol] = useState<string>('');

  const [bitcoinPriceVariation, setBitcoinPriceVariation] = useState(0);
  const [bitcoinBalanceVariation, setBitcoinBalanceVariation] = useState(0);
  const [bitcoinProfitVariation, setBitcoinProfitVariation] = useState(0);

  const prevBitcoinPrice = useRef<number>(0);
  const prevBitcoinBalance = useRef<number>(1);
  const prevBitcoinProfit = useRef<number>(0);

  const AnimatedIcon = Animated.createAnimatedComponent(Icon);

  const handleDarkMode = async () => {
    const storedParams: storedParams = await getStoredData('bitcoin-params');
    if (storedParams.bitcoinParams) {
      const {darkMode} = storedParams.bitcoinParams;
      setIsDarkMode(darkMode);
    }
  };

  const spinner = Animated.loop(
    Animated.timing(spinValue, {
      toValue: 2,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  );

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = Animated.loop(
    Animated.timing(scaleAnim, {
      toValue: 1.1,
      duration: 50000,
      easing: Easing.elastic(100),
      useNativeDriver: true,
    }),
  );

  const scaleOnPress = Animated.loop(
    Animated.timing(scaleOnPressValue, {
      toValue: 1,
      duration: 50000,
      easing: Easing.elastic(100),
      useNativeDriver: true,
    }),
  );

  function handleAppStateChange(nextState: String) {
    if (nextState === 'active') {
      //handleReload();
      getBitcoinData();
    }
  }

  async function getBitcoinData() {
    const bitcoinData: storedData = await getStoredData('bitcoin-data');
    const storedParams: storedParams = await getStoredData('bitcoin-params');
    if (storedParams.bitcoinParams?.currency) {
      const symbol: string = getCurrencySymbol(
        storedParams.bitcoinParams?.currency,
      );
      setCurrencySymbol(symbol);
    }
    if (bitcoinData.bitcoinData) {
      setBitcoinPrice(bitcoinData.bitcoinData.bitcoinPrice);
      setBitcoinBalance(bitcoinData.bitcoinData.bitcoinBalance);
      setBitcoinProfit(bitcoinData.bitcoinData.bitcoinProfit);
    }
  }

  async function handleReload() {
    scale.start();
    spinner.start();
    try {
      const storedParams: storedParams = await getStoredData('bitcoin-params');

      if (storedParams.bitcoinParams === undefined) {
        throw new Error('Bitcoin data not found');
      }

      const {address, investedAmount, currency, darkMode} =
        storedParams.bitcoinParams;

      const bitcoinPrice: number = await getBitcoinPrice(currency);

      const bitcoinAmount: number = await getBitcoinAmountBlockChain(
        address.join('|'),
      );

      const bitcoinBalance: number = bitcoinAmount * bitcoinPrice;

      const profit: number = bitcoinBalance - investedAmount;

      const symbol: string = getCurrencySymbol(currency);

      /*const bitcoinAmount: number[] = await getBalances(address);
       const bitcoinBalance: number = bitcoinAmount.reduce((prev, accum) => {
        accum += prev;
        return accum * bitcoinPrice;
      }); */

      setBitcoinPrice(bitcoinPrice);
      setBitcoinBalance(bitcoinBalance);
      setBitcoinProfit(profit);
      setCurrencySymbol(symbol);

      setBitcoinPriceVariation(
        CalculateVariation(bitcoinPrice, prevBitcoinPrice.current),
      );

      setBitcoinBalanceVariation(
        CalculateVariation(bitcoinBalance, prevBitcoinBalance.current),
      );
      setBitcoinProfitVariation(
        CalculateVariation(profit, prevBitcoinProfit.current),
      );
      setIsDarkMode(darkMode);

      const valuesToStore: storedData = {
        bitcoinData: {
          bitcoinPrice: bitcoinPrice,
          bitcoinBalance: bitcoinBalance,
          bitcoinProfit: bitcoinBalance - investedAmount,
        },
      };

      await storeData('bitcoin-data', valuesToStore);
    } catch (error) {
      console.log('Error get Data', error);
    }
  }
  const toggleModal = () => {
    setIsVisibleModal(!isVisibleModal);
    handleDarkMode();
  };

  const textColor = {
    colorTitle: isDarkMode ? '#FFF9' : '#000',
    colorData: isDarkMode ? '#f36506' : '#f36506',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#FFF',
  };

  useEffect(() => {
    prevBitcoinPrice.current = bitcoinPrice;
    prevBitcoinBalance.current = bitcoinBalance;
    prevBitcoinProfit.current = bitcoinProfit;
  }, [bitcoinPrice]);

  useEffect(() => {
    //handleReload();
    getBitcoinData();
    handleDarkMode();
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    scale.reset();
    spinner.reset();
  }, [bitcoinBalance]);

  useEffect(() => {
    /* if (isWatch()) { */
    const unsubscribe = watchEvents.on('message', message => {
      console.log(
        'MESSAGE FROM SYNC================',
        JSON.stringify(message.data, null, 2),
      );
      //toastMessage('Message received from mobile');
      storeData('bitcoin-params', message.data)
        .then(success => {
          if (success) {
            console.log('bitcoin-params salvo com sucesso');
          }
        })
        .catch(e => {
          console.log('Erro ao salvar bitcoin-params', e);
        });
    });

    return () => {
      unsubscribe();
    };
    /* } */
  }, []);

  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ]);

      console.log('Bluetooth permissions:', granted);
    }
  }
  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  console.log('fontScale==========', fontScale);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ModalSettings
        visible={isVisibleModal}
        backgroundStyle={backgroundStyle}
        onClose={toggleModal}
        darkMode={isDarkMode}
      />
      <CustomScrollView
        indicatorColor={textColor.colorTitle}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleReload} />
        }
        contentContainerStyle={[
          styles.scrollview,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#252323',
          },
        ]}
        style={backgroundStyle}>
        <View
          style={[
            backgroundStyle,
            {
              alignItems: 'center',
              justifyContent: 'center',
              width: screenWidth,
              height: screenWidth,
              borderRadius: screenWidth,
              borderWidth: 1.2,
              borderColor: '#000',
              overflow: 'hidden',
            },
          ]}>
          <AnimatedIcon
            name="cog"
            size={35 * fontScale}
            color={textColor.colorTitle}
            onPress={toggleModal}
          />

          <Text
            style={[
              styles.textTitle,
              {
                color: textColor.colorTitle,
                fontSize: styles.textTitle.fontSize * fontScale,
              },
            ]}>
            Bitcoin Price:
          </Text>
          <View style={styles.variationContainer}>
            <Animated.Text
              style={[
                styles.textData,
                {
                  color: textColor.colorData,
                  transform: [{scale: scaleAnim}],
                  fontSize: styles.textData.fontSize * fontScale,
                },
              ]}>
              {currencySymbol} {FormatNumber(bitcoinPrice, 2)}{' '}
              <Text
                style={[
                  styles.variationText,
                  {
                    color: bitcoinProfitVariation < 0 ? 'red' : 'green',
                    fontSize: styles.variationText.fontSize * fontScale,
                  },
                ]}>
                {FormatNumber(bitcoinPriceVariation, 2)}%
              </Text>
            </Animated.Text>
          </View>
          <Text
            style={[
              styles.textTitle,
              {
                color: textColor.colorTitle,
                fontSize: styles.textTitle.fontSize * fontScale,
              },
            ]}>
            Bitcoin Balance:
          </Text>
          <View style={styles.variationContainer}>
            <Animated.Text
              style={[
                styles.textData,
                {
                  color: textColor.colorData,
                  transform: [{scale: scaleAnim}],
                  fontSize: styles.textData.fontSize * fontScale,
                },
              ]}>
              {currencySymbol} {FormatNumber(bitcoinBalance, 2)}{' '}
              <Text
                style={[
                  styles.variationText,
                  {
                    color: bitcoinProfitVariation < 0 ? 'red' : 'green',
                    fontSize: styles.variationText.fontSize * fontScale,
                  },
                ]}>
                {FormatNumber(bitcoinBalanceVariation, 2)}%
              </Text>
            </Animated.Text>
          </View>
          <Text
            style={[
              styles.textTitle,
              {
                color: textColor.colorTitle,
                fontSize: styles.textTitle.fontSize * fontScale,
              },
            ]}>
            Profit:
          </Text>
          <View style={styles.variationContainer}>
            <Animated.Text
              style={[
                styles.textData,
                {
                  color: textColor.colorData,
                  transform: [{scale: scaleAnim}],
                  fontSize: styles.textData.fontSize * fontScale,
                },
              ]}>
              {currencySymbol} {FormatNumber(bitcoinProfit, 2)}{' '}
              <Text
                style={[
                  styles.variationText,
                  {
                    color: bitcoinProfitVariation < 0 ? 'red' : 'green',
                    fontSize: styles.variationText.fontSize * fontScale,
                  },
                ]}>
                {FormatNumber(bitcoinProfitVariation, 2)}%
              </Text>
            </Animated.Text>
          </View>

          {/* <Button title="Receive" onPress={receiveMessageFromMobile} />
          <Button title="Send" onPress={sendMessageToWatch({})} /> */}
          <AnimatedIcon
            name="reload"
            color="green"
            size={40 * fontScale}
            onPress={handleReload}
            style={{transform: [{rotate: spin}]}}
            onPressIn={() => spinner.start()}
          />
        </View>
      </CustomScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenWidth,
    borderRadius: screenWidth,
    borderWidth: 1.2,
    borderColor: '#000',
    backgroundColor: '#574c4c',
  },
  dataContainer: {
    //flex: 1,
    backgroundColor: '#e5ff00',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenWidth,
    borderRadius: screenWidth,
    borderWidth: 1.2,
    borderColor: '#000',
  },
  scrollview: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
  },
  textTitle: {
    fontSize: 12,
    fontFamily: 'Arial',
  },
  textData: {
    fontSize: 19,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Arial',
  },
  modalTextInput: {
    padding: 5,
    height: 40,
    width: screenWidth - 30,
    borderRadius: 20,
    marginBottom: 5,
    fontSize: 18,
  },
  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  variationText: {
    paddingLeft: 5,
    fontSize: 12,
  },
});

export default Home;
