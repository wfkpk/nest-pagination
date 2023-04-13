import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/article')
  async getAllArticle() {
    return this.appService.getAllArticle();
  }
  @Get('/pagination')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 4 })
  @ApiResponse({ status: 200, description: 'Paginated Articles' })
  async paginate(@Query('page') page = 1, @Query('pageSize') pageSize = 4) {
    return this.appService.paginate(+page, +pageSize);
  }

  @Post()
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The article has been successfully created.',
  })
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.appService.createArticle(createArticleDto);
  }

  @Get('/cursor')
  @ApiQuery({ name: 'cursor', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 4 })
  @ApiResponse({ status: 200, description: 'Cursor-based Paginated Articles' })
  async cursorPaginate(
    @Query('cursor') cursor: number | null = null,
    @Query('pageSize') pageSize = 4,
  ) {
    return this.appService.cursorPaginate(cursor ? +cursor : null, +pageSize);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The article has been successfully found.',
  })
  async getArticle(@Param('id') id: number) {
    return this.appService.getArticleById(+id); // Convert the id to an integer
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The article has been successfully deleted.',
  })
  async deleteArticle(@Param('id') id: string) {
    return this.appService.deleteArticle(+id); // Convert the id to an integer
  }

  @Put(':id')
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The article has been successfully updated.',
  })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.appService.updateArticle(+id, updateArticleDto);
  }

  //using patch
  @Patch('patch/:id')
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The article has been successfully updated.',
  })
  async patchArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.appService.updateArticle(+id, updateArticleDto);
  }
}
