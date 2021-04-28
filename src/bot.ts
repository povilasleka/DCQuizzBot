import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {Question, Answer} from "./quiztypes";
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
                let question: string = this.message.content.substr(6, this.message.content.length);
                console.log("Quiz command initiated!");
                this.startQuiz(question, this.message.author.username);
            }
            else if (command === "!answ")
            {
                let answer: string = this.message.content.substr(6, this.message.content.length);
                console.log("Quiz answer initiated!");
                this.quiz.addAnswer({
                    username: this.message.author.username,
                    text: answer
                });
            }
        });

        return this.client.login(this.token);
    }

    private startQuiz(question: string, author: string): void 
    {
        if (this.quiz != null)
        {
            this.sendMessage("[!] Wait until current quiz ends!");
            return;
        }

        this.quiz = new Quiz({ description: question, author });

        this.sendMessage(
            "[+] Quiz by " + this.message.author.username + "\n" +
            question + "\n" +
            "Answer with command !answer [your text]"
        );
    }

    private sendMessage(message: string)
    {
        this.message.channel.send(message);
    }
}