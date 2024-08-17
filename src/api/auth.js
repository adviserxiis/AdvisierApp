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

// export const login = phoneNumber => {
//   return new Promise((resolve, reject) => {
//     const databaseRef = firebase.database().ref('users');

//     databaseRef.on(
//       'value',
//       snapshot => {
//         const nodeData = snapshot.val();
//         let userExists = false;

//         if (nodeData) {
//           Object.keys(nodeData).forEach(item => {
//             if (nodeData[item].mobile_number === phoneNumber) {
//               userExists = true;
//             }
//           });
//         }

//         // Cleanup the listener
//         databaseRef.off('value');

//         resolve(userExists);
//       },
//       error => {
//         reject(error);
//       },
//     );
//   });
// };

// export const sendOTP = async phoneNumber => {
//   try {
//     console.log(phoneNumber, '--');
//     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//     return confirmation;
//   } catch (error) {
//     console.log('Error2', error);
//   }
// };


export const googleLogin = async()=>{
  try{
    await GoogleSignin.hasPlayServices();
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
    const result = await firebase.auth().signInWithCredential(googleCredential);
    const user = result.user;
    const userRef = firebase.database().ref(`users/${user.uid}`);
    await userRef.update({
      email: user.email,
    });
  }
  catch(error){
    console.log('Error', error);
    throw error;
  }
}

export const loginWithEmail = async(email, password)=>{
  try{
    const result = await firebase.auth().signInWithEmailAndPassword(email, password);
    return result.user;
  }
  catch(error){
    console.log('Error', error);
    throw error;
  }
}

export const registerWithEmail = async (email, password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const userRef = firebase.database().ref(`users/${user.uid}`);
    await userRef.set({
      email: user.email,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};




