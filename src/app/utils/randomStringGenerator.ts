const RANDOM_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const randomStringGenerator = (stringLength: number) => {
  var result = '';
  var characters = RANDOM_CHAR;
  var charactersLength = characters.length;

  for (var i = 0; i < stringLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export { randomStringGenerator };
