import Auth0Lock from 'auth0-lock';

let lock = null;

export const getLock = () => {
  if (lock !== null) {
    return lock;
  } else {
    lock = new Auth0Lock('l15qBjZMwq4NVeKCwFruwJJpaWI4Dphy', 'halloween-voting.auth0.com', {
      closable: false,
      auth: {
        autoParseHash: false,
      },
      languageDictionary: {
        title: '',
      },
      theme: {
        primaryColor: '#5755d9',
        logo: '',
      },
    });

    return lock;
  }
};
