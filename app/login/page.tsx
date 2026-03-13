import LoginSidebar from "@/app/components/auth/LoginSidebar";
import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <LoginSidebar />
      <LoginForm />
    </div>
  );
}
