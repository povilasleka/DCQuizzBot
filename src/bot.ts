import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {Answer} from "./quiztypes";
import { Quiz } from "./quiz";

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;
    private quiz: Quiz;
    private message: Message;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string
    ) {
        this.client = client;
        this.token = token;
    }

    public listen(): Promise<string> 
    {
        this.client.on('message', (message: Message) => {
            this.message = message;
            
            let command: string = this.message.content.split(" ")[0];
            
            if (command === "!quiz")
            {
                let questionEndIndex = this.message.content.search("-a");
                let question: string = this.message.content.substr(6, questionEndIndex-6);

                let answersString = this.message.content.substr(questionEndIndex+3, this.message.content.length);
                let answers = answersString.split(",");

                this.startQuiz(question, answers, this.message.author.username);
            }
            else if (command === "!answ")
            {
                let answer: string = this.message.content.substr(6, this.message.content.length);
                let answerId = parseInt(answer, 10);
                console.log("Quiz answer initiated!");
                this.quiz.addAnswer(answerId, this.message.author.username);
            }
            else if (command === "!stop")
            {
                if (this.message.author.username != this.quiz.getAuthor())
                    return;

                this.endQuiz();
            }
        });

        return this.client.login(this.token);
    }

    private startQuiz(question: string, answers: string[], author: string): void 
    {
        if (this.quiz != null)
        {
            this.sendMessage("[!] Wait until current quiz ends!");
            return;
        }

        let answerObject: Answer[] = [];
        let id = 0;
        for(let answer of answers)
        {
            answerObject.push({ 
                text: answer, 
                usernames: [], 
                id: id++ 
            });
        }

        this.quiz = new Quiz(question, answerObject, author);

        this.sendMessage(
            "[+] Quiz by " + this.quiz.getAuthor() + "\n" +
            this.quiz.getQuestion() + "\n" +
            this.quiz.getAnswerChoices() +
            "Answer with command !answ [number]"
        );
    }

    private endQuiz(): void 
    {
        if (this.quiz == null)
        {
            this.sendMessage("[!] Quiz is not created!");
            return;
        }

        this.sendMessage(this.quiz.getResults());
        this.quiz = null;
    }

    private sendMessage(message: string)
    {
        this.message.channel.send(message);
    }
}