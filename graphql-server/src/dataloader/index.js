const user = require('./user');
const subject = require('./subject');
const vote = require('./vote');

const loaders = {
  ...user(),
  ...subject(),
  ...vote(),
};

// Each of the above imports returns a function that creates a fresh batch of dataloaders
module.exports = () => {
  return loaders;
};
