import {useSelector} from 'react-redux';
import Auth from './Auth';
import Main from './Main';

const Navigator = () => {
  const user = useSelector(state => state.user);
  console.log('🚀 ~ Navigator ~ user:', user.phoneNumber.length);
  return <Main />;
  // return user.phoneNumber.length === 0 ? <Auth /> : <Main />;
};

export default Navigator;
