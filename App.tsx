import {View, Text, StyleSheet} from 'react-native';
import Login from './src/screens/Login';
import OTPVerification from './src/screens/OTPVerification';
import Navigator from './src/navigator/Navigator';

const App = () => {
  // return <Login />;
  // return <OTPVerification />;
  return <Navigator />;
};

export default App;
