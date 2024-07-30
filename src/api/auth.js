import firebase from './firebase';
import auth from '@react-native-firebase/auth';
// export const login = phoneNumber => {
//   const databaseRef = firebase.database().ref('users');
//   databaseRef.on('value', snapshot => {
//     const nodeData = snapshot.val();
//     Object.keys(nodeData).forEach(item => {
//       if (nodeData[item].mobile_number === phoneNumber) return true;
//       return false;
//     });
//   });
// };

export const login = phoneNumber => {
  return new Promise((resolve, reject) => {
    const databaseRef = firebase.database().ref('users');

    databaseRef.on(
      'value',
      snapshot => {
        const nodeData = snapshot.val();
        let userExists = false;

        if (nodeData) {
          Object.keys(nodeData).forEach(item => {
            if (nodeData[item].mobile_number === phoneNumber) {
              userExists = true;
            }
          });
        }

        // Cleanup the listener
        databaseRef.off('value');

        resolve(userExists);
      },
      error => {
        reject(error);
      },
    );
  });
};

export const sendOTP = async phoneNumber => {
  try {
    console.log(phoneNumber, '--');
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    console.log('Error2', error);
  }
};


