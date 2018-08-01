'use strict';
module.exports = (sequelize, DataTypes) => {
  var subject_history = sequelize.define(
    'subject_history',
    {
      editor: DataTypes.STRING,
      personName: DataTypes.STRING,
      costumeDescription: DataTypes.STRING,
      subjectId: DataTypes.INTEGER,
    },
    {},
  );
  subject_history.associate = function(models) {
    // associations can be defined here
    subject_history.belongsTo(models.subject, { foreignKey: 'subjectId' });
    subject_history.belongsTo(models.user, { foreignKey: 'editor' });
  };
  return subject_history;
};
