import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateTokenCommand } from "../create-token.command"
import Midtrans from "midtrans-client"
import { ConfigService } from "@nestjs/config"
import { TransactionRepository } from "../../repositories/transaction.repository"
import { Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import { Transaction } from "../../entities/transaction.entity"
import { CreateTransactionDto } from "../../dtos/create-transaction.dto"
import { UserRepository } from "../../../user/repositories/user.repository"
import { CourseRepository } from "../../../course/repositories/course.repository"
import { PaymentStatus } from "../../enums/payment-status.enum"
import { CreateTransactionResponseDto } from "../../dtos/create-transaction-response.dto"
import { NotFoundException } from "@nestjs/common"
import { Language } from "../../../../enums/language"
import { CourseStatus } from "../../../course/enums/course-status.enum"
import { Course } from "../../../course/entities/course.entity"
import { CourseCategory } from "../../../course/entities/course-category.entity"
import { User } from "../../../user/entities/user.entity"
import { UserStatus } from "../../../user/enums/user-status.enum"
import { UserRole } from "../../../user/enums/user-role.enum"

@CommandHandler(CreateTokenCommand)
export class CreateTokenHandler implements ICommandHandler<CreateTokenCommand> {
  private readonly snap: Midtrans.Snap
  public constructor(
    private readonly config: ConfigService,
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
    @InjectMapper() private readonly mapper: Mapper
  ) {
    this.snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: this.config.getOrThrow("MIDTRANS_SERVER"),
      clientKey: this.config.getOrThrow("MIDTRANS_CLIENT")
    })
  }

  public async execute(command: CreateTokenCommand): Promise<CreateTransactionResponseDto | undefined> {
    // Mock Category (like SQL entity with BaseEntity fields)
    const mockCategory = Object.assign(new CourseCategory(), {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Web Development",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
      courses: []
    })

    // Mock Instructor (like SQL entity with BaseEntity fields)
    const mockInstructor = Object.assign(new User(), {
      id: "550e8400-e29b-41d4-a716-446655440001",
      firstName: "John",
      lastName: "Doe",
      email: "john.instructor@example.com",
      password: "$2b$10$abcdefghijklmnopqrstuvwxyz",
      headline: "Senior Software Developer",
      biography: "Experienced instructor with 10+ years in web development",
      language: Language.ENGLISH_US,
      profilePictures: null,
      websiteUrl: null,
      facebookUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
      tiktokUrl: null,
      xUrl: null,
      youtubeUrl: null,
      status: UserStatus.ACTIVE,
      lastLoggedInAt: null,
      roles: [UserRole.STUDENT, UserRole.INSTRUCTOR],
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
      refreshTokens: [],
      oauth2Users: [],
      passwordResetSessions: [],
      instructorVerifications: [],
      courses: []
    })

    // Mock Course (like SQL entity with BaseEntity fields)
    const courseFallback = Object.assign(new Course(), {
      id: "550e8400-e29b-41d4-a716-446655440003",
      title: "Complete Web Development Bootcamp 2024",
      slug: "complete-web-development-bootcamp-2024",
      description:
        "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.",
      language: Language.ENGLISH_US,
      price: 750000,
      status: CourseStatus.PUBLISHED,
      thumbnail: {
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        key: "course-thumbnails/web-dev.jpg",
        size: 102400,
        mimetype: "image/jpeg"
      },
      averageRating: 4.8,
      totalReviews: 120,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
      sections: [],
      category: mockCategory,
      reviews: [],
      instructor: mockInstructor
    })
    try {
      const transaction = this.mapper.map(command.dto, CreateTransactionDto, Transaction)
      transaction.status = PaymentStatus.PENDING
      transaction.paymentGateway = "midtrans"

      const user = await this.userRepository.findById(command.dto.userId)
      const course = await this.courseRepository.findById(command.dto.courseId)

      if (!user) {
        throw new NotFoundException({ message: "User not found" })
      }

      if (!course) {
        // throw new NotFoundException({ meesage: "Course not found" })
      }

      transaction.user = user
      transaction.course = course ?? courseFallback

      // const savedTransaction = await this.transactionRepository.save(transaction)

      const parameter = {
        item_details: {
          name: transaction.course.title,
          price: transaction.course.price,
          quantity: 1
        },
        transaction_details: {
          order_id: transaction.id ? transaction.id : "ORDER-" + new Date().getTime(),
          gross_amount: transaction.course.price
        }
      }

      const result = await this.snap.createTransaction(parameter)
      return {
        transactionId: transaction.id,
        snapToken: result.token,
        redirectUrl: result.redirect_url
      }
    } catch (error) {
      console.error(error)
    }
  }
}
