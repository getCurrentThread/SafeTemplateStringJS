function parseTemplateString(templateString, data) {
  const regExp = /\${(.*?)}/g;
  return templateString.replace(regExp, (match, expression) => {
    const [propertyName, ...args] = expression.split(/\s*[(,]\s*/);
    const propertyValue = getProperty(data, propertyName.trim());
    if (propertyValue === undefined) {
      return '';
    }
    if (args[0] !== '') {
      let result = propertyValue;
      for (let arg of args) {
        if (arg.endsWith(')')) {
          result = applyFunction(result, arg, data);
        }
      }
      return result;
    }
    return propertyValue;
  });
}

function getProperty(data, propertyName) {
  return data[propertyName];
}

function applyFunction(value, arg, data) {
  const [funcName, ...funcArgs] = arg.split(/\s*[(,]\s*/);
  const trimmedFuncName = funcName.trim();
  const processedArgs = funcArgs.map(arg => {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return arg.slice(1, -1);
    } else if (arg in data) {
      return data[arg];
    } else {
      return arg;
    }
  });
  const func = data[trimmedFuncName] || value[trimmedFuncName];
  if (func !== undefined) {
    return func.apply(null, [value, ...processedArgs]);
  }
  return value;
}
