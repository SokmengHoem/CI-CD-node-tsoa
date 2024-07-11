// src/__tests__/repositories/user.repository.test.ts
import UserRepository from '@/src/database/repositories/user.repository';
import User from '@/src/database/models/user.model';
import mongoose from 'mongoose';
import configs from '@/src/config';

interface UserType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  age: number;
  email: string;
}

describe('UserRepository Integration Tests', () => {
  let mockUsers: UserType[] = [
    { name: 'John Doe', email: 'john@example.com', age: 30 },
    { name: 'Dara', email: 'jane@example.com', age: 25 },
  ];

  beforeAll(async () => {
    try {
      await mongoose.connect(configs.mongodbUrl);
      console.log('Connected to MongoDB successfully'); 
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;  // Re-throw to propagate the error
    }
  });

  beforeEach(async () => {
    await User.deleteMany();
    const insertedUsers = await User.insertMany(mockUsers);
    mockUsers = insertedUsers.map(user => user.toObject()); // Update mockUsers with actual inserted users
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('getAllUsers should return all users with sorting, filtering, and age range', async () => {
    const page = 1;
    const limit = 10;
    const filter = '';
    const sort = 'name';
    const minAge = 20;
    const maxAge = 40;

    const result = await UserRepository.getAllUsers(page, limit, filter, sort, minAge, maxAge);
    console.log(result);

    expect(result.length).toBe(mockUsers.length);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'John Doe' }),
        expect.objectContaining({ name: 'Dara' }),
      ])
    );
  }, 20000);

  test('getUserById should return the user with the given ID', async () => {
    const userId = mockUsers[0]._id;

    const result = await UserRepository.getUserById(userId!.toString());

    expect(result).toBeTruthy();
    expect(result).toMatchObject({ name: 'John Doe', email: 'john@example.com', age: 30 });
  }, 20000);

  test('createUser should create a new user', async () => {
    const newUser: UserType = { name: 'Sam Smith', email: 'sam@example.com', age: 20 };

    const result = await UserRepository.createUser(newUser);

    expect(result).toBeTruthy();
    expect(result).toMatchObject({ ...newUser, _id: expect.any(mongoose.Types.ObjectId) });

    const createdUser = await User.findById(result._id);
    expect(createdUser).toBeTruthy();
    expect(createdUser).toMatchObject(newUser);
  }, 20000);

  test('updateUser should update and return the user', async () => {
    const userId = mockUsers[0]._id;
    const updatedData = { name: 'John Updated' };

    const result = await UserRepository.updateUser(userId!.toString(), updatedData);

    expect(result).toBeTruthy();
    expect(result).toMatchObject({ ...mockUsers[0], ...updatedData });

    const updatedUser = await User.findById(userId);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser).toMatchObject({ ...mockUsers[0], ...updatedData });
  }, 20000);

  test('deleteUser should delete the user', async () => {
    const userId = mockUsers[0]._id;

    await UserRepository.deleteUser(userId!.toString());

    const deletedUser = await User.findById(userId);
    expect(deletedUser).toBeNull();
  }, 20000);
});
