const DataLoader = require('dataloader');
const db = require('../db');

const voteCountBySubjectId = () => {
  return new DataLoader((keys) => {
    return db.subject.findAll({
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
    });
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
      .then((subjects) => subjects.map((s) => s.votes));
  });
};

module.exports = () => {
  return {
    voteCountBySubjectId: voteCountBySubjectId(),
    voteBySubjectId: voteBySubjectId(),
  };
};
