import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import store from './src/store/store';
import Navigator from './src/navigator/Navigator';
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
