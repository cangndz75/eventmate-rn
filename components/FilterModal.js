import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

const FilterModal = ({visible, onClose, onApply}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const categories = ['All', 'Music', 'Workshops', 'Art', 'Food & Drink'];

  const toggleCategory = category => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category],
    );
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setLocation('');
    setIsPaid(false);
    setSelectedDate(new Date());
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 20,
            borderRadius: 15,
            padding: 20,
          }}>
          <ScrollView>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
              Filter
            </Text>

            {/* Event Category */}
            <Text style={{fontSize: 16, fontWeight: '600'}}>
              Event Category
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginVertical: 10,
              }}>
              {categories.map((category, index) => (
                <Pressable
                  key={index}
                  onPress={() => toggleCategory(category)}
                  style={{
                    backgroundColor: selectedCategories.includes(category)
                      ? '#7b61ff'
                      : '#ddd',
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 10,
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: selectedCategories.includes(category)
                        ? 'white'
                        : 'black',
                    }}>
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={{fontSize: 16, fontWeight: '600'}}>
              Ticket Price Range
            </Text>
            <Slider
              minimumValue={0}
              maximumValue={1000}
              step={10}
              value={priceRange[0]} 
              onSlidingComplete={value => setPriceRange([value, priceRange[1]])}
              style={{width: '100%', height: 40}}
            />

            <Slider
              minimumValue={0}
              maximumValue={1000}
              step={10}
              value={priceRange[1]} 
              onSlidingComplete={value => setPriceRange([priceRange[0], value])} 
              style={{width: '100%', height: 40}}
            />

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>${priceRange[0]}</Text>
              <Text>${priceRange[1]}</Text>
            </View>

            <Text style={{fontSize: 16, fontWeight: '600', marginTop: 15}}>
              Event Date
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{marginVertical: 10}}>
              <TextInput
                editable={false}
                value={selectedDate.toDateString()}
                style={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                }}
              />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={{fontSize: 16, fontWeight: '600', marginTop: 15}}>
              Location
            </Text>
            <TextInput
              placeholder="Enter Location"
              value={location}
              onChangeText={setLocation}
              style={{
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
                marginTop: 10,
              }}
            />

            <Text style={{fontSize: 16, fontWeight: '600', marginTop: 15}}>
              Event Type
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Pressable
                onPress={() => setIsPaid(!isPaid)}
                style={{
                  backgroundColor: isPaid ? '#7b61ff' : '#ddd',
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  marginRight: 10,
                }}>
                <Text style={{color: isPaid ? 'white' : 'black'}}>Paid</Text>
              </Pressable>
              <Pressable
                onPress={() => setIsPaid(!isPaid)}
                style={{
                  backgroundColor: !isPaid ? '#7b61ff' : '#ddd',
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                }}>
                <Text style={{color: !isPaid ? 'white' : 'black'}}>Public</Text>
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Pressable
                onPress={resetFilters}
                style={{backgroundColor: '#ddd', padding: 15, borderRadius: 8}}>
                <Text>Reset</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  onApply({
                    selectedCategories,
                    priceRange,
                    location,
                    selectedDate,
                    isPaid,
                  })
                }
                style={{
                  backgroundColor: '#7b61ff',
                  padding: 15,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'white'}}>Apply</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
