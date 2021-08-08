import { Request, Response } from 'express';

import { UserService } from '../services/UserService';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const usersService = new UserService();

    try {
      const user = await usersService.create({ email });
  
      return response.json(user);    
    } catch(err) {
      return response.status(400).json({
        message: err.message
      })
    }
  }
}

export { UsersController }