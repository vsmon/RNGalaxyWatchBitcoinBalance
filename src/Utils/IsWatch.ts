import {Dimensions} from 'react-native';

export default function isWatch(): boolean {
  const {width, height} = Dimensions.get('window');

  if (width < 500 && height < 500) {
    console.log('Running Wear OS');
    return true;
  } else {
    console.log('running Mobile/Tablet');
    return false;
  }
}
