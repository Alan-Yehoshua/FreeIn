import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { supabase } from "@/Supabase-BD/Client";

export function ProfielFormE() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const userId = location.state?.userId;

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userId);
    const fields = Object.fromEntries(new window.FormData(event.target));
    const updatedFields = { ...fields, id_empleador: userId };
    const { error } = await supabase
      .from("perfil_empleador")
      .insert(updatedFields);
    if (error) {
      console.error("Error al insertar el perfil:", error);
      setError("ERROR - Perfil ya creado");
    } else {
      console.log("Perfil insertado con éxito");
      navigate("/PageEmployeer")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-4xl font-semibold mb-3">Crea tu perfil</h1>
      <Card className="w-full max-w-md">
        <CardHeader className="p-3">
          <CardTitle className="text-2xl text-center">
            Informacion del empleador
          </CardTitle>
          <CardDescription className="text-center text-[15px]">
            Porfavor rellena los campos con datos de tu empresa y tu usuario.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la compañia</Label>
              <Input
                name="Empresa"
                placeholder="Ingresa el nombre de la compañia"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDescription">
                Descripcion de la compañia
              </Label>
              <Textarea
                name="Descripcion"
                placeholder="Cuentanos a que se dedican"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">Nombre de usuario</Label>
              <Input name="Usuario" placeholder="Nombre - Apellido" required />
            </div>
          </CardContent>
          <CardFooter className="flex-col p-2">
            <p className="text-rose-600">{error != "" ? error : ""}</p>
            <Button type="submit" className="w-full">
              Crear
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}