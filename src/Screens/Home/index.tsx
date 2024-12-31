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
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {getStoredData, storeData} from '../../Database/index';
import {getBitcoinAmountBlockCypher, getBitcoinPrice} from '../../Services';
import ModalSettings from '../../Components/ModalSettings';

import {storedData, storedParams} from '../../types';
import FormatNumber from '../../Utils/FormatNumberToLocaleString';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [bitcoinBalance, setBitcoinBalance] = useState<string>('0');
  const [bitcoinPrice, setBitcoinPrice] = useState<string>('0');
  const [investedAmount, setInvestedAmount] = useState<string>('0');

  const AnimatedIcon = Animated.createAnimatedComponent(Icon);

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
  useEffect(() => {
    scale.reset();
    spinner.reset();
  }, [bitcoinBalance]);

  async function getBitcoinData() {
    const bitcoinData: storedData = await getStoredData('bitcoin-data');
    if (bitcoinData.bitcoinData) {
      setBitcoinPrice(FormatNumber(bitcoinData.bitcoinData.bitcoinPrice, 2));
      setBitcoinBalance(
        FormatNumber(bitcoinData.bitcoinData.bitcoinBalance, 2),
      );
      setInvestedAmount(FormatNumber(bitcoinData.bitcoinData.bitcoinProfit, 2));
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

      const bitcoinAmount: number = await getBitcoinAmountBlockCypher(
        address.join(';'),
      );

      const bitcoinBalance: number = bitcoinAmount * bitcoinPrice;

      /*const bitcoinAmount: number[] = await getBalances(address);
       const bitcoinBalance: number = bitcoinAmount.reduce((prev, accum) => {
        accum += prev;
        return accum * bitcoinPrice;
      }); */

      setBitcoinPrice(FormatNumber(bitcoinPrice, 2));
      setBitcoinBalance(FormatNumber(bitcoinBalance, 2));
      setInvestedAmount(FormatNumber(bitcoinBalance - investedAmount, 2));
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

  return (
    <View style={styles.container}>
      <ModalSettings
        visible={isVisibleModal}
        backgroundStyle={backgroundStyle}
        onClose={toggleModal}
        darkMode={isDarkMode}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleReload} />
        }
        contentContainerStyle={[styles.scrollview, {backgroundColor: '#FFF2'}]}
        style={backgroundStyle}>
        <View style={[styles.dataContainer, backgroundStyle]}>
          <AnimatedIcon
            name="cog"
            size={35}
            color={textColor.colorTitle}
            /* style={{
              transform: [{scale: scaleOnPressValue}],
            }} */

            onPress={toggleModal}
            /* onPressIn={() => scaleOnPress.start()}
            onPressOut={() => scaleOnPress.reset()} */
          />

          <Text style={[styles.textTitle, {color: textColor.colorTitle}]}>
            Bitcoin Price:
          </Text>
          <Animated.Text
            style={[
              styles.textData,
              {color: textColor.colorData, transform: [{scale: scaleAnim}]},
            ]}>
            ${bitcoinPrice}
          </Animated.Text>
          <Text style={[styles.textTitle, {color: textColor.colorTitle}]}>
            Bitcoin Balance:
          </Text>
          <Animated.Text
            style={[
              styles.textData,
              {color: textColor.colorData, transform: [{scale: scaleAnim}]},
            ]}>
            ${bitcoinBalance}
          </Animated.Text>
          <Text style={[styles.textTitle, {color: textColor.colorTitle}]}>
            Profit:
          </Text>
          <Animated.Text
            style={[
              styles.textData,
              {color: textColor.colorData, transform: [{scale: scaleAnim}]},
            ]}>
            ${investedAmount}
          </Animated.Text>

          <AnimatedIcon
            name="reload"
            color="green"
            size={40}
            onPress={handleReload}
            style={{transform: [{rotate: spin}]}}
            onPressIn={() => spinner.start()}
          />
        </View>
      </ScrollView>
    </View>
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
    flex: 1,
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
});

export default Home;
