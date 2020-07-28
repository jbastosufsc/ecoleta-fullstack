import express from 'express';

const routes = express.Router();

routes.get('/', (request, response) => {
  return response.json({ messa: 'hellow jorge' });
});

export default routes;
