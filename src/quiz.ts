import {Answer} from "./quiztypes";

export class Quiz {
    private question: string;
    private answers: Answer[];
    private author: string;

    constructor(question: string, answers: Answer[], author: string)
    {
        this.question = question;
        this.answers = answers;
        this.author = author;
    }

    public addAnswer(answerId: number, username: string)
    {
        let answer: Answer = this.answers.find(a => a.id == answerId);
        answer.usernames.push(username);
    }

    public getQuestion(): string
    {
        return this.question;
    }

    public getAuthor(): string
    {
        return this.author;
    }

    public getAnswerChoices(): string
    {
        let choiceString: string = "";
        
        for(let answer of this.answers)
        {
            choiceString = choiceString.concat(answer.id + " - " + answer.text + "\n");
        }

        return choiceString;
    }

    public getResults(): string
    {
        let results: string = "";
        for(let answer of this.answers)
        {
            results = results.concat(`[${answer.id}] ${answer.text}: ${answer.usernames.length}\n`);
        }

        return results;
    }
}