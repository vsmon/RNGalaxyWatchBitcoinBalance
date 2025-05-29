import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStoredData, storeData} from '../../Database';
import tostMessage from '../../Utils/ToastMessage';
import {storedParams} from '../../types';
import CustomScrollView from '../CustomScrollView';

type ModalSettingsProps = {
  visible: boolean;
  backgroundStyle: {backgroundColor: string};
  onClose: any;
  darkMode: boolean;
};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function ModalSettings({
  visible,
  backgroundStyle,
  onClose,
  darkMode,
}: ModalSettingsProps) {
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('');
  const [investedAmount, setInvestedAmount] = useState<string>('0');
  const [currency, setCurrency] = useState<string>('BRL');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  async function handleData() {
    const storedData: storedParams = await getStoredData('bitcoin-params');

    if (storedData.bitcoinParams === undefined) {
      throw new Error('Bitcoin data not found');
    }

    const {address, investedAmount, currency, darkMode} =
      storedData.bitcoinParams;

    setBitcoinAddress(address && address.join(','));
    setInvestedAmount(investedAmount.toString());
    setCurrency(currency);
    setIsDarkMode(darkMode);
  }

  const [textColor, setTextColor] = useState<{
    colorTitle: string;
    colorData: string;
    backgroundColor: string;
  }>({
    colorTitle: darkMode ? '#fff' : '#000000',
    colorData: darkMode ? '#000' : '#FFF',
    backgroundColor: darkMode ? '#FFF' : '#000',
  });

  const [darkModeBackgroundColor, setDarkModeBackgroundColor] = useState<{
    backgroundColor: string;
  }>(backgroundStyle);

  /* const textColor = {
    colorTitle: darkMode ? '#fff' : '#000000',
    colorData: darkMode ? '#000' : '#FFF',
    backgroundColor: darkMode ? '#FFF' : '#000',
  }; */

  useEffect(() => {
    handleData();
  }, [visible]);

  useEffect(() => {
    setTextColor({
      colorTitle: isDarkMode ? '#fff' : '#000000',
      colorData: isDarkMode ? '#000' : '#FFF',
      backgroundColor: isDarkMode ? '#FFF' : '#000',
    });
    setDarkModeBackgroundColor({
      backgroundColor: isDarkMode ? '#000' : '#FFF',
    });
    console.log('darkMode==========', isDarkMode);
    console.log('backgroundStyle=======', darkModeBackgroundColor);
    console.log('=======================================================');
  }, [isDarkMode]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={onClose}
      animationType="none">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          flexDirection: 'row',
        }}>
        <View style={[styles.modalContainer, darkModeBackgroundColor]}>
          <MaterialCommunityIcons
            name="close-circle"
            color={textColor.colorTitle}
            size={42}
            onPress={onClose}
          />
          <CustomScrollView
            style={{}}
            indicatorColor={textColor.backgroundColor}
            //scrollEnabled={true}
            //showsVerticalScrollIndicator={true}
            //</View>indicatorStyle="white"
          >
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={[styles.labelText, {color: textColor.colorTitle}]}>
                  Bitcoin Addresses:
                </Text>
                <MaterialCommunityIcons
                  name="information-outline"
                  color={textColor.colorTitle}
                  size={15}
                  onPress={() => {
                    tostMessage('Type bitcoin wallet separate by comma');
                  }}
                />
              </View>
              <TextInput
                style={[
                  styles.modalTextInput,
                  {
                    color: textColor.colorData,
                    backgroundColor: textColor.backgroundColor,
                  },
                ]}
                placeholder="Bitcoin addresses..."
                placeholderTextColor={textColor.colorData}
                value={bitcoinAddress}
                onChangeText={text => setBitcoinAddress(text)}
                autoCapitalize="none"
              />
              <Text style={[styles.labelText, {color: textColor.colorTitle}]}>
                Invested Amount:
              </Text>
              <TextInput
                style={[
                  styles.modalTextInput,
                  {
                    color: textColor.colorData,
                    backgroundColor: textColor.backgroundColor,
                  },
                ]}
                placeholder="Invested Amount..."
                placeholderTextColor={textColor.colorData}
                value={investedAmount}
                onChangeText={text => setInvestedAmount(text)}
                autoCapitalize="none"
                keyboardType="numbers-and-punctuation"
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.labelText, {color: textColor.colorTitle}]}>
                  Currency:
                </Text>
                <MaterialCommunityIcons
                  name="information-outline"
                  color={textColor.colorTitle}
                  size={15}
                  onPress={() => {
                    tostMessage('Type currency like "USD"');
                  }}
                />
              </View>
              <TextInput
                style={[
                  styles.modalTextInput,
                  {
                    color: textColor.colorData,
                    backgroundColor: textColor.backgroundColor,
                  },
                ]}
                placeholder="Currency..."
                placeholderTextColor={textColor.colorData}
                value={currency}
                onChangeText={text => setCurrency(text)}
                autoCapitalize="none"
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Text style={[styles.labelText, {color: textColor.colorTitle}]}>
                Dark Mode:
              </Text> */}
                <MaterialCommunityIcons
                  name="weather-sunny"
                  size={25}
                  color={textColor.colorTitle}
                />
                <Switch
                  trackColor={{false: '#3e3e3e', true: '#3e3e3e'}}
                  thumbColor={isDarkMode ? '#002792' : '#FFFF22'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={value => setIsDarkMode(value)}
                  value={isDarkMode}
                  style={{
                    alignSelf: 'flex-start',
                  }}
                />
                <MaterialCommunityIcons
                  name="moon-waning-crescent"
                  size={25}
                  color={textColor.colorTitle}
                />
              </View>
              <MaterialCommunityIcons
                name="content-save-all"
                color="#2194A4"
                size={42}
                style={{alignSelf: 'center'}}
                onPress={() => {
                  const address: string[] = bitcoinAddress.split(',');
                  storeData('bitcoin-params', {
                    bitcoinParams: {
                      address: address,
                      investedAmount: Number(investedAmount),
                      currency,
                      darkMode: isDarkMode,
                    },
                  });
                  tostMessage('Data was stored');
                }}
              />
            </View>
          </CustomScrollView>
        </View>
        {/* <View
          style={{
            flex: 1,
            backgroundColor: 'red',
            height: 150,
            width: 100,
            position: 'absolute',
            left: Dimensions.get('screen').width - 100,
            //borderRadius: 10,
            borderStartWidth: 30,
            borderStartStartRadius: -30,
            borderTopEndRadius: 50,
            borderBottomEndRadius: 50,
          }}></View> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalTextInput: {
    padding: 5,
    height: 40,
    width: screenWidth - 30,
    borderRadius: 20,
    marginBottom: 5,
    fontSize: 18,
    color: '#FFF',
  },
  labelText: {
    marginLeft: 10,
  },
});
