const DataLoader = require('dataloader');
const db = require('../db');

const subjectById = () => {
  return new DataLoader((keys) => {
    return db.subject.findAll({
      where: {
        id: { [db.Op.in]: keys },
      },
    });
  });
};

module.exports = () => {
  return {
    subjectById: subjectById(),
  };
};
