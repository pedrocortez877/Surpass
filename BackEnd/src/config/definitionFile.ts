import { Request } from 'express';

export default interface IGetUserAuthInfoRequest extends Request {
    userId: string // or any other type
}