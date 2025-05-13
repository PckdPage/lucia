// import boss from "./queue";
// import { transporter } from "./nodemailer";

// async function startEmailReminderJob() {
//   await boss.work("reminder-yes", async (job: any) => {
//     const { email, todoTitle, dueDate } = job.data;

//     await transporter.sendMail({
//       from: `"Todo Reminder" <${process.env.EMAIL_USERNAME}>`,
//       to: email,
//       subject: `Reminder: ${todoTitle}`,
//       text: `⏰ Hey! Your task "${todoTitle}" is due at ${new Date(
//         dueDate
//       ).toLocaleString()}.`,
//     });
//   });
// }

// startEmailReminderJob().catch((error) =>
//   console.error("Error processing job:", error)
// );
