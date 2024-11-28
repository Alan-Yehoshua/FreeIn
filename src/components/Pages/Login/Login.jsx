import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { supabase } from "@/Supabase-BD/Client";

export function Login() {
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //REDEREGIR AL USER
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      } else if (session && userType === "Empleador") {
        navigate("/PageEmployeer");
      } else if (session && userType === "Freelancer") {
        navigate("/PageFreelancer");
      }
    });
  }, [navigate, userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación del campo de correo
    if (!email) {
      setError("Rellene todos los campos");
      setStatus("error");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Correo no válido");
      setStatus("error");
      return;
    }
    // Intento de envío del correo
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError("Hubo un error al enviar el correo");
      setStatus("error");
    } else {
      setError(""); // Limpiar cualquier error anterior
      setStatus("success");
    }

    console.log(data, error);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="email"
          placeholder="Usted@Ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {status === "idle" && null}
      {status === "error" && <p className="text-red-500 text-sm">{error}</p>}
      {status === "success" && (
        <p className="text-green-500 text-sm text-center">Correo enviado</p>
      )}
      <Button type="submit" className="w-full">
        Iniciar como {userType}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Bienvenido
          </CardTitle>
          <CardDescription className="text-center">
            Entra a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!userType ? (
            <div className="space-y-4">
              <Button
                onClick={() => setUserType("Freelancer")}
                className="w-full hover:bg-[#803796]"
              >
                Entrar como Freelancer
              </Button>
              <Button
                onClick={() => setUserType("Empleador")}
                className="w-full hover:bg-[#454ba1]"
              >
                Entrar como Empleador
              </Button>
            </div>
          ) : (
            renderForm()
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {userType && (
            <Button
              variant="link"
              onClick={() => {
                setUserType(null);
                setEmail("");
                setError("");
              }}
            >
              Regresar
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
