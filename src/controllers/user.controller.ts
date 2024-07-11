import { Controller, Route, Post, Get, Body, Path, Put, Delete, Middlewares, SuccessResponse, Query } from 'tsoa';
import { IUser, UserCreationParams } from '@/src/database/models/user.model';
import consoleUserShowTime from '@/src/middlewares/get-request';
import UserService from '@/src/services/user.service';
import { StatusCode } from '@/src/utils/consts/status.code';

@Route("/v1/users")
export class UserController extends Controller {
  @Get("/")
  @Middlewares(consoleUserShowTime)
  public async getAllUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() filter?: string,
    @Query() sort?: string,
    @Query() minAge?: number,
    @Query() maxAge?: number
  ): Promise<IUser[]> {
    try {
      const usersAll: IUser[] = await UserService.getAllUsers(page, limit, filter, sort, minAge, maxAge);
      return usersAll;
    } catch (err) {
      throw err;
    }
  }

  @Get("{id}")
  public async getUserById(@Path() id: string): Promise<IUser | null> {
    try {
      const userFound: IUser | null = await UserService.getUserById(id);
      return userFound;
    } catch (err) {
      throw err;
    }
  }

  @Post("/")
  @SuccessResponse(StatusCode.Created, "Created") // return status code 201 when create user successfully.
  public async createNewUser(@Body() requestBody: UserCreationParams): Promise<IUser> {
    try {
      const newUser: IUser = await UserService.createUser(requestBody);
      this.setStatus(StatusCode.Created);
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  @Put("{id}")
  public async updateUser(@Path() id: string, @Body() body: Partial<IUser>): Promise<IUser | null> {
    try {
      const updatedUser: IUser | null = await UserService.updateUser(id, body);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  @Delete("{id}")
  @SuccessResponse(StatusCode.NoContent, "No Content") // return status code 204 when delete user successfully.
  public async deleteUser(@Path() id: string): Promise<void> {
    try {
      await UserService.deleteUser(id);
      this.setStatus(StatusCode.NoContent);
    } catch (err) {
      throw err;
    }
  }
}
