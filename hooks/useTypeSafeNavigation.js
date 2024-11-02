import {useNavigation} from '@react-navigation/native';

function useTypeSafeNavigation() {
  const navigation = useNavigation();
  return navigation;
}

export default useTypeSafeNavigation;
