import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

import { useEffect } from "react";
import { usePosts } from "@/Context/PostContext";
import { UpdatePost } from "../updatePost";

export function CarruselE() {

  const { posts, getPostsE, deletePost } = usePosts();

  useEffect(() => {
    getPostsE();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id_post, e) => {
    e.preventDefault();
    deletePost(id_post);
  };

  return (
  <>
    {posts.length > 0 ?
    <Carousel className="w-full max-w-7xl mx-auto select-none">
      <CarouselContent>
        {posts.map((posts) => (
          <CarouselItem key={posts.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-auto">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <section className="flex items-center space-x-2 mb-2 ">
                    <Avatar>
                      <AvatarImage alt="User" />
                      <AvatarFallback>{posts.Titulo[0]}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">
                      {posts.Titulo} - ${posts.Monto}
                    </div>
                  </section>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">5</span>
                  </div>
                </div>
                <p className="text-sm mb-2">{posts.Descripcion}</p>
                <div className="mb-2">
                  <span className="flex text-sm font-semibold">
                    Categoria:
                    <p className="font-normal mx-1">{posts.Categoria}</p>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {posts.Tecnologias.split(/,\s*|\s*y\s*/).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  <UpdatePost post={posts}/>
                  <Button
                    className="h-6 w-12 "
                    variant="destructive"
                    onClick={(e) => handleDelete(posts.id, e)}
                  >
                    Del
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    : (<div className="flex justify-center text-2xl">No hay post creados</div> 
    )}
  </>
  );
}