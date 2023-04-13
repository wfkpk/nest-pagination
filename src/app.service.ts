import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getAllArticle(): Promise<Article[]> {
    return this.prisma.article.findMany();
  }

  async paginate(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const articles = await this.prisma.article.findMany({
      skip,
      take: pageSize,
    });

    const totalArticles = await this.prisma.article.count();

    return {
      data: articles,
      page,
      pageSize,
      totalPages: Math.ceil(totalArticles / pageSize),
    };
  }

  async cursorPaginate(cursor: number | null, pageSize: number) {
    const articles = await this.prisma.article.findMany({
      take: pageSize + 1, // Fetch one extra record to determine if there is a next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
      orderBy: {
        id: 'asc', // Ascending order by 'id' (adjust this to your preference)
      },
    });

    const hasNextPage = articles.length > pageSize;
    const nodes = hasNextPage ? articles.slice(0, -1) : articles;

    return {
      edges: nodes.map((node) => ({
        cursor: node.id,
        node,
      })),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage ? nodes[nodes.length - 1].id : null,
      },
    };
  }
  async createArticle(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content,
      },
    });
  }

  async deleteArticle(id: number) {
    //check if id exist or not
    const article = await this.prisma.article.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      return;
    }

    return this.prisma.article.delete({
      where: {
        id,
      },
    });
  }

  async updateArticle(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: {
        id,
      },
      data: {
        title: updateArticleDto.title,
        content: updateArticleDto.content,
      },
    });
  }

  async getArticleById(id: number): Promise<Article> {
    return this.prisma.article.findUnique({
      where: {
        id,
      },
    });
  }
}
