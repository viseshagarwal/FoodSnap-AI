import { Metadata } from "next";

interface HeadProps {
  title: string;
  description?: string;
}

export function generateMetadata({ title, description }: HeadProps): Metadata {
  return {
    title: `${title} | FoodSnap`,
    description:
      description || "AI-powered food analysis and nutrition tracking",
  };
}
