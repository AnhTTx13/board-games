import { Controller, Get, Render, UseGuards } from "@nestjs/common";
import { User } from "src/shared/decorators/user.decorator";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { ViewService } from "./view.service";

@Controller()
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get()
  @Render("index")
  async root(@User("email") email: string) {
    if (email) {
      const user = await this.viewService.getUserByEmail(email);
      return { user };
    }
    return {};
  }

  @Get("/auth/login")
  @Render("login")
  async loginPage() {
    return {};
  }

  @Get("/auth/signup")
  @Render("signup")
  async signupPage() {
    return {};
  }

  @Get("/game/caro")
  @Render("caro-game")
  async caroGame(@User("email") email: string) {
    if (email) {
      const user = await this.viewService.getUserByEmail(email);
      return { user };
    }
    return {};
  }

  @Get("/game/line98")
  @Render("line98-game")
  async line98Game(@User("email") email: string) {
    if (email) {
      const user = await this.viewService.getUserByEmail(email);
      return { user };
    }
    return {};
  }

  @UseGuards(new AuthGuard())
  @Get("/profile")
  @Render("profile")
  async profilePage(@User("email") email: string) {
    const user = await this.viewService.getUserByEmail(email);
    return { user };
  }
}
