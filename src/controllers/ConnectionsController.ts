import { Request, Response } from 'express';

import { ConnectionsService } from '../services/ConnectionsService';

class ConnectionsController {
  async showAllWithoutAdmin(request: Request, response: Response): Promise<Response> {
    const connectionsService = new ConnectionsService();

    const list = await connectionsService.findAllWithoutAdmin();

    return response.json(list);
  }
}

export { ConnectionsController }