# Safe Template String Parser

이 라이브러리는 안전하고 유연한 템플릿 문자열 파싱 및 평가 기능을 제공합니다. 복잡한 수학 표현식, 변수 참조, 함수 호출, 배열 인덱싱 등을 지원하며, `eval()` 또는 `new Function()`을 사용하지 않아 보안상 안전합니다.

## 주요 기능

- 변수 참조 및 중첩 객체 속성 접근
- 배열 인덱싱 및 배열 요소의 속성 접근
- 기본 산술 연산 (+, -, *, /, %, ^)
- 함수 호출 (min, max, abs, round, floor, ceil)
- 괄호를 사용한 복잡한 표현식
- 안전한 평가 (no eval, no new Function)

## 사용 방법

### 1. 라이브러리 가져오기

```javascript
const { parseTemplateString } = require('safe-template-parser');
```

### 2. 템플릿 문자열 정의

템플릿 문자열 내에서 `{{ }}` 를 사용하여 표현식을 작성합니다.

```javascript
const template = "안녕하세요, {{name}}님. 당신의 나이는 {{age}}세이고, {{address.city}}에 살고 계시네요. " +
                 "5년 후의 나이는 {{age + 5}}세입니다. " +
                 "나이의 제곱근은 {{round(abs(age) ^ 0.5)}}입니다. " +
                 "첫 번째 친구의 이름은 {{friends[0].name}}이고, " +
                 "가장 나이 많은 친구는 {{max(friends[0].age, friends[1].age)}}세입니다.";
```

### 3. 데이터 객체 준비

템플릿에서 사용할 변수들을 포함하는 데이터 객체를 준비합니다.

```javascript
const data = {
  name: "홍길동",
  age: 30,
  address: {
    city: "서울"
  },
  friends: [
    { name: "김철수", age: 28 },
    { name: "이영희", age: 32 }
  ]
};
```

### 4. 템플릿 파싱 및 결과 출력

`parseTemplateString` 함수를 사용하여 템플릿을 파싱하고 결과를 출력합니다.

```javascript
const result = parseTemplateString(template, data);
console.log(result);
```

## 지원되는 연산자 및 함수

### 연산자
- 덧셈: `+`
- 뺄셈: `-`
- 곱셈: `*`
- 나눗셈: `/`
- 모듈로(나머지): `%`
- 거듭제곱: `^`

### 함수
- `min(a, b, ...)`: 최솟값 반환
- `max(a, b, ...)`: 최댓값 반환
- `abs(x)`: 절댓값 반환
- `round(x)`: 반올림
- `floor(x)`: 내림
- `ceil(x)`: 올림

### 배열 및 객체 접근
- 배열 인덱싱: `array[index]`
- 객체 속성 접근: `object.property`
- 배열 요소의 속성 접근: `array[index].property`

## 주의사항

- 템플릿 내의 표현식은 `{{ }}` 안에 작성해야 합니다.
- 존재하지 않는 변수나 함수를 참조하면 오류가 발생합니다.
- 보안상의 이유로 사용자 정의 함수는 지원하지 않습니다.
- 배열 인덱스가 유효한 범위를 벗어나면 오류가 발생합니다.

## 에러 처리

파싱 또는 평가 중 오류가 발생하면, 콘솔에 오류 메시지가 출력되고 원래의 표현식이 그대로 반환됩니다.

```javascript
const template = "잘못된 표현식: {{ nonexistent_function() }}";
const result = parseTemplateString(template, {});
// 결과: "잘못된 표현식: {{ nonexistent_function() }}"
// 콘솔에 오류 메시지 출력
```