import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useNavigate } from "react-router-dom";
import { supabase } from "@/Supabase-BD/Client";
import { useEffect, useState } from "react";
import { usePosts } from "@/Context/PostContext";

export function CarruselAF() {
  const { acceptedPostsF, getAcceptedPostsF, delAcceptedPost } = usePosts();
  const [senderID, setSenderID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAcceptedPostsF();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("perfil_freelancer")
          .select()
          .eq("id_freelancer", user.id);
        if (error) {
          console.error("Error al obtener el perfil: ", error);
        }else {
          setSenderID(data[0].id);
        }
      }
      getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id_p, e) => {
    e.preventDefault();
    console.log(id_p);
    delAcceptedPost(id_p);
  };

  const handleChat = async (e, name) => {
    e.preventDefault();
    const { data } = await supabase
      .from('perfil_empleador')
      .select()
      .eq('Usuario', name);
    
    console.log(data);
    
    // Pasar el valor directamente en el navigate
    const reciverID = data[0]?.id;
    console.log(`ID del sender ${senderID}\nID del reciver ${reciverID}`);
    
    navigate("/Chat", { state: { SID: senderID, RID: reciverID, name: name } });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {acceptedPostsF.length > 0 ? (
        <Carousel className="select-none">
          <CarouselContent className="flex">
            {acceptedPostsF.map((posts) => (
              <CarouselItem
                key={posts.post_id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card className="w-full max-w-md">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {posts.employeer_usuario
                          ? posts.employeer_usuario[0].toUpperCase()
                          : "X"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold">
                        {posts.employeer_usuario}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {posts.fecha_publicacion}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h4 className="text-xl font-bold">{posts.titulo}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">
                        ${posts.monto.toFixed(2)}
                      </span>
                      <Badge variant="secondary">{posts.categoria}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <p className="text-sm text-muted-foreground w-full">
                      Aceptado el {posts.fecha_aceptado}
                    </p>
                    <div className="flex justify-between w-full gap-4">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={(e) => handleDelete(posts.post_id, e)}
                      >
                        Cancelar
                      </Button>
                      <Button className="flex-1" onClick={(e) =>handleChat(e,posts.employeer_usuario)}>Contactar</Button>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="flex justify-center text-2xl">No hay post aceptados :/</div>
      )}
    </div>
  );
}