import { LoginForm } from "@/components/forms/login-form";
import { BrandPrimaryColor } from "@/lib/banding/brand";

export default function Home() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
      style={{ backgroundColor: BrandPrimaryColor }}
    >
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
