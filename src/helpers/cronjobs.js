//so basically i wanted to send send emails to the users who got an connection request during yesterday from start of day to end of the day and still those requests are not reviewd yet, means they are not marked as accepted or rejected

const cron = require("node-cron");
const ConnectReq = require("../models/connectReq");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { run } = require("./sendEmail");

cron.schedule("* 8 * * *", async () => {
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);

  try {
    const pendingRequestsUsers = await ConnectReq.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("toUserId", "firstName emailId");

    const uniqueUsers = [
      ...new Map(
        pendingRequestsUsers.map((req) => {
          const { firstName, emailId } = req.toUserId;
          return [`${firstName}|${emailId}`, req.toUserId];
        }),
      ).values(),
    ];

    for (const user of uniqueUsers) {
      try {
        await run(
          user.emailId,
          "Pending Connection Requests",
          `<p>
          Hey <strong>${user.firstName}</strong>, Please Review Your connection requests
        </p>`,
          `Hey ${user.firstName},Please Review Your Connection requests`,
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
