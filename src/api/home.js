import firebase from './firebase';
export const videoList = () => {
  const databaseRef = firebase.database().ref('advisers_posts');

  return new Promise((resolve, reject) => {
    databaseRef.on('value', snapshot => {
      const nodeData = snapshot.val();
      const result = [];
      Object.keys(nodeData).forEach(item => {
        result.push({post: nodeData[item], postId: item});

        resolve(result);
      });
    });
  });
};

export const likeVideo = async id => {
  console.log('kkk');
  const databaseRef = await firebase
    .database()
    .ref('advisers_posts/' + id)
    .once('value');
  const currentValue = databaseRef.val().likes;
  currentValue.push('abc');

  await firebase
    .database()
    .ref('advisers_posts/' + id)
    .update({['likes']: currentValue});
  console.log('likes updated');

  // await firebase
  //   .database()
  //   .ref(nodePath)
  //   .update({[key]: value});
};
