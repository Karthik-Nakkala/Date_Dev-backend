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
      ToAddresses: [toAddress],
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
    Source: fromAddress,
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
  } catch (caught) {
    console.error("AWS SES Email sending failed:", caught.message || caught);
    if (caught instanceof Error && caught.name === "MessageRejected") {
      return caught;
    }
    throw caught;
  }
};

module.exports = { run };