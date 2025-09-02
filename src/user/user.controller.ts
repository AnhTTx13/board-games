import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { LoginDto, CreateUserDto, UpdateProfileDto } from "./user.dto";
import { Request, Response } from "express";
import { TokenService } from "src/shared/modules/token/token.service";
import { UserService } from "./user.service";
import { User } from "src/shared/decorators/user.decorator";
import { AuthGuard } from "src/shared/guards/auth.guard";

@Controller()
export class UserController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  @Post("signup")
  async signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.createUser(dto);

    const token = this.tokenService.createAuthToken(user.email, user.id);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    user.auth_token = token;
    const result = await this.userService.saveUser(user);
    result.password = "";

    return result;
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.loginUser(dto);

    const auth_token = this.tokenService.createAuthToken(user.email, user.id);

    res.cookie("auth_token", auth_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    user.auth_token = auth_token;
    const result = await this.userService.saveUser(user);
    result.password = "";

    return result;
  }

  @UseGuards(new AuthGuard())
  @Get("profile")
  async GetProfile(@User("email") email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    user.password = "";
    return user;
  }

  @UseGuards(new AuthGuard())
  @Patch("profile")
  async updateProfile(
    @User("email") email: string,
    @Body() body: UpdateProfileDto,
  ) {
    const result = await this.userService.updateUserProfile(email, body);
    result.password = "";
    return result;
  }

  @UseGuards(new AuthGuard())
  @Post("logout")
  @HttpCode(200)
  async logout(
    @User("email") email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    user.auth_token = null;
    this.userService.saveUser(user);
    res.cookie("auth_token", "", {
      maxAge: -1,
    });
    return { result: "Success" };
  }
}
