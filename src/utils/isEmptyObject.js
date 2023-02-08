export function isEmptyObject(obj) {
  for (var key in obj) {
    console.log("🚀 ~ file: isEmptyObject.js:5 ~ isEmptyObject ~ key", key);
    if (!obj.hasOwnProperty(key) || obj[key] === null || obj[key] === "") {
      return false;
    }
  }
  return true;
}

export function isNumber(input) {
  return /^\d+$/.test(input);
}
