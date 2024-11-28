import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { supabase } from './Supabase-BD/Client.js';

const app = express();
const server = http.createServer(app);

// Configurar CORS para permitir solicitudes desde Cloudflare Pages
const corsOptions = {
  origin: "https://382593ee.freein-91p.pages.dev", // Reemplaza con tu dominio de frontend
  methods: ["GET", "POST"],
  credentials: true, // Si necesitas cookies o autenticación
};

app.use(cors(corsOptions)); // Aplica CORS globalmente al middleware

// Socket.io configuración con CORS
const io = new Server(server, {
  cors: {
    origin: "https://382593ee.freein-91p.pages.dev", // El dominio de tu frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());

// Gestión de sockets
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Escuchar mensajes
  socket.on("send_message", async (data) => {
    // Guardar en Supabase
    const { error } = await supabase.from("chats").insert(data);
    console.log(error);

    // Emitir el mensaje
    io.to(data.receiver_id).emit("receive_message", data);
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});


// Ruta para obtener mensajes previos entre dos usuarios
app.post("/get_messages", async (req, res) => { // La URL no debe incluir el dominio aquí
  const { sender_id, receiver_id } = req.body;

  try {
    // Consulta a la tabla 'chats' para obtener los mensajes entre dos usuarios
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .or(
        `and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error obteniendo mensajes:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Iniciar servidor
server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
