import {Alert, Platform} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

export const pickImage = setImage => {
  const options = {
    mediaType: 'photo',
    quality: 1,
  };

  ImagePicker.launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    } else {
      const uri =
        Platform.OS === 'android'
          ? response.assets[0].uri
          : response.assets[0].uri.replace('file://', '');
      setImage(uri);
    }
  });
};
