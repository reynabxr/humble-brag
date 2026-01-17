"use client"

import type React from "react"

import { X, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useCallback } from "react"

interface PostInputProps {
  postText: string
  onPostTextChange: (text: string) => void
  imagePreview: string | null
  onImageUpload: (file: File) => void
  onRemoveImage: () => void
}

export function PostInput({ postText, onPostTextChange, imagePreview, onImageUpload, onRemoveImage }: PostInputProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        onImageUpload(file)
      }
    },
    [onImageUpload],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <Card className="bg-white border-linkedin-border shadow-sm">
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Paste your boring LinkedIn update</label>
          <Textarea
            value={postText}
            onChange={(e) => onPostTextChange(e.target.value)}
            placeholder="Thrilled to announce I'm joining Generic Corp as Senior Synergy Coordinator..."
            className="min-h-32 resize-none border-linkedin-border focus:border-linkedin-blue focus:ring-linkedin-blue/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Upload your professional photo</label>

          {imagePreview ? (
            <div className="relative rounded-lg overflow-hidden border border-linkedin-border">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Uploaded preview"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={onRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-linkedin-border rounded-lg p-8 text-center hover:border-linkedin-blue hover:bg-linkedin-blue/5 transition-colors cursor-pointer"
            >
              <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-linkedin-blue/10">
                    <ImageIcon className="h-6 w-6 text-linkedin-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Drop your photo here or <span className="text-linkedin-blue">browse</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
