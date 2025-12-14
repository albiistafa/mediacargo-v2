import ForgotPasswordForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Cargo Admin",
  description: "Change your password for Media Cargo account.",
  // other metadata
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
