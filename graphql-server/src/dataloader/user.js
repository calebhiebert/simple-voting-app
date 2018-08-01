const DataLoader = require('dataloader');
const db = require('../db');

const userById = () => {
  return new DataLoader((keys) => {
    return db.user.findAll({
      where: {
        id: { [db.Op.in]: keys },
      },
    });
  });
};

module.exports = () => {
  return {
    userById: userById(),
  };
};
