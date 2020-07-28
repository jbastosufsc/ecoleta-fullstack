import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  console.log('Listagem de usuario');
  return response.json(['Jorge', 'Diego', 'Jorge']);
});

// app.post('/users', (request, response) => {
//   const user = {
//     name: 'Jorge',
//   };
//   return response.json(user);
// });

app.listen(3333);
