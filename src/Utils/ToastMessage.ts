import {ToastAndroid} from 'react-native';

export default function tostMessage(message: string) {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
    0,
    0,
  );
}
