import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const PreFinalScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginTop: 80}}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginLeft: 20,
            color: 'black',
          }}>
          All set to register
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginLeft: 20,
            marginTop: 10,
            color: 'gray',
          }}>
          Setting up your account.
        </Text>
      </View>
      <Pressable
        style={{backgroundColor: '#03c03c', padding: 15, marginTop: 'auto'}}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: 15,
          }}>
          Finish Registering
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PreFinalScreen;

const styles = StyleSheet.create({});
