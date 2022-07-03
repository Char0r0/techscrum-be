const replaceAll = (source: string, targetString: string, shiftString: string) => {
  let targetStringExistFlag = source.includes(targetString);
  while (targetStringExistFlag) {
    source = source.replace(targetString, shiftString);
    targetStringExistFlag = source.includes(targetString);
  }
  return source;
};

const replaceId = (input: any) => {
  const inputString = replaceAll(JSON.stringify(input), '_id', 'id');
  const result = JSON.parse(inputString);
  return result;
};

export default replaceId;
