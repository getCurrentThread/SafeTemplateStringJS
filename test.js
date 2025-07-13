// Test script for safe-template-parser
import { parseTemplateString } from './safe-template-parser.js';

// Test template
const template = "안녕하세요, {{name}}님. 당신의 나이는 {{age}}세이고, {{address.city}}에 살고 계시네요. " +
                 "5년 후의 나이는 {{age + 5}}세입니다. " +
                 "나이의 제곱근은 {{round(abs(age) ^ 0.5)}}입니다. " +
                 "첫 번째 친구의 이름은 {{friends[0].name}}이고, " +
                 "가장 나이 많은 친구는 {{max(friends[0].age, friends[1].age)}}세입니다. " +
                 "사용자 정의 함수 결과: {{customFunc(age)}}세입니다. " +
                 "복잡한 계산: {{complexCalc(age, 10)}}입니다.";

// Test data with custom functions
const data = {
  name: "홍길동",
  age: 30,
  address: {
    city: "서울"
  },
  friends: [
    { name: "김철수", age: 28 },
    { name: "이영희", age: 32 }
  ],
  customFunc: (age) => age * 1.5,
  complexCalc: (a, b) => (a + b) * 2
};

// Parse template and output the result
console.log("--- Test Result ---");
const result = parseTemplateString(template, data);
console.log(result);
console.log("\nTest completed successfully!");
