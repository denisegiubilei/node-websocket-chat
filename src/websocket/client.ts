import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";
import { UserService } from "../services/UserService";

interface IClientFirstAccessParams {
  text: string;
  email: string;
}

interface IClientSendToAdmin {
  text: string;
  socket_admin_id: string;
}

io.on("connect", (socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UserService();
  const messagesService = new  MessagesService();

  socket.on("client_first_access", async ({ text, email }: IClientFirstAccessParams) => {
    const socketId = socket?.id;

    const user = await usersService.create({ email });

    const connection = await connectionsService.findByUserId(user.id);

    if (!connection) { 
      await connectionsService.create({
        socket_id: socket?.id,
        user_id: user?.id
      });
    } else {
      connection.socket_id = socketId;
      await connectionsService.create(connection);
    }

    await messagesService.create({
      text,
      user_id: user.id
    });

    const allMessages = await messagesService.listByUser(user.id);

    socket.emit("client_list_all_messages", allMessages)
    
    const allUsers = await connectionsService.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allUsers);

  });

  socket.on("client_send_to_admin", async ({ text, socket_admin_id }: IClientSendToAdmin) => {
    const userSocketId = socket.id;

    const { user_id } = await connectionsService.findBySocketId(userSocketId);

    const message = await messagesService.create({ text, user_id });

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id: userSocketId
    });

  })
});
