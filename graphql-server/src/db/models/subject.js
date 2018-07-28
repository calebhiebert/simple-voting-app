'use strict';
module.exports = (sequelize, DataTypes) => {
  var subject = sequelize.define(
    'subject',
    {
      personName: DataTypes.STRING,
      costumeDescription: DataTypes.STRING,
    },
    {},
  );
  subject.associate = function(models) {
    // associations can be defined here
    subject.hasMany(models.subject_history, {
      as: 'history',
      foreignKey: 'subjectId',
    });
    subject.hasMany(models.vote, { as: 'votes', foreignKey: 'subjectId' });
  };
  return subject;
};
