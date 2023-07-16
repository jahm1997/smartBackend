import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { User } from './app.entity';
import { Model } from 'sequelize';
import { CreateusersDTO } from './dto/app.dto';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AppService implements OnModuleInit {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize("postgres://default:6JFwc1bnxSuD@ep-orange-water-192746-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb", {
      dialect: "postgres",
      logging: true,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  }

  async onModuleInit() {
    await this.initializeDatabase();
  }

  getSequelizeInstance(): Sequelize {
    return this.sequelize;
  }

  async initializeDatabase(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Connected to the database');
      await this.sequelize.sync();
      console.log('Database synchronized');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }

  createToken = (password:string) => {
    const token = jwt.sign({ password }, "secret");
    return token;
  };
  
  validarToken = (password:string) => {
    const decoded = jwt.verify(password, "secret");
    return decoded;
  };



  async getAllUsers(){
    const all = await User.findAll()
    const users = all.map((e) => e.dataValues);
    return users
  }

  async postUser(body:CreateusersDTO){
    const { email, password, lastName, name } = body
    console.log(body)
    if (email && password && lastName && name) {
      const newUser = await User.create({
        name,
        email,
        password:this.createToken(password),
        lastName,
      });
      return newUser
    }
    if (email && password) {
      console.log("--------------------------------------------------------");
      const user = await User.findOne({ where: { email } });
      if (user.dataValues) {
        let temp = this.validarToken(user.dataValues.password);
        console.log();
        if (temp["password"]===password) {
          console.log("Se inició sesion bien")
          return({
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
          });
        } else {
          console.log("No hay coincidencias");
         return({ error: "No hay coincidencias" });
        }
      }
    }
  }

  async putUser(body:User){
    const { id, name, email, password, lastName } = body;
    const contraseña = this.createToken(password)
      const updatedUser = await User.update(
        { name, email, lastName, contraseña },
        { where: { id } }
      );
      return("Usuario actualizado correctamente");
  }


}
