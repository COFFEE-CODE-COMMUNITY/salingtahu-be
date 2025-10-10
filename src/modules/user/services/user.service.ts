import { Readable } from "stream"
import { User } from "../entities/user.entity"
import { CreateUserDto } from "../dtos/create-user.dto"

export class UserService {
  public async putUserAvatar(userId: string, avatarStream: Readable): Promise<User> {
    // 1. Store image to storage (local, S3, or CDN)
    // 2. Generate the public URL/path of the uploaded avatar
    // 3. Update user.profile_picture_path with the new URL
    // 4. Return the updated user
    console.log(userId, avatarStream)
    return new User()
  }

  public async createUser(dto: CreateUserDto): Promise<User> {
    // 1. Validate email uniqueness
    // 2. Map DTO -> entity fields (first_name, last_name, email, etc.)
    // 3. Save new user to database
    // 4. Return the created user
    console.log(dto)
    return new User()
  }
}
