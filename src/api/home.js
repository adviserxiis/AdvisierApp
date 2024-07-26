import firebase from './firebase';
export const videoList = () => {
  const databaseRef = firebase.database().ref('advisers_posts');

  return new Promise((resolve, reject) => {
    databaseRef.on('value', snapshot => {
      const nodeData = snapshot.val();
      const result = [];
      Object.keys(nodeData).forEach(item => {
        result.push(nodeData[item].post_file);

        resolve(result);
      });
    });
  });
};
