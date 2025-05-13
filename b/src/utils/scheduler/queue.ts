import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export function scheduleReminder(
  email: string,
  todoTitle: string,
  dueDate: Date
) {
  const remindAt = new Date(dueDate.getTime() - 30 * 60 * 1000);

  const minutes = remindAt.getMinutes();
  const hours = remindAt.getHours();
  const dayOfMonth = remindAt.getDate();
  const month = remindAt.getMonth() + 1;

  const cronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} *`;

  const job = cron.schedule(
    cronExpression,
    async () => {
      try {
        await transporter.sendMail({
          from: `"Todo Reminder" <${process.env.EMAIL_USERNAME}>`,
          to: email,
          subject: `Reminder: ${todoTitle}`,
          text: `⏰ Hey! Your task "${todoTitle}" is due at ${dueDate.toLocaleString()}.`,
        });

        console.log(`✅ Email sent to ${email} for "${todoTitle}"`);
        job.stop();
      } catch (error) {
        console.log("failed to send email", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kathmandu",
    }
  );
}
