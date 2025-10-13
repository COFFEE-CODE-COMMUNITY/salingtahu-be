import { Controller, Patch } from "@nestjs/common"

@Controller("instructors")
export class InstructorController {
  @Post("me/apply")
  public async applyAsInstructor(): Promise<void> {}

  @Post("me/verification")
  public async verifyInstructor(): Promise<void> {}

  @Get("me")
  public async getCurrentInstructor(): Promise<void> {}

  @Patch("me")
  public async updateCurrentInstructor(): Promise<void> {}
}
