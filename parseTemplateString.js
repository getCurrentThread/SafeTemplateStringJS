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
      for (let arg of args) {
        if (arg.endsWith(')')) {
          let [funcName, ...funcArgs] = arg.split(/\s*[(,]\s*/);
          funcName = funcName.trim();
          funcArgs = funcArgs.map(arg => {
            if (arg.startsWith('"') && arg.endsWith('"')) {
              return arg.slice(1, -1);
            } else if (arg in data) {
              return data[arg];
            } else {
              return arg;
            }
          });
          const func = data[funcName] || propertyValue[funcName];
          if (func !== undefined) {
            propertyValue = func.apply(null, [propertyValue, ...funcArgs]);
          }
        } else {
          const filterNames = filters.split(',').map(filter => filter.trim());
          for (let filterName of filterNames) {
            const filter = data[filterName] || propertyValue[filterName];
            if (filter !== undefined) {
              propertyValue = filter.apply(null, [propertyValue]);
            }
          }
        }
      }
    }
    return propertyValue;
  });
}
