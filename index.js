const express = require('express');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
  console.log('Request had been Called');
  console.log(`Method: ${req.method}; URL: ${req.url}`);

  return next();
})

function chackUserexists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' })
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const { index } = req.params;
  const user = users[index];
  if (!user) {
    return res.status(400).json({ error: 'User does not exists' })
  }
  req.user = user;
  return next();
}

const users = ['Diego', 'Cláudio', 'Victor'];

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/user/:index', checkUserInArray, (req, res) => {
  return res.json({ message: req.user });
});

server.post('/user', chackUserexists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json({ message: `User ${name} created successfully` })
})

server.put('/user/:index', chackUserexists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json({ message: `User ${name} updated successfully` })
})

server.delete('/user/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  const name = users.splice(index, 1);
  return res.json({ message: `User ${name} deleted successfully` })
})

server.listen(3333);