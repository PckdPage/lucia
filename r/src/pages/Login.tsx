import { LoginForm } from "@/components/login-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { isError, isLoading } = useQuery({
    queryKey: ["verify"],
    queryFn: async () => {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`, {
        withCredentials: true,
      });
      return true;
    },
    retry: false,
  });
  useEffect(() => {
    if (!isLoading && !isError) {
      navigate("/");
    }
  }, [isError, isLoading]);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <img
              src="/lucia_p.png"
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          Lucia To Do
        </a>
        <LoginForm />
      </div>
    </div>
  );
};
export default Login;
