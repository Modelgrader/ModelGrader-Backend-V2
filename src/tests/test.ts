import { Grader } from "../grader";

const testcases = [
`1
`,
`1
`,
`1000
`,
]

const code = `
from time import sleep
x = int(input())

for i in range(x):
    for j in range(x):
        print(i+j, end=" ")
`;


// Grader.generateOutput(code, testcases, "py").then((res) => {
//     console.log(res)
// })
