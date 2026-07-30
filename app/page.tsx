import Link from "next/link";
import HomePage from "@/components/pages/HomePage";

export const metadata = {
  title: "Home",
  description:
    "Bisoyin Confectionery offers delicious cakes, pastries and professional catering services for every celebration.",
};

export default function Page() {
  return <HomePage />;
}