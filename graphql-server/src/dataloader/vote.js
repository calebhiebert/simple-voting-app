const DataLoader = require('dataloader');
const db = require('../db');

const voteCountBySubjectId = () => {
  return new DataLoader((keys) => {
    return db.subject
      .findAll({
        raw: true,
        where: {
          id: { [db.Op.in]: keys },
        },
        attributes: [
          [db.sequelize.col('subject.id'), 'subjectId'],
          [db.sequelize.fn('COUNT', db.sequelize.col('votes.id')), 'vote_count'],
        ],
        group: db.sequelize.col('subject.id'),
        include: [{ model: db.vote, as: 'votes', attributes: [] }],
      })
      .then((counts) => keys.map((k) => counts.find((c) => c.subjectId === k) || null));
  });
};

const voteBySubjectId = () => {
  return new DataLoader((keys) => {
    return db.subject
      .findAll({
        where: {
          id: { [db.Op.in]: keys },
        },
        include: [{ model: db.vote, as: 'votes' }],
      })
      .then((subjects) =>
        keys.map((k) => {
          const subject = subjects.find((s) => s.id === k);

          if (subject) {
            return subject.votes;
          } else {
            return null;
          }
        }),
      );
  });
};

module.exports = () => {
  return {
    voteCountBySubjectId: voteCountBySubjectId(),
    voteBySubjectId: voteBySubjectId(),
  };
};
