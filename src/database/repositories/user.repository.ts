import User, { IUser } from "@/src/database/models/user.model";

export class UserRepository {
  public async getAllUsers(
    page: number,
    limit: number,
    filter?: string,
    sort?: string,
    minAge?: number,
    maxAge?: number
  ): Promise<IUser[]> {
    try {
      const query: any = {};

      if (filter) {
        query.name = { $regex: filter, $options: "i" };
      }

      if (minAge !== undefined && maxAge !== undefined) {
        query.age = { $gte: minAge, $lte: maxAge };
      } else if (minAge !== undefined) {
        query.age = { $gte: minAge };
      } else if (maxAge !== undefined) {
        query.age = { $lte: maxAge };
      }

      const users: IUser[] = await User.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
      return users;
    } catch (err) {
      throw err;
    }
  }

  public async getUserById(id: string): Promise<IUser | null> {
    try {
      const user: IUser | null = await User.findById(id);
      if (!user) {
        throw new Error(`User ${id} not found`);
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  public async createUser(data: Partial<IUser>): Promise<IUser> {
    try {
      const newUser = new User(data);
      const createdUser: IUser = await newUser.save();
      return createdUser;
    } catch (err) {
      throw err;
    }
  }

  public async updateUser(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      const user: IUser | null = await User.findByIdAndUpdate(id, data, {
        new: true,
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  public async deleteUser(id: string): Promise<void> {
    try {
      await User.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }
}

export default new UserRepository();
