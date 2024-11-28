import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/Supabase-BD/Client";
import { usePosts } from "@/Context/PostContext";

import { AddPost } from "./AddPost";
import { CarruselE } from "./Carrusel/CarruselE";
import { CarruselA } from "./Carrusel/CarruselA";

export function HomePageEmployeer() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [dataUser, setDataUser] = useState("");
  const { updateProfile } = usePosts();

  //Para evitar entrar a una pagina sin auth
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
      } else {
        const { data, error } = await supabase
          .from("perfil_empleador")
          .select()
          .eq("id_empleador", user.id);
        if (error) {
          console.error("Error al obtener el perfil: ", error);
        } else if (!data || data.length === 0) {
          navigate("/CreateProfileE", { state: { userId: user.id } });
        } else {
          setId(data[0].id);
          setDataUser(data[0]);
        }
      }
    };
    getUser();
  }, [navigate]);

  //FUNCION PARA CERRAR SESION
  const handleSignOut = () => {
    supabase.auth.signOut();
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new window.FormData(event.target));
    console.log("JSON ES:", fields);
    // Filtrar solo los campos que tengan contenido (es decir, los que no estén vacíos)
    const filteredFields = Object.keys(fields)
      .filter((key) => fields[key].trim() !== "") // Solo campos con contenido
      .reduce((obj, key) => {
        obj[key] = fields[key]; // Añadir solo los campos modificados
        return obj;
      }, {});

    // Combinar los valores de post original con los campos actualizados
    const updatedProfile = {
      ...dataUser,
      ...filteredFields, // Solo actualiza los campos que no están vacíos
    };

    const { error } = updateProfile(dataUser.id, updatedProfile);
    if (error) throw error;
  }

  return (
    <div className="relative  flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback className="text-cyan-950 font-bold">{dataUser ? dataUser.Usuario[0]: "X"}</AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">
            Hola, Bienvenido
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="link"
                  className="text-stone-100 m-0 p-1 text-xl"
                >
                  {dataUser.Usuario}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Perfil De {dataUser.Usuario}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta es tu informacion empresarial
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleUpdate} className="grid-cols-1 gap-1">

                  <Label>Nombre de usuario</Label>
                  <Input 
                  name="Usuario"
                  placeholder={dataUser.Usuario}   />
                  <Label>Descripcion</Label>
                  <Textarea 
                  name="Descripcion"
                  placeholder={dataUser.Descripcion}/>
                  <Label>Empresa</Label>
                  <Input 
                  name = "Empresa"
                  placeholder={dataUser.Empresa}/>

                <AlertDialogFooter className="p-3 ">
                  <AlertDialogCancel>Cerrar</AlertDialogCancel>
                  <AlertDialogAction type="submit" className="hover:bg-[#bba737]">Actualizar</AlertDialogAction>
                </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </span>
        </div>
        <div className="text-3xl font-bold text-center">
          FreeIn <p className="text-sm">(Empleador)</p>
        </div>
      </header>
      <main className="flex-grow p-6 bg-background">
        <section className="flex gap-1 place-content-between">
          <h2 className="text-2xl font-bold mb-4">Tus Publicaciones</h2>
          <AddPost userID={id} />
        </section>
        <CarruselE />
        <section className="p-3">
          <h2 className="text-2xl font-bold my-3">Post Aceptados</h2>
        </section>
        <CarruselA />
      </main>
      <footer className="p-4 bg-primary text-primary-foreground text-center select-none">
        <p>© 2024 FreeIn. All rights reserved.</p>
        <Button
          variant="link"
          className="text-yellow-50"
          onClick={handleSignOut}
        >
          Cerrar sesion
        </Button>
      </footer>
    </div>
  );
}