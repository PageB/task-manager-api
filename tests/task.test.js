const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOne, userTwo, setupDB, taskOne } = require('./fixtures/db');

beforeEach(setupDB);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Hit the road, Jack',
      completed: false
    })
    .expect(201);

    const task = await Task.findById(response.body._id);

    // Exist in DB
    expect(task).not.toBeNull();
    // Has correct owner in DB
    expect(task.owner).toEqual(userOne._id);
});

test('Should request all tasks for userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    expect(response.body.length).toEqual(3);
})


test('Should fail if userTwo delete tasks of userOne', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  // Exist in DB
  expect(task).not.toBeNull();
})

// Task Test Ideas

// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks