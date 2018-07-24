import axios from 'axios';
import router from './router';

const userCache = {};

const http = axios.create({
  baseURL: `http://${location.hostname}:3000`,
  timeout: 2500,
});

const handleAxiosResponse = (response) => {
  return response.data;
};

const handleAxiosError = (err) => {
  console.log(err, err.response);

  if (err.response && err.response && err.response.status === 401) {
    router.push({ name: 'login' });
  }
};

const getSubjects = () => {
  return http
    .get('/subjects')
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const getUser = (id) => {
  if (userCache[id]) {
    return Promise.resolve(userCache[id]);
  } else {
    return http
      .get(`/user/${id}`)
      .then(handleAxiosResponse)
      .then((user) => {
        userCache[user.userId] = user;
        return user;
      })
      .catch(handleAxiosError);
  }
};

const getSubject = (id) => {
  return http
    .get(`/subjects/${id}`)
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const createSubject = (personName, costumeDescription) => {
  return http
    .post('/subjects', {
      personName,
      costumeDescription,
    })
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const updateSubject = (id, personName, costumeDescription) => {
  return http
    .patch(`/subjects/${id}`, {
      personName,
      costumeDescription,
    })
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const getMe = () => {
  return http
    .get('/me')
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const vote = (subjectId) => {
  return http
    .post(`/vote/${subjectId}`)
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const avatarURL = (name) => {
  return `https://api.adorable.io/avatars/285/${name}.png`;
};

export default {
  getSubjects,
  getSubject,
  updateSubject,
  createSubject,
  getUser,
  getMe,
  vote,
  avatarURL,
};
