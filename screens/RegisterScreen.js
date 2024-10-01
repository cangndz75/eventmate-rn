import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [email, setEmail] = React.useState('');
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={{padding: 13}}>
        <Text style={{fontSize: 16, fontWeight: '500'}}>Deneme</Text>
        <View style={{flexDirection: 'column', gap: 16, marginVertical: 40}}>
          <Text style={{color: 'black'}}>Enter Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={{
              padding: 15,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              borderRadius: 10,
            }}
          />
          <Pressable
          onPress={() => navigation.navigate('Password')}
            style={{
              padding: 15,
              backgroundColor: email?.length > 4 ? '#2dcf30' : '#E0E0E0',
              borderRadius: 8,
            }}>
            <Text style={{textAlign: 'center', color: 'black', fontSize: 14}}>
              Next
            </Text>
          </Pressable>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{textAlign: 'center', color: 'black', fontSize: 14}}>
            I agree to recieve updates over WhatsApp
          </Text>
          <Text style={{textAlign: 'center', color: 'black', fontSize: 14}}>
            Terms of Service & Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
