import { Controller, Get, Post, Body, HttpStatus, Res, Patch, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger'; 
import { Response } from 'express';
import { AppService } from './app.service';
import { CreateusersDTO } from './dto/app.dto';
import { Sequelize } from 'sequelize';
import { User } from './app.entity';

@Controller("/user")
export class AppController {
  private sequelize: Sequelize;

  constructor(private readonly appService: AppService) {
    this.sequelize = appService.getSequelizeInstance();
  }

  @Get()
  @ApiOkResponse({ description: 'Respuesta exitosa', type: "EjemploDto" })
  @ApiResponse({ status: 404, description: 'Error al obtener todos los usuarios' })
  @ApiCreatedResponse({ description: 'Creado exitosamente', type: "EjemploDto" })
  async getAllUsers(@Res() res: Response): Promise<void> {
    try {
      const users = await this.appService.getAllUsers();
      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error al obtener todos los usuarios' });
    }
  }
  
  @Post()
  @ApiCreatedResponse({description:"Usuario logeado/Usuario registado Correctamentedevolverá en ambas un objeto.",
                        content: {
                          'application/json': {
                            schema: {
                              type: 'object',
                              properties: {
                                message: {
                                  type: 'string',
                                  example: 'Respuesta exitosa.',
                                },
                              },
                            },
                          },
                        },})
  @ApiBadRequestResponse({ description: 'Error ejecutar el post' })
  @ApiInternalServerErrorResponse({ description: 'Error ejecutar el post' })
  async postUsers(@Body() body: CreateusersDTO, @Res() res: Response): Promise<void> {
    try {
      const response = await this.appService.postUser(body);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error('Error al hacer un post:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error ejecutar el post' });
    }
  }

  @Patch()
  @ApiOkResponse({ description: 'Recurso actualizado exitosamente' })
  @ApiBadRequestResponse({ description: 'Error en la solicitud' })
  @ApiNotFoundResponse({ description: 'Recurso no encontrado' })
  async PutUser(@Body() body: User, @Res() res: Response): Promise<void> {
    try {
      const response = await this.appService.putUser(body);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error('Error al hacer un put:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error ejecutar el put' });
    }
  }
}
