import {NextFunction, Request, Response} from 'express'
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config'

import Users from '../models/Users';

export default{
    async authentication(req: Request, res: Response, next: NextFunction){
        const email = req.body.email;
        const senha = req.body.password;

        const user = getRepository(Users);

        user.findOne({where: {email: email}})
            .then(data => {
                if(!data){
                    next({messageError: 'Usuário ou senha não encontrados!'});
                }else{
                    const senhaCrypto = bcrypt.compareSync(senha, data.password);
                    if(senhaCrypto){
                        let token = jwt.sign({id: data.id}, config.secret , {
                            expiresIn: 360
                        });
                        res.status(200).json({accesstoken: token});
                    }else{
                        next({messageError: 'Usuário ou senha não encontrados!'});
                    }
                }
            }).catch(err => {
                console.log("error: ", err)
            });
    },

    async logout(req: Request, res: Response){
        res.send({accesstoken: ''});
        res.status(200).send({auth: false, acesstoken: null})
    }

}