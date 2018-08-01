const user = require('./user');
const subject = require('./subject');

// Each of the above imports returns a function that creates a fresh batch of dataloaders
module.exports = () => {
  return {
    ...user(),
    ...subject(),
  };
};
