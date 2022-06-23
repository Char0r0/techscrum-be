const replaceAll = (source: string, targetString: string, shiftString: string) => {
  let targetStringExistFlag = source.includes(targetString);
  while (targetStringExistFlag) {
    source = source.replace(targetString, shiftString);
    targetStringExistFlag = source.includes(targetString);
  }
  return source;
};

export default replaceAll;
