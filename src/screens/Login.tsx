import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Pressable,
} from 'react-native';

const Login = () => {
  return (
    <SafeAreaView style={styles.outerContainer}>
      <Image source={require('../assets/images/logo.png')} />
      <Text style={styles.heading}>Sign in or create Account</Text>
      <Text style={styles.subHeading}>
        Hello! Looks like you’re enjoying our page, but you haven’t signed up
        for an account yet.
      </Text>
      <TextInput
        style={styles.input}
        value=""
        placeholderTextColor="#FFFFFF"
        placeholder="Phone Number"
      />
      <Pressable style={styles.loginBtnContainer}>
        <Text style={styles.loginTxt}>Login</Text>
      </Pressable>
      <Text style={styles.bottomTxt}>
        by creating an account, you agree to our’s Privacy Policy and Terms of
        Use.
      </Text>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  subHeading: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  input: {
    color: '#FFFFFF',
    borderWidth: 2,

    padding: 15,
    marginHorizontal: 10,
    width: '80%',
    backgroundColor: '#323232',
    borderRadius: 12,
  },
  loginBtnContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    width: '80%',
    marginVertical: 20,
    borderRadius: 10,
  },
  loginTxt: {
    textAlign: 'center',
    color: '#161616',
    fontWeight: '700',
    fontSize: 18,
  },
  bottomTxt: {
    color: '#FFFFFF',
    marginHorizontal: 25,
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
  },
});
