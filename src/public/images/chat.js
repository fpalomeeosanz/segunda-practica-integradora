const socket = io(server);

socket.on("connection", (clientSocket) => {

    console.log("Nuevo cliente conectado");

    socket.broadcast.emit("mensaje-bienvenida", "¡Bienvenido al chat!");

    clientSocket.emit("mensaje-personalizado", "¡Hola! ¿Cómo estás?");
});
