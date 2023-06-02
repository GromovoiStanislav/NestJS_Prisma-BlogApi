import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";


@Injectable()
export class ArticlesService {

  constructor(
    private prisma: PrismaService
  ) {
  }


  async create(createArticleDto: CreateArticleDto, authorId: number) {
    return this.prisma.article.create({ data: { ...createArticleDto, authorId } });
  }


  async findDrafts() {
    return this.prisma.article.findMany({ where: { published: false } });
  }


  async findAll() {
    return this.prisma.article.findMany({ where: { published: true } });
  }


  async findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true
      }
    });
  }


  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
    const article = await this.findOneOrFail(id);
    if (article.authorId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto
    });
  }


  async remove(id: number, userId: number) {
    const article = await this.findOneOrFail(id);
    if (article.authorId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.article.delete({ where: { id } });
  }

  private async findOneOrFail(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException("Article Not Found");
    }
    return article;
  }

}
