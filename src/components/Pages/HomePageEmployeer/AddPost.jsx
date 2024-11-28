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

// eslint-disable-next-line react/prop-types
export function AddPost({ userID }) {
  const { addPost } = usePosts();

  const [activeAlert, setActiveAlert] = useState(null);
  const showAlert = (type) => {
    setActiveAlert(type);
    setTimeout(() => setActiveAlert(null), 4000);
  }

  const alertContent = {
    destructive: {
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Oh oh... ¡ERROR!",
      description: "Ocurrio un problema, intentalo más tarde :(",
    },
    success: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      title: "¡Perfecto!",
      description: "Publicacion creado correctamente :D",
    },
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new window.FormData(event.target));
    const updateFields = { ...fields, id_perfil: userID };
    const { error } = addPost(updateFields);
    if (error) {
      console.error("Error al insertar la publicacion:", error);
      showAlert("destructive");
    } else {
      console.log("Publicacion insertado con éxito");
      showAlert("success");
    }
  };

  return (
    <>
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
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
          <Button
            className="hover:bg-green-700 hover:text-white"
            variant="outline"
          >
            Add
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Crear publicacion</SheetTitle>
            <SheetDescription>
              Una buena presentacion es fundamental para una propuesta de
              trabajo. ¡Recuerdalo!
            </SheetDescription>
          </SheetHeader>
          <form className="grid gap-4 py-4" onSubmit={handleAdd}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Titile" className="text-right">
                Titulo
              </Label>
              <Input
                name="Titulo"
                placeholder="EX: Proyecto React"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Description" className="text-right">
                Descripcion
              </Label>
              <Textarea
                name="Descripcion"
                placeholder="¿De que trata el trabajo?"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Select name="Categoria">
                <SelectTrigger className="col-span-4 font-semibold">
                  <SelectValue placeholder="Categoria" />
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
                placeholder="¿Que tecnologia/s usara?"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Mont" className="text-right">
                Monto
              </Label>
              <Input
                name="Monto"
                placeholder="$0"
                className="col-span-3"
                type="number"
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Crear</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
