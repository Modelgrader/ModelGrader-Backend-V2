export type ProgrammingLanguage = "js" | "py" | "java" | "c" | "cpp";

export const ProgrammingLanguagesLabel: {
    [key in ProgrammingLanguage]: string;
} = {
    js: "JavaScript",
    py: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
}