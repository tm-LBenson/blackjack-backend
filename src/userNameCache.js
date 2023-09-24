const currentNames = {};

function deleteName(name) {
  for (const key in currentNames) {
    if (currentNames[key] === name) {
      delete currentNames[key];
      break;
    }
  }
}

module.exports = { currentNames, deleteName };
