const CHECK_INTERVAL = 10000; // 10 seconds
const TIMEOUT_DURATION = 30000; // 30 seconds

const currentNames = {};

function deleteName(name) {
  delete currentNames[name];
  console.log(name, 'logged out.');
}

// Initialize check for timeout users
function initTimeoutCheck() {
  setInterval(() => {
    const currentTime = Date.now();
    for (const name in currentNames) {
      if (currentTime - currentNames[name] > TIMEOUT_DURATION) {
        deleteName(name);
      }
    }
  }, CHECK_INTERVAL);
}

// Refresh timestamp for a user
function refreshName(name) {
  currentNames[name] = Date.now();
  console.log('Refreshing', name);
}

module.exports = { currentNames, deleteName, refreshName, initTimeoutCheck };
