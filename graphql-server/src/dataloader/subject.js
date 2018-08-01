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

const subjectHistoryBySubjectId = () => {
  return new DataLoader((keys) => {
    return db.subject
      .findAll({
        where: {
          id: { [db.Op.in]: keys },
        },
        include: [{ model: db.subject_history, as: 'history' }],
      })
      .then((subjects) =>
        keys.map((k) => {
          const subject = subjects.find((s) => s.id === k);

          if (subject) {
            return subject.history;
          } else {
            return null;
          }
        }),
      );
  });
};
module.exports = () => {
  return {
    subjectById: subjectById(),
    subjectHistoryBySubjectId: subjectHistoryBySubjectId(),
  };
};
