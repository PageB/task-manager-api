const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDB } = require('./fixtures/db')

beforeEach(setupDB);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Martin',
      email: 'martin@example.com',
      password: 'MyPass777!'
    })
    .expect(201);

    // Exist in DB
    const user = await User.findById(response.body.user._id);

    expect(user).not.toBeNull();

    // Exist in DB with correct data
    expect(response.body.user.name).toBe('Martin');
    expect(response.body).toMatchObject({
      user: {
        name: 'Martin',
        email: 'martin@example.com'
      },
      token: user.tokens[0].token
    });
    expect(user.password).not.toBe('MyPass777!');
});

test('Should signin a user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send(userOne)
    .expect(200);

    // Exist in DB
    const user = await User.findById(userOneId);

    expect(user).not.toBeNull();
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not signin nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: "ivan@example.com",
      password: "MyPass777!"
    })
    .expect(400);
});

test('Should not signin user with wrong password', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: "MyPass777!"
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete profile for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    // Exist in DB
    const user = await User.findById(userOneId);
    
    expect(user).toBeNull();
});

test('Should not delete profile for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Shoul upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update profile name for user', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Mike'
    })
    .expect(200);

    // Exist in DB
    const user = await User.findById(userOneId);
    
    expect(user.name).toEqual('Mike');
});

test('Should not update invalid prolife property for user', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Sofia'
    })
    .expect(400);
});

// User Test Ideas

// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated