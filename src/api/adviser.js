//6825f3c0-45f0-11ef-9968-9dbd2bf34b00
import firebase from './firebase';

export const getAdviserDetail = async id => {
  return new Promise((resolve, reject) => {
    const databaseRef = firebase.database().ref('advisers');

    databaseRef.on(
      'value',
      snapshot => {
        const nodeData = snapshot.val();
        let userExists;

        if (nodeData) {
          Object.keys(nodeData).forEach(item => {
            if (item === id) {
              userExists = nodeData[id];
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

export const getAdviserPostDetail = async adviserId => {
  return new Promise((resolve, reject) => {
    const databaseRef = firebase.database().ref('advisers_posts');

    databaseRef.on(
      'value',
      snapshot => {
        const nodeData = snapshot.val();
        let postDetails = [];

        if (nodeData) {
          Object.keys(nodeData).forEach(item => {
            if (nodeData[item]['adviserid'] === adviserId) {
              postDetails.push(nodeData[item]);
            }
          });
        }

        // Cleanup the listener
        databaseRef.off('value');

        resolve(postDetails);
      },
      error => {
        reject(error);
      },
    );
  });
};
