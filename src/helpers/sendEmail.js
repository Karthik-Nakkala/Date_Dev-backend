const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = ({
  toAddress,
  fromAddress = "datedevsupport@gmail.com",
  subject = "New Connection Request",
  bodyHtml = "<h1>New Connection Request</h1>",
  bodyText = "You have a new connection request.",
}) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: ['karthiknakkala15@gmail.com'],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: bodyHtml,
        },
        Text: {
          Charset: "UTF-8",
          Data: bodyText,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: 'datedevsupport@gmail.com',
  });
};

const run = async (toAddress, subject, bodyHtml, bodyText) => {
  if (!toAddress) {
    throw new Error("Recipient toAddress is required for sending email");
  }

  const sendEmailCommand = createSendEmailCommand({
    toAddress,
    subject,
    bodyHtml,
    bodyText,
  });

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (err) {
    console.error("AWS SES Email sending failed:", err.message || err);
    if (err instanceof Error && err.name === "MessageRejected") {
      return err;
    }
    throw err;
  }
};

module.exports = { run };