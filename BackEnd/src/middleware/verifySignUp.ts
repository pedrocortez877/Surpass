import {NextFunction, Request, Response} from 'express'
import { getRepository } from 'typeorm';
import User from '../models/Users'

const checkDuplicateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const user = await getRepository(User);
  user.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(500).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
  });
};

 const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
  };
  
export default verifySignUp;