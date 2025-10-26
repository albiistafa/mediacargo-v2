import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meida Cargo - Signin Page",
  description: "Sign in to your account to access the Media Cargo dashboard.",
};

export default function SignIn() {
  return <SignInForm />;
}
