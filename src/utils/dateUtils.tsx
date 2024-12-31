export const extractTypeAndId = (url: string): {type: string; id: string} => {
  let type: string = '';
  let id: string = '';

  // Regex patterns to match each type of URL
  const reelPattern1 =
    /^https:\/\/adviserxiis.com\/share\/reel\/([a-f\d]{24})$/;
  const reelPattern2 = /^adviserxiis:\/\/share\/reel\/([a-f\d]{24})$/;
  const userPattern1 =
    /^http:\/\/adviserxiis.com\/share\/user\/([a-zA-Z0-9_]+)$/;
  const userPattern2 = /^adviserxiis:\/\/share\/user\/([a-zA-Z0-9_]+)$/;

  if (reelPattern1.test(url)) {
    type = 'reel';
    id = url.match(reelPattern1)![1];
  } else if (reelPattern2.test(url)) {
    type = 'reel';
    id = url.match(reelPattern2)![1];
  } else if (userPattern1.test(url)) {
    type = 'user';
    id = url.match(userPattern1)![1];
  } else if (userPattern2.test(url)) {
    type = 'user';
    id = url.match(userPattern2)![1];
  } else {
    console.log('URL format not recognized');
  }

  return {type, id};
};


