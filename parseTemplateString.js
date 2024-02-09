function applyFiltersAndFunctions(args, propertyValue, data) {
  for (let arg of args) {
    if (arg.endsWith(')')) {
      propertyValue = applyFunction(arg, propertyValue, data);
    } else {
      propertyValue = applyFilter(arg, propertyValue, data);
    }
  }
  return propertyValue;
}

function applyFunction(arg, propertyValue, data) {
  let [funcName, ...funcArgs] = arg.split(/\s*[(,]\s*/);
  funcName = funcName.trim();
  funcArgs = parseFunctionArguments(funcArgs, data);
  const func = data[funcName] || propertyValue[funcName];
  if (func !== undefined) {
    propertyValue = func.apply(null, [propertyValue, ...funcArgs]);
  }
  return propertyValue;
}

function parseFunctionArguments(funcArgs, data) {
  return funcArgs.map(arg => {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return arg.slice(1, -1);
    } else if (arg in data) {
      return data[arg];
    } else {
      return arg;
    }
  });
}

function applyFilter(arg, propertyValue, data) {
  const filter = data[arg] || propertyValue[arg];
  if (filter !== undefined) {
    propertyValue = filter.apply(null, [propertyValue]);
  }
  return propertyValue;
}

function parseTemplateString(templateString, data) {
  const regExp = /\${(.*?)}/g;
  return templateString.replace(regExp, (match, expression) => {
    let [expressionString, filters = ''] = expression.split('|');
    const [propertyName, ...args] = expressionString.split(/\s*[(,]\s*/);
    let propertyValue = data[propertyName.trim()];
    if (propertyValue === undefined) {
      return '';
    }
    if (args[0] !== '') {
      propertyValue = applyFiltersAndFunctions(args, propertyValue, data);
    }
    return propertyValue;
  });
}
