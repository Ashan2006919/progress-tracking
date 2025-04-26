"use client";

import Image from "next/image";
import { MagicCard } from "@/components/magicui/magic-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";

export default function About() {
  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between gap-4"
    >
      {/* About Section */}
      <div className="flex-1 pr-72 flex items-center justify-center">
        <Card className="p-0 max-w-full">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
              <CardTitle>About</CardTitle>
              <CardDescription>
                Learn more about this app and its features.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg">
                This is a simple morning routine app that helps you plan your
                day. You can create a to-do list, save templates, and track your
                completed routines. The app is built with Next.js and uses the
                latest features of React and TypeScript. Feel free to explore
                the code and contribute to the project! This app is a work in
                progress, and I plan to add more features in the future.
              </p>
            </CardContent>
          </MagicCard>
        </Card>
      </div>

      {/* Image Section */}
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/images/animeGirl.png"
          alt="Anime Girl"
          width={500}
          height={500}
          className=""
        />
      </div>
    </div>
  );
}
