import { Lexer, Parser, Interpreter, TokenType, ASTNodeType, parseTemplateString } from './safe-template-parser.js';
import { basicTests } from './tests/test_basic.js';
import { logicalTests } from './tests/test_logical.js';
import { stringMethodTests } from './tests/test_string_methods.js';
import { arrayObjectTests } from './tests/test_array_object.js';
import { errorFunctionTests } from './tests/test_error_function.js';

function runTests() {
  const allTests = [
    ...basicTests,
    ...logicalTests,
    ...stringMethodTests,
    ...arrayObjectTests,
    ...errorFunctionTests,
  {
      name: "Full Template String Example",
      isTemplateStringTest: true,
      template: "안녕하세요, {{name}}님. 당신의 나이는 {{age}}세이고, {{address.city}}에 살고 계시네요. " +
                "5년 후의 나이는 {{age + 5}}세입니다. " +
                "나이의 제곱근은 {{round(abs(age) ^ 0.5)}}입니다. " +
                "첫 번째 친구의 이름은 {{friends[0].name}}이고, " +
                "가장 나이 많은 친구는 {{max(friends[0].age, friends[1].age)}}세입니다. " +
                "사용자 정의 함수 결과: {{customFunc(age)}}세입니다. " +
                "복잡한 계산: {{complexCalc(age, 10)}}입니다.",
      data: {
        name: "홍길동",
        age: 30,
        address: { city: "서울" },
        friends: [
          { name: "김철수", age: 28 },
          { name: "이영희", age: 32 }
        ]
      },
      allowedFunctions: {
        customFunc: (age) => age * 1.5,
        complexCalc: (a, b) => (a + b) * 2
      },
      expected: "안녕하세요, 홍길동님. 당신의 나이는 30세이고, 서울에 살고 계시네요. 5년 후의 나이는 35세입니다. 나이의 제곱근은 5입니다. 첫 번째 친구의 이름은 김철수이고, 가장 나이 많은 친구는 32세입니다. 사용자 정의 함수 결과: 45세입니다. 복잡한 계산: 80입니다.",
    },
  ];

  let allPassed = true;

  console.log("--- Running Tests ---");

  allTests.forEach((test, index) => {
    try {
      let result;
      if (test.isTemplateStringTest) {
        result = parseTemplateString(test.template, test.data, test.allowedFunctions);
      } else {
        const lexer = new Lexer(test.expression.trim());
        const parser = new Parser(lexer);
        const tree = parser.parse();
        // For existing tests, ensure 'add' is still available if needed
        const interpreter = new Interpreter(tree, test.data, { add: (a, b) => a + b });
        result = interpreter.interpret();
      }

      let passed = false;
      if ('expectedError' in test) {
        passed = false; // Should have thrown an error, but didn't
      } else if (Array.isArray(test.expected) || (typeof test.expected === 'object' && test.expected !== null && test.expected.constructor === Object)) {
        passed = JSON.stringify(result) === JSON.stringify(test.expected);
      } else {
        passed = result === test.expected;
      }

      if (!passed) {
        console.error(`❌ Test #${index + 1} (${test.name}) FAILED`);
        if (test.isTemplateStringTest) {
          console.error(`   - Template: ${test.template}`);
        } else {
          console.error(`   - Expression: ${test.expression}`);
        }
        if ('expectedError' in test) {
          console.error(`   - Expected to throw error: ${test.expectedError}`);
          console.error(`   - But got result: ${JSON.stringify(result)}`);
        } else {
          console.error(`   - Expected: ${JSON.stringify(test.expected)}`);
          console.error(`   - Got:      ${JSON.stringify(result)}`);
        }
        allPassed = false;
      } else {
        console.log(`✅ Test #${index + 1} (${test.name}) PASSED`);
      }
    } catch (error) {
      let passed = false;
      if ('expectedError' in test) {
        // Check if the error message matches the expected error
        if (error.message.includes(test.expectedError)) {
          passed = true;
        } else {
          console.error(`   - Expected error: ${test.expectedError}`);
          console.error(`   - Got error: ${error.message}`);
        }
      }

      if (!passed) {
        console.error(`💥 Test #${index + 1} (${test.name}) CRASHED`);
        if (test.isTemplateStringTest) {
          console.error(`   - Template: ${test.template}`);
        } else {
          console.error(`   - Expression: ${test.expression}`);
        }
        console.error(error);
        allPassed = false;
      } else {
        console.log(`✅ Test #${index + 1} (${test.name}) PASSED (Error as expected)`);
      }
    }
  });

  console.log("--- Tests Finished ---");
  if (allPassed) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("🔥 Some tests failed.");
  }
}

runTests();