'use strict';
module.exports = (sequelize, DataTypes) => {
  var vote = sequelize.define(
    'vote',
    {
      voter: DataTypes.STRING,
      subjectId: DataTypes.INTEGER,
    },
    {},
  );
  vote.associate = function(models) {
    // associations can be defined here
    vote.belongsTo(models.subject, { foreignKey: 'subjectId' });
  };
  return vote;
};
