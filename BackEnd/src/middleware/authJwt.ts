import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express'

import config from '../config/config';
import IGetUserAuthInfoRequest from '../config/definitionFile';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.accesstoken as string;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  }

  jwt.verify(token, config.secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
  
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};


export default  authJwt;