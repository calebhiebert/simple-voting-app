import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 2500,
});

const handleAxiosResponse = (response) => {
  return response.data;
};

const getSubjects = () => {
  return http.get('/subjects').then(handleAxiosResponse);
};

const getSubject = (id) => {
  return http.get(`/subjects/${id}`).then(handleAxiosResponse);
};

const createSubject = (personName, costumeDescription) => {
  return http
    .post('/subjects', {
      personName,
      costumeDescription,
    })
    .then(handleAxiosResponse);
};

const updateSubject = (id, personName, costumeDescription) => {
  return http
    .patch(`/subjects/${id}`, {
      personName,
      costumeDescription,
    })
    .then(handleAxiosResponse);
};

const vote = (subjectId) => {
  return http.post(`/vote/${subjectId}`).then(handleAxiosResponse);
};

const avatarURL = (name) => {
  return `https://api.adorable.io/avatars/285/${name}.png`;
};

export default {
  getSubjects,
  getSubject,
  updateSubject,
  createSubject,
  vote,
  avatarURL,
};
