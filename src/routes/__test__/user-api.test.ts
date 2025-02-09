import request from 'supertest';
import mongoose from 'mongoose';
import app from '@/src/app';  // Ensure this is the express app instance
import User from '@/src/database/models/user.model';
import configs from '@/src/config';

interface UserType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  age: number;
  email: string;
}

const mockUsers: UserType[] = [
  { name: 'John Doe', email: 'john@example.com', age: 30 },
  { name: 'Jane Doe', email: 'jane@example.com', age: 25 },
];

describe('UsersController API Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(configs.mongodbUrl);
  });

  beforeEach(async () => {
    await User.deleteMany();
    await User.insertMany(mockUsers);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('GET /v1/users should return paginated users', async () => {
    try {
      const response = await request(app).get('/v1/users').query({ page: 1, limit: 2, sort: 'name' });

      console.log(response.body); // Log the response body for debugging

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Jane Doe');
      expect(response.body[1].name).toBe('John Doe');
    } catch (error) {
      console.error('Error during GET /v1/users test:', error);
      throw error;
    }
  }, 20000);

  test('POST /v1/users should create a new user', async () => {
    const newUser = { name: 'Sam Smith', email: 'sam@example.com', age: 20 };

    try {
      const response = await request(app).post('/v1/users').send(newUser);

      console.log(response.body); // Log the response body for debugging

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.age).toBe(newUser.age);

      // Verify the user is in the database
      const userInDb = await User.findOne({ email: newUser.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.name).toBe(newUser.name);
      expect(userInDb?.email).toBe(newUser.email);
      expect(userInDb?.age).toBe(newUser.age);
    } catch (error) {
      console.error('Error during POST /v1/users test:', error);
      throw error;
    }
  }, 20000);

  test('GET /v1/users/:userId should return a user by id', async () => {
    try {
      const user = await User.findOne({ name: 'John Doe' });
      const userId = user?._id.toString();

      const response = await request(app).get(`/v1/users/${userId}`);

      console.log(response.body); // Log the response body for debugging

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
      expect(response.body.age).toBe(30);
    } catch (error) {
      console.error('Error during GET /v1/users/:userId test:', error);
      throw error;
    }
  }, 20000);

  test('PUT /v1/users/:userId should update a user by id', async () => {
    try {
      const user = await User.findOne({ name: 'John Doe' });
      const userId = user?._id.toString();
      const updatedData = { name: 'John Updated', age: 31 };

      const response = await request(app).put(`/v1/users/${userId}`).send(updatedData);

      console.log(response.body); // Log the response body for debugging

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('John Updated');
      expect(response.body.age).toBe(31);

      // Verify the user is updated in the database
      const userInDb = await User.findById(userId);
      expect(userInDb).not.toBeNull();
      expect(userInDb?.name).toBe(updatedData.name);
      expect(userInDb?.age).toBe(updatedData.age);
    } catch (error) {
      console.error('Error during PUT /v1/users/:userId test:', error);
      throw error;
    }
  }, 20000);

  test('DELETE /v1/users/:userId should delete a user by id', async () => {
    try {
      const user = await User.findOne({ name: 'John Doe' });
      const userId = user?._id.toString();

      const response = await request(app).delete(`/v1/users/${userId}`);

      console.log(response.body); // Log the response body for debugging

      expect(response.status).toBe(204);

      // Verify the user is deleted from the database
      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();
    } catch (error) {
      console.error('Error during DELETE /v1/users/:userId test:', error);
      throw error;
    }
  }, 20000);
});
