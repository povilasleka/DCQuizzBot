import {Question, Answer} from "./quiztypes";

export class Quiz {
    private question: Question;
    private answers: Answer[];

    constructor(question: Question)
    {
        this.question = question;
        this.answers = [];
    }

    public addAnswer(answer: Answer)
    {
        this.answers.push(answer);
    }
}