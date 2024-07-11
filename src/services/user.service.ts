import { IUser, UserCreationParams } from "@/src/database/models/user.model";
import  UserRepository  from "@/src/database/repositories/user.repository";


export class UserService {
  public async getAllUsers(page:number, limit:number, filter?:string, sort?:string, minAge?:number, maxAge?:number): Promise<IUser[]> {
     try{
       const usersAll:IUser[] = await UserRepository.getAllUsers(page, limit, filter, sort, minAge, maxAge);
       return usersAll;
     }catch(err){
       throw err;
     }
    
  }

  public async getUserById(id: string): Promise<IUser | null> {
    try{
      const userFound: IUser | null = await UserRepository.getUserById(id);
      return userFound;
    }catch(err){
      throw err;
    }
  }

  public async createUser(params: UserCreationParams): Promise<IUser> {
    try{
      const newUser: IUser = await UserRepository.createUser(params);
      return newUser;
    }catch(err){
      throw err;
    }
  }

  public async updateUser(id: string, params: Partial<IUser>): Promise<IUser | null> {
    try{
      const updatedUser: IUser | null = await UserRepository.updateUser(id, params);
      return updatedUser;
    }catch(err){
      throw err;
    }
  }

  public async deleteUser(id: string): Promise<void> {
    try{
       await UserRepository.deleteUser(id);
    }catch(err){
      throw err;
    }
  }
}

export default new UserService();