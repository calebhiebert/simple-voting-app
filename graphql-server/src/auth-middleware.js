const AuthenticationClient = require('auth0').AuthenticationClient;
const db = require('./db');

//Instantiate an auth0 authentication client
const auth0 = new AuthenticationClient({
  clientId: process.env.AUTH0_CLIENTID,
  domain: process.env.AUTH0_DOMAIN,
});

//Logic for authenticating users
exports.default = async function(req, res, next) {
  const authorization = req.headers.authorization;

  if (authorization) {
    const bearerToken = authorization.substring('Bearer '.length).trim();
    userData = await auth0.getProfile(bearerToken);

    const dbUser = await db.user.findOrCreate({
      where: { id: { [db.Op.eq]: userData.sub } },
      defaults: {
        id: userData.sub,
        name: userData.name,
        admin: false,
        banned: false,
      },
    });

    req.user = dbUser[0].dataValues;
    next();
  } else {
    next();
  }
};
//END AUTHENTICATION

exports.mustHaveAuth = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401);
    res.json({ error: 'not authorized' });
  }
};

exports.assignCreator = function(req, model, cb) {
  model.creator = req.user.id;
  cb();
};

//
exports.getUserData = async function(bearerToken) {
  const profile = await auth0.getProfile(bearerToken);

  return {
    id: profile.sub,
    nickname: profile.nickname,
    name: profile.name,
    picture: profile.picture,
    locale: profile.locale,
    updatedAt: new Date(profile.updated_at),
    email: profile.email,
    emailVerified: profile.emailVerified,
  };
};
