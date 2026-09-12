import { MessageSender } from "./interfaces/MessageSender";
import { UserRespository } from "./interfaces/UserRepository";
/** 
Two rules DIP:
    High-level module no depend low-level module. Both depend abstraction.
    Abstraction no depend detail. Detail depend abstraction.
Here:

    NotificationService = high-level policy. Imports only UserRepository + MessageSender (abstractions). Never imports MySqlUserRepo/EmailSender.
    Concretes implement interfaces → detail depends abstraction. ✅
    constructor(repo, sender) = injection. Service never news. Someone else (main.ts) picks + passes.
Payoff:
    Swap MySQL→Postgres, email→SMS = change main.ts only. Service untouched. (also OCP)
    Test = pass fake repo/sender. No real DB/SMTP.
*/

export class NotificationService{
    constructor(private readonly repo:UserRespository,  private readonly sender: MessageSender){} //Dependecy Injection
    notify(userId:string, message:string):void{
        const sendingImediatorId=this.repo.findContact(userId);
        this.sender.send(sendingImediatorId,message)
    }
 }