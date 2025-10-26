import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meida Cargo - Signup Page",
  description: "Create an account to get started with Media Cargo.",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
