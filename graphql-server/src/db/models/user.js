'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define(
    'user',
    {
      name: DataTypes.STRING,
      banned: DataTypes.BOOLEAN,
      admin: DataTypes.BOOLEAN,
    },
    {},
  );
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
