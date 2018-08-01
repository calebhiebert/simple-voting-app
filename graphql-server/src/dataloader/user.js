const DataLoader = require('dataloader');
const db = require('../db');

const userById = () => {
  return new DataLoader((keys) => {
    return db.user
      .findAll({
        where: {
          id: { [db.Op.in]: keys },
        },
      })
      .then((users) => {
        return keys.map((key) => users.find((u) => u.id == key) || null);
      });
  });
};

module.exports = () => {
  return {
    userById: userById(),
  };
};
