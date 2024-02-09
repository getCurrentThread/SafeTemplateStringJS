# parseTemplateString

`parseTemplateString` 함수는 문자열 템플릿을 해석하여 템플릿 내에 포함된 변수를 데이터 객체에서 가져와서 실제 값을 대입한 결과 문자열을 반환합니다. 이는 템플릿 문자열을 직접 구현하는 간단한 예시이며, 템플릿 문자열을 직접 구현해야하는 상황에서 사용할 수 있습니다.

사용 방법
`parseTemplateString` 함수는 다음과 같이 사용할 수 있습니다.

```javascript
const result = parseTemplateString(templateString, data);
```

`templateString`은 해석하고자 하는 ES6의 템플릿 리터럴 형태의 문자열입니다. {} 안에 변수 이름이나 함수 이름, 필터 이름 등을 적어주면 됩니다.

`data`는 `templateString`에서 사용될 데이터를 담고 있는 객체입니다. 변수 이름이나 함수 이름 등을 `data` 객체에 프로퍼티로 정의해 두어야 합니다.

## 예시

다음은 parseTemplateString 함수의 사용 예시입니다.

```javascript
const data = {
  name: 'Alice',
  greeting: function(name, msg) {
    return `${msg}, ${name}!`;
  }
};

const templateString = "\
  <div>\
    <p>${ greeting(name, \"Hi\") }</p>\
  </div>\
";

const result = parseTemplateString(templateString, data);
console.log(result); // <div><p>HI, ALICE!</p></div>
```

## 지원하는 기능

parseTemplateString 함수는 다음과 같은 기능을 지원합니다.

* 변수: `${ 변수이름 }`
* 함수: `${ 함수이름(인자1, 인자2, ...) }`
* 필터: `${ 변수 | 필터이름 }`

위의 기능은 중첩하여 사용이 가능합니다 `${ 함수(인자1, 함수(인자2), ...) }`

## 주의 사항

- `parseTemplateString` 함수에서 사용할 수 있는 변수나 함수 등은 `data` 객체에 미리 정의되어 있어야 합니다.
- `parseTemplateString` 함수는 기본적으로 **XSS 공격**에 취약합니다. result 값을 HTML에 삽입하기 전에 꼭 필터링하여 사용해야 합니다.

## 변수 참조

templateString 내에서 변수를 참조할 때는 ${variableName} 형태로 참조할 수 있습니다. variableName은 data 객체에서 가져올 변수 이름입니다. 변수 이름에는 문자, 숫자, 언더스코어, 달러 기호를 사용할 수 있습니다. 하지만 변수 이름의 첫 글자는 반드시 문자나 언더스코어여야 합니다.

```javascript
const templateString = 'Hello, ${firstName} ${lastName}!';
const data = { firstName: 'John', lastName: 'Doe' };
const result = parseTemplateString(templateString, data);
console.log(result); // 'Hello, John Doe!'
```

## 함수

parseTemplateString 함수는 템플릿 내에서 함수를 호출할 수 있는 기능을 제공합니다. 함수를 호출하려면 \${functionName(arguments)} 형태로 작성해야 합니다. 함수 이름 뒤에 괄호를 사용하여 함수의 인수를 전달할 수 있습니다.

```javascript
const templateString = 'The result is ${multiply(a, b)}';
const data = { a: 10, b: 5, multiply: (a, b) => a * b }
const result = parseTemplateString(templateString, data);
console.log(result); // 'The result is 50'
```

위의 예시에서는 multiply 라는 함수를 정의하여 a와 b 변수의 값을 곱한 반환값으로 나타내었습니다. 이 때에 해당 함수는 data 객체에 정의되어 있거나, 기본적으로 제공되는 내장 함수들을 사용할 수 있습니다.
