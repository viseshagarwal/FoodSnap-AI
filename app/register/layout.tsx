import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | FoodSnap",
  description: "Create your FoodSnap account",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
