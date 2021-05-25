/* main.js */
const fs = require('fs');

const START_TIME = new Date(),
      PROJECT_NAME = getProjectName(),
      TRACK_LOG = `${PROJECT_NAME}-track.csv`;

function error(e) {
  console.error(e.message);
  process.exit(e.errno);
}

function getProjectName() {
  try {
      let data = fs.readFileSync("./package.json"),
          json = JSON.parse(data);
      return json.name;
  } catch (e) {
      // run cleanup
      error(e);
  }
}

function createLog() {
  const header = "START_TIME,END_TIME";
  try {
      fs.writeFileSync(TRACK_LOG, header);
  } catch (e) {
      //run cleanup
      error(e);
  }
}

function trackingMessage() {
  console.log(`Tracking ${PROJECT_NAME}...`);
  console.log('Use Ctl-C to quit.');
  console.log(`Start time: ${START_TIME.toLocaleString()}`);
}

function start() {
  /* startup sequence */
  // create log file if not exists
  if (!fs.existsSync(TRACK_LOG)) createLog();
  // write start time to log file
  try {
      fs.appendFileSync(TRACK_LOG, `\n${START_TIME},`);
  } catch (e) {
    //run cleanup
      error(e);
  }
  // output message to user
  trackingMessage();
}

function stop() {
  const END_TIME = new Date();
  // write end time to log file
  try {
      fs.appendFileSync(TRACK_LOG, `${END_TIME}`);
      console.log(`End time: ${END_TIME.toLocaleString()}`);
  } catch (e) {
      error(e);
  }
}

function shutDown() {
  const exit = () => { process.exit(); }
  process.on('exit', stop);
  process.on('SIGINT', exit);
  // process.on('SIGTERM', exit);
}

start();
shutDown();
process.stdin.on("data", () => {}); // run until killed
