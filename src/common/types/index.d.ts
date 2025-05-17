import { userPayload } from '../interfaces/request.user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: userPayload;
    }
  }
}
