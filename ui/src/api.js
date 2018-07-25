import axios from 'axios';
import axiosRetry from 'axios-retry';
import router from './router';

const userCache = {};

const http = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? `${location.protocol}//${location.host}/api`
      : `http://${location.hostname}:3000/api`,
  timeout: 5000,
});

axiosRetry(http, { retries: 4, retryDelay: axiosRetry.exponentialDelay });

if (localStorage.getItem('access-token') !== null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access-token')}`;
}

const handleAxiosResponse = (response) => {
  return response.data;
};

const handleAxiosError = (err) => {
  console.log(err, err.response);

  if (err.response && err.response.status === 401) {
    router.push({ name: 'login' });
  } else if (err.response && err.response.status === 403) {
    location.reload();
  } else {
    return Promise.reject(err);
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

const deleteSubject = (id) => {
  return http
    .delete(`/subjects/${id}`)
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const getMe = () => {
  return http
    .get('/me')
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const getUsers = () => {
  return http
    .get('/users')
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const banUser = (id) => {
  return http
    .post(`/users/${id}/ban`)
    .then(handleAxiosResponse)
    .catch(handleAxiosError);
};

const unBanUser = (id) => {
  return http
    .post(`/users/${id}/unban`)
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
  deleteSubject,
  getUser,
  getUsers,
  banUser,
  unBanUser,
  getMe,
  vote,
  avatarURL,
};
