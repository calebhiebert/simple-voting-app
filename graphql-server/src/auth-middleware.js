const AuthenticationClient = require('auth0').AuthenticationClient;
const pino = require('pino');
const db = require('./db');

const logger = pino({ name: 'auth-mw' });

const cache = {};

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

    if (cache[bearerToken]) {
      const dbUser = await db.user.findOne({
        where: {
          id: { [db.Op.eq]: cache[bearerToken].id },
        },
      });

      if (dbUser === null) {
        res.status(500).json({
          name: 'ServerException',
          message: 'Something has gone terribly wrong',
        });
        return;
      }

      req.user = dbUser;

      next();
    } else {
      try {
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
        cache[bearerToken] = req.user;
        next();
      } catch (err) {
        logger.warn('Auth', { name: err.name, message: err.message });

        switch (err.name) {
          case 'SequelizeConnectionError':
          case 'SequelizeDatabaseError':
            res.status(500).json({
              name: 'ServerException',
              message: 'Something has gone terribly wrong',
            });
            break;
          default:
            res.status(403).json({
              name: 'AuthenticationError',
              message: 'Failed to authenticate',
            });
            break;
        }
      }
    }
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
