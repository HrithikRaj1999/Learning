import { NotificationService } from "./NotificationService";
import { MySqlUserRepo } from "./repos/MySqlUserRepo";
import { PgUserRepo } from "./repos/PgUserRepo";
import { EmailSender } from "./senders/EmailSender";
import { SMSSender } from "./senders/SMSSender";

// Config A: MySQL + Email
const emailSvc = new NotificationService(new MySqlUserRepo(), new EmailSender());
emailSvc.notify("hrithik_42", "Server is down");

// Config B: Postgres + SMS — same policy, different details injected.
const smsSvc = new NotificationService(new PgUserRepo(), new SMSSender());
smsSvc.notify("Rajesh_7", "Deploy finished");