const DataLoader = require('dataloader');
const db = require('../db');

const subjectById = () => {
  return new DataLoader((keys) => {
    return db.subject
      .findAll({
        where: {
          id: { [db.Op.in]: keys },
        },
      })
      .then((subjects) => keys.map((k) => subjects.find((s) => s.id == k) || null));
  });
};

module.exports = () => {
  return {
    subjectById: subjectById(),
  };
};
