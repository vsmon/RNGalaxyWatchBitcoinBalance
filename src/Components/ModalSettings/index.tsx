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

type ModalSettingsProps = {
  visible: boolean;
  backgroundStyle: any;
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    handleData();
  }, [visible]);

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

  const textColor = {
    colorTitle: darkMode ? '#fff9' : '#000000',
    colorData: darkMode ? '#000' : '#FFF9',
    backgroundColor: darkMode ? '#FFF9' : '#000',
  };

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
        }}>
        <View style={[styles.modalContainer, backgroundStyle]}>
          <MaterialCommunityIcons
            name="close-circle"
            color={textColor.colorTitle}
            size={42}
            onPress={onClose}
          />
          <ScrollView>
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
                  color={'#FFF8'}
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
                //placeholderTextColor="#000"
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
                //placeholderTextColor="#000"
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
                  color={'#FFF8'}
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
                //placeholderTextColor="#000"
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
          </ScrollView>
        </View>
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
