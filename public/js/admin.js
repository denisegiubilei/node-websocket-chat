const socket = io();
let connectionsUsers = [];

socket.on("admin_list_all_users", (connections) => {
  connectionsUsers = connections;
  document.getElementById("list_users").innerHTML = "";

  let template = document.getElementById("template").innerHTML;

  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    document.getElementById("list_users").innerHTML += rendered;
  });
})

socket.on("admin_receive_message", ({ message, socket_id }) => {
  const connection = connectionsUsers.find(connection => connection.socket_id === socket_id);

  const divMessages = document.getElementById(
    `allMessages${connection.user.id}`
  );
console.log(message)
  const createDiv = document.createElement("div");

  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<span>${connection.user.email} </span>`;
  createDiv.innerHTML += `<span>${message.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${dayjs(
    message.created_at
  ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(createDiv);

});

function call(id) {
  const connection = connectionsUsers.find(connection => connection.socket_id === id);

  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id
  });

  document.getElementById("supports").innerHTML += rendered;

  socket.emit("admin_list_messages_by_user", { user_id: connection.user.id }, messages => {
    const divMessages = document.getElementById(
      `allMessages${connection.user.id}`
    );

    messages.forEach((message) => {
      const createDiv = document.createElement("div");

      if (message.admin_id === null) {
        createDiv.className = "admin_message_client";

        createDiv.innerHTML = `<span>${connection.user.email} </span>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        createDiv.className = "admin_message_admin";

        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date>${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}`;
      }

      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(userId) {
  const text = document.getElementById(`send_message_${userId}`);

  const params = {
    text: text.value,
    user_id: userId
  }

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${userId}`);
  const createDiv = document.createElement("div");
  
  createDiv.className = "admin_message_admin";

  createDiv.innerHTML = `Atendente: <span>${text.value}</span>`;
  createDiv.innerHTML += `<span class="admin_date>${dayjs().format("DD/MM/YYYY HH:mm:ss")}`;

  divMessages.appendChild(createDiv);

  text.value = "";
}