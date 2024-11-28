/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import io from "socket.io-client"
import { Send } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const socket = io("https://backendchat-hi9n.onrender.com"); // URL del backend en Render

export function Chat({ userId, receiverId, name }) {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])

  // Cargar mensajes previos al cargar el componente
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://backendchat-hi9n.onrender.com/get_messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: userId,
            receiver_id: receiverId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setChat(data);
        } else {
          console.error("Error al cargar mensajes previos:", response.statusText);
        }
      } catch (error) {
        console.error("Error al cargar mensajes previo:", error);
      }
    };

    fetchMessages();

    // Escuchar mensajes en tiempo real
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      sender_id: userId,
      receiver_id: receiverId,
      message
    };

    // Enviar mensaje al servidor
    socket.emit("send_message", data);
    setChat((prev) => [...prev, data]);
    setMessage(""); // Limpia el input
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chat con {name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="flex flex-col gap-2">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  msg.sender_id === userId
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.message}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
