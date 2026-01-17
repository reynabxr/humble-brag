"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { PostInput } from "@/components/post-input";
import { StyleSelector } from "@/components/style-selector";
import { LoadingScreen } from "@/components/loading-screen";
import { ResultView } from "@/components/result-view";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export type StyleMode = "movie" | "sports" | null;

export default function Home() {
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleHypePost = async () => {
    if (!selectedStyle) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("postText", postText);
      formData.append("style", selectedStyle);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/hype", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      // Success!
      setShowResult(true);
    } catch (error) {
      console.error("Error hyping post:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setPostText("");
    setImageFile(null);
    setImagePreview(null);
    setSelectedStyle(null);
    setShowResult(false);
  };

  const isButtonDisabled = !postText.trim() || !selectedStyle;

  if (isLoading) {
    return <LoadingScreen mode={selectedStyle} />;
  }

  if (showResult) {
    return <ResultView mode={selectedStyle} onStartOver={handleStartOver} />;
  }

  return (
    <div className="min-h-screen bg-linkedin-gray">
      <Header />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-6">
          <PostInput
            postText={postText}
            onPostTextChange={setPostText}
            imagePreview={imagePreview}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
          />

          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
          />

          <Button
            onClick={handleHypePost}
            disabled={isButtonDisabled}
            className="w-full h-14 text-lg font-semibold bg-linkedin-blue hover:bg-linkedin-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Hype My Post
          </Button>
        </div>
      </main>
    </div>
  );
}
