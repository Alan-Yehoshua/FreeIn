/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { useState } from "react";
import { usePosts } from "@/Context/PostContext";

export function UpdatePost({ post }) {
  const { updatePost } = usePosts();

  const [activeAlert, setActiveAlert] = useState(null);
  const showAlert = (type) => {
    setActiveAlert(type);
    setTimeout(() => setActiveAlert(null), 5000);
  };

  const alertContent = {
    destructive: {
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Oh oh... ¡ERROR!",
      description: "Ocurrio un problema, intentalo más tarde :(",
    },
    success: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      title: "Muy bien!",
      description: "Publicacion actualizado correctamente :D",
    },
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
    const updatedPost = {
      ...post,
      ...filteredFields, // Solo actualiza los campos que no están vacíos
    };
    const { error } = updatePost(post.id, updatedPost);
    if (error) {
      console.error("Error al actualizar la publicacion:", error);
      showAlert("destructive");
    } else {
      console.log("Publicacion actualizada con éxito");
      showAlert("success");
    }
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-3/4 z-50 w-full max-w-md">
        {activeAlert && (
          <Alert>
            {alertContent[activeAlert].icon}
            <AlertTitle>{alertContent[activeAlert].title}</AlertTitle>
            <AlertDescription>
              {alertContent[activeAlert].description}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="h-6 w-12 hover:bg-[#e6c820]">Upd</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Actualizar publicacion</SheetTitle>
            <SheetDescription>
              !Verifica que la informacion que vas a actualiar sea correcta¡
            </SheetDescription>
          </SheetHeader>
          <form className="grid gap-4 py-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Titile" className="text-right">
                Titulo
              </Label>
              <Input
                name="Titulo"
                placeholder={post.Titulo}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Description" className="text-right">
                Descripcion
              </Label>
              <Textarea
                name="Descripcion"
                placeholder={post.Descripcion}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Select name="Categoria">
                <SelectTrigger className="col-span-4 font-semibold">
                  <SelectValue placeholder={post.Categoria} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="Edicion">Edicion</SelectItem>
                    <SelectItem value="Diseño">Diseño</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Tecnologies" className="text-right">
                Tecnologias
              </Label>
              <Textarea
                name="Tecnologias"
                placeholder={post.Tecnologias}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Mont" className="text-right">
                Monto
              </Label>
              <Input
                name="Monto"
                placeholder={post.Monto}
                className="col-span-3"
                type="number"
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Actualizar</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
