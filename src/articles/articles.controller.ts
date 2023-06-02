import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, UseGuards
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ArticleEntity } from "./entities/article.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../auth/user.decorator";


@Controller("articles")
@ApiTags("articles")
export class ArticlesController {

  constructor(
    private readonly articlesService: ArticlesService
  ) {
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @User() user
  ) {
    return new ArticleEntity(
      await this.articlesService.create(createArticleDto, user.id)
    );
  }


  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll() {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => new ArticleEntity(article));
  }


  @Get("drafts")
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.articlesService.findDrafts();
    return drafts.map((draft) => new ArticleEntity(draft));
  }


  @Get(":id")
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return new ArticleEntity(
      await this.articlesService.findOne(id)
    );
  }


  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ArticleEntity })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @User() user
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto, user.id)
    );
  }


  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @User() user
  ) {
    return new ArticleEntity(
      await this.articlesService.remove(id, user.id)
    );
  }

}
