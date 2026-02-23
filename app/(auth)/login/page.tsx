import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return <Card className="mx-auto max-w-md"><h1 className="mb-4 text-2xl font-bold">Login</h1><LoginForm /><p className="mt-4 text-sm">No account? <Link href="/signup">Sign up</Link></p></Card>;
}
