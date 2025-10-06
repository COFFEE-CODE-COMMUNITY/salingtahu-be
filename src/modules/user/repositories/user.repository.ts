import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../common/base/base.repository"
import { User } from "../entities/user.entity"
import { DataSource } from "typeorm"

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource, User)
  }
}