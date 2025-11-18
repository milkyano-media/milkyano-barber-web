import { useCallback, useEffect, useState } from "react";
import { GalleryItem, CreateGalleryItemDto, UpdateGalleryItemDto } from "@/interfaces/GalleryInterface";
import {
    getGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    convertImageToBase64,
    validateImageFile,
} from "@/utils/galleryApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Image as ImageIcon, Plus, RefreshCw, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function GalleryManagement() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isActive: true,
        imageFile: null as File | null,
        imageBase64: "",
    });

    const fetchGalleryItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getGalleryItems();
            setGalleryItems(data);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch gallery items",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchGalleryItems();
    }, [fetchGalleryItems]);

    const handleAddClick = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            description: "",
            isActive: true,
            imageFile: null,
            imageBase64: "",
        });
        setIsDialogOpen(true);
    };

    const handleEditClick = (item: GalleryItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description || "",
            isActive: item.isActive,
            imageFile: null,
            imageBase64: item.imageBase64,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (item: GalleryItem) => {
        setDeletingItem(item);
        setIsDeleteDialogOpen(true);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast({
                title: "Invalid Image",
                description: validation.error,
                variant: "destructive",
            });
            e.target.value = "";
            return;
        }

        try {
            const base64 = await convertImageToBase64(file);
            setFormData((prev) => ({
                ...prev,
                imageFile: file,
                imageBase64: base64,
            }));
            toast({
                title: "Success",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process image",
                variant: "destructive",
            });
            e.target.value = "";
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validate required fields
            if (!formData.title.trim()) {
                toast({
                    title: "Validation Error",
                    description: "Title is required",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            if (editingItem) {
                // Update existing item
                const updateData: UpdateGalleryItemDto = {
                    title: formData.title,
                    description: formData.description || undefined,
                    isActive: formData.isActive,
                };

                // Only include image if changed
                if (formData.imageFile) {
                    // Validate image size before sending
                    if (formData.imageBase64.length > 3 * 1024 * 1024) {
                        toast({
                            title: "Image Too Large",
                            description: "The image exceeds the maximum size limit. Please upload a smaller image.",
                            variant: "destructive",
                        });
                        setIsLoading(false);
                        return;
                    }
                    updateData.imageBase64 = formData.imageBase64;
                }

                await updateGalleryItem(editingItem.id, updateData);
                toast({
                    title: "Success",
                    description: "Gallery item updated successfully",
                });
            } else {
                // Create new item
                if (!formData.imageBase64) {
                    toast({
                        title: "Validation Error",
                        description: "Please upload an image",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }

                // Validate image size before sending
                if (formData.imageBase64.length > 3 * 1024 * 1024) {
                    toast({
                        title: "Image Too Large",
                        description: "The image exceeds the maximum size limit. Please upload a smaller image.",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }

                const createData: CreateGalleryItemDto = {
                    title: formData.title,
                    description: formData.description || undefined,
                    imageBase64: formData.imageBase64,
                    isActive: formData.isActive,
                };

                await createGalleryItem(createData);
                toast({
                    title: "Success",
                    description: "Gallery item created successfully",
                });
            }

            setIsDialogOpen(false);
            fetchGalleryItems();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save gallery item";

            // Check for payload too large error
            if (errorMessage.includes("413") || errorMessage.includes("Payload Too Large")) {
                toast({
                    title: "Image Too Large",
                    description:
                        "The image file is too large for the server to process. Please upload a smaller image (max 2MB).",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingItem) return;

        try {
            setIsLoading(true);
            await deleteGalleryItem(deletingItem.id);
            toast({
                title: "Success",
                description: "Gallery item deleted successfully",
            });
            setIsDeleteDialogOpen(false);
            fetchGalleryItems();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete gallery item",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <ImageIcon className="w-8 h-8" />
                            Gallery Management
                        </h1>
                        <p className="text-gray-400 mt-2">Manage gallery images for the website</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={fetchGalleryItems}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            className="border-theme-border hover:bg-theme-card"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button onClick={handleAddClick} size="sm" className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Gallery Item
                        </Button>
                    </div>
                </div>

                {/* Gallery Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-theme-card border border-theme-border rounded-lg overflow-hidden hover:border-theme-primary transition-colors"
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gray-800 overflow-hidden">
                                <img src={item.imageBase64} alt={item.title} className="w-full h-full object-cover" />
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <span
                                        className={`ml-2 px-2 py-1 text-xs font-medium rounded flex-shrink-0 ${
                                            item.isActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-gray-500/20 text-gray-400"
                                        }`}
                                    >
                                        {item.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="text-xs text-gray-500 mb-3">Sort Order: {item.sortOrder}</div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditClick(item)}
                                        className="flex-1 border-theme-border hover:bg-theme-card"
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteClick(item)}
                                        className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {galleryItems.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No gallery items found</p>
                        <p className="text-gray-500 text-sm mt-2">Click "Add Gallery Item" to create your first item</p>
                    </div>
                )}

                {/* Add/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-theme-card border-theme-border text-white max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., High Skin Fade by Josh"
                                    className="bg-black border-theme-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description"
                                    className="bg-black border-theme-border"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Gallery Image</Label>
                                <p className="text-xs text-gray-400">
                                    Max size: 2MB. Supported formats: PNG, JPG, JPEG, WebP
                                </p>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                    className="bg-black border-theme-border"
                                />
                                {formData.imageBase64 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-400 mb-2">Preview:</p>
                                        <img
                                            src={formData.imageBase64}
                                            alt="Preview"
                                            className="w-full max-w-xs rounded border border-theme-border"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is-active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="is-active">Active</Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="border-theme-border"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isLoading ? "Saving..." : editingItem ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="bg-theme-card border-theme-border text-white">
                        <DialogHeader>
                            <DialogTitle>Delete Gallery Item</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-300">
                            Are you sure you want to delete "{deletingItem?.title}"? This action cannot be undone.
                        </p>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="border-theme-border"
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                                {isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
