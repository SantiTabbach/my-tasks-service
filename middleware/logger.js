const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  const logsPath = path.join(__dirname, "..", "logs");
  try {
    if (!fs.existsSync(logsPath)) {
      await fsPromises.mkdir(logsPath);
    }
    await fsPromises.appendFile(path.join(logsPath, logFileName), logItem);
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, _res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");

  console.log(`${req.method} ${req.path}`);

  next();
};

module.exports = { logEvents, logger };
