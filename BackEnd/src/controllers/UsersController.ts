import {Request, Response} from 'express'
import { getRepository } from 'typeorm';
import * as Yup from 'yup'
import Users from '../models/Users';
import user_view from '../views/user_view';
import bcrypt from 'bcrypt'

export default{
    async show(request: Request, response: Response){
        const { id } = request.params;

        const usersRepository = getRepository(Users);

        const user = await usersRepository.findOneOrFail(id);

        return response.json(user_view.render(user));
    },

    async create(request: Request, response: Response){
        const {
            name,
            email,
        } = request.body;
    
        const usersRepository = getRepository(Users);

        console.log("cheguei aqui");

        //gerando hash com a senha
        const password = bcrypt.hashSync(request.body.password, 8);
    
        const data = {
            name,
            email,
            password
        };

        const schema = Yup.object().shape({
            name:  Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required()
        });

        await schema.validate(data, {
            abortEarly: false,
        });      

        console.log(data);

        const user = usersRepository.create(data);
    
        await usersRepository.save(user).then(() => {
            return response.status(201).json(user);
        }).catch((err => {
            console.log("Error: ", err);
            return response.status(500).send("Internal Server Error");
        }));
    
        
    }
}