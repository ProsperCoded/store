"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PageTransition } from "@/app/components/PageTransition";
import { Product, Tags } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProduct({
  params,
}: {
  params: { productId: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | Blob | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tags>(Tags.OTHER);
  const [product, setProduct] = useState<Product | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.productId}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
        setImagePreview(data.image);
        setSelectedTag(data.tags[0] || Tags.OTHER);
      } catch (error) {
        toast.error("Failed to fetch product");
        router.push("/dashboard");
      }
    };

    fetchProduct();
  }, [params.productId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("tag", selectedTag);

      // Only append image if it was changed
      formData.append("image", imagePreview as Blob);

      const response = await fetch(`/api/products/${params.productId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update product");

      toast.success("Product updated successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!product) return null;

  return (
    <PageTransition>
      <div className="m-4 mx-auto py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-2xl">Edit Product</h1>
        </div>

        <div className="gap-8 grid md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-sm">
                      Product Name
                    </label>
                    <Input name="name" required defaultValue={product.name} />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-sm">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      required
                      defaultValue={product.description || ""}
                      rows={4}
                    />
                  </div>

                  <div className="gap-4 grid grid-cols-2">
                    <div>
                      <label className="block mb-1 font-medium text-sm">
                        Category
                      </label>
                      <Select
                        value={selectedTag}
                        onValueChange={(value) => setSelectedTag(value as Tags)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Tags).map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag.charAt(0) + tag.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Image Upload Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-medium text-lg">Product Image</h2>
              <div className="relative">
                <div className="flex justify-center items-center border-2 hover:border-primary/50 bg-muted/50 p-4 border-dashed rounded-lg transition cursor-pointer aspect-square">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {imagePreview ? (
                    <img
                      src={
                        typeof imagePreview === "string"
                          ? imagePreview
                          : URL.createObjectURL(imagePreview as Blob)
                      }
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto w-12 h-12 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground text-sm">
                        Click or drag to upload product image
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground text-sm">
                  {imageChanged
                    ? "New image selected. Save to update."
                    : "Upload a new image to replace the current one."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
