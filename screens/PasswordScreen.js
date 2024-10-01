import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const PasswordScreen = () => {
  const [password, setPassword] = React.useState('');
  const navigation = useNavigation();
  const handleNext = () => {
    navigation.navigate('Name');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginTop: 90, marginLeft: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="lock1" size={24} color="black" />
          </View>
          <Image
            style={{width: 100, height: 40}}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: 'black',
            marginTop: 15,
          }}>
          Please a choose a password
        </Text>
        <TextInput
          autoFocus={true}
          value={password}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          style={{
            width: 340,
            marginVertical: 10,
            borderBlockColor: 'black',
            borderBottomWidth: 1,
            paddingBottom: 10,
            fontSize: password ? 22 : 22,
          }}
          placeholder="Enter your password"
        />
        <Text style={{color: 'gray', fontSize: 15, marginTop: 7}}>
          Note: Your details will be safe with us.
        </Text>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          style={{marginTop: 30, marginLeft: 'auto'}}>
          <MaterialCommunityIcons
            name="arrow-right-circle"
            size={45}
            color="green"
            style={{marginTop: 30, marginLeft: 'auto', marginRight: 20}}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({});
