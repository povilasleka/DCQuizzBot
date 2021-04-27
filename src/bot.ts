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
    private incomingMessage: Message;

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
            this.incomingMessage = message;
            
            let command: string = message.content.split(" ")[0];
            
            if (command === "!quiz")
            {
                let question: string = message.content.substr(6, message.content.length);
                console.log("Quiz command initiated!");
                this.startQuiz(question, message.author.username);
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
            "[+] Quiz by " + this.incomingMessage.author.username + "\n" +
            question + "\n" +
            "Answer with command !answer [your text]"
        );
    }

    private sendMessage(message: string)
    {
        this.incomingMessage.channel.send(message);
    }
}