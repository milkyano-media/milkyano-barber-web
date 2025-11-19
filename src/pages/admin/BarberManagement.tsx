import { useCallback, useEffect, useState } from "react";
import { Barber, CreateBarberDto, UpdateBarberDto } from "@/interfaces/BarberInterface";
import {
    getBarbersManagement,
    createBarberManagement,
    updateBarberManagement,
    deleteBarberManagement,
    convertImageToBase64,
    validateImageFile,
} from "@/utils/barberApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Plus, RefreshCw, Edit, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function BarberManagement() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
    const [deletingBarber, setDeletingBarber] = useState<Barber | null>(null);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        displayName: "",
        redirectUrl: "",
        hasLanding: true,
        isActive: true,
        imageFile: null as File | null,
        imageBase64: "",
    });

    const fetchBarbers = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getBarbersManagement();
            setBarbers(data);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch barbers",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchBarbers();
    }, [fetchBarbers]);

    const handleAddClick = () => {
        setEditingBarber(null);
        setFormData({
            name: "",
            displayName: "",
            redirectUrl: "",
            hasLanding: true,
            isActive: true,
            imageFile: null,
            imageBase64: "",
        });
        setIsDialogOpen(true);
    };

    const handleEditClick = (barber: Barber) => {
        setEditingBarber(barber);
        setFormData({
            name: barber.name,
            displayName: barber.displayName,
            redirectUrl: barber.redirectUrl,
            hasLanding: barber.hasLanding,
            isActive: barber.isActive,
            imageFile: null,
            imageBase64: barber.imageBase64,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (barber: Barber) => {
        setDeletingBarber(barber);
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
            // Clear the file input
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
            // Clear the file input
            e.target.value = "";
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validate required fields
            if (!formData.name.trim()) {
                toast({
                    title: "Validation Error",
                    description: "Name is required",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            if (!formData.displayName.trim()) {
                toast({
                    title: "Validation Error",
                    description: "Display name is required",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            if (!formData.redirectUrl.trim()) {
                toast({
                    title: "Validation Error",
                    description: "Redirect URL is required",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            if (editingBarber) {
                // Update existing barber
                const updateData: UpdateBarberDto = {
                    name: formData.name,
                    displayName: formData.displayName,
                    redirectUrl: formData.redirectUrl,
                    hasLanding: formData.hasLanding,
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

                await updateBarberManagement(editingBarber.id, updateData);
                toast({
                    title: "Success",
                    description: "Barber updated successfully",
                });
            } else {
                // Create new barber
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

                const createData: CreateBarberDto = {
                    name: formData.name,
                    displayName: formData.displayName,
                    imageBase64: formData.imageBase64,
                    redirectUrl: formData.redirectUrl,
                    hasLanding: formData.hasLanding,
                    isActive: formData.isActive,
                };

                await createBarberManagement(createData);
                toast({
                    title: "Success",
                    description: "Barber created successfully",
                });
            }

            setIsDialogOpen(false);
            fetchBarbers();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save barber";

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
        if (!deletingBarber) return;

        try {
            setIsLoading(true);
            await deleteBarberManagement(deletingBarber.id);
            toast({
                title: "Success",
                description: "Barber deleted successfully",
            });
            setIsDeleteDialogOpen(false);
            fetchBarbers();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete barber",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        <div>
                            <h1 className="text-3xl font-bold">Barber Management</h1>
                            <p className="text-gray-400">Manage barbers displayed on the website</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchBarbers} className="border-theme-border">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button onClick={handleAddClick} className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Barber
                        </Button>
                    </div>
                </div>

                {/* Barber List */}
                <div className="space-y-4">
                    {isLoading && barbers.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">Loading barbers...</div>
                    ) : barbers.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            No barbers found. Click "Add Barber" to create one.
                        </div>
                    ) : (
                        barbers.map((barber) => (
                            <div
                                key={barber.id}
                                className="bg-theme-card border border-theme-border rounded-lg p-4 hover:border-theme-primary transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="cursor-grab active:cursor-grabbing pt-2">
                                        <GripVertical className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <div className="w-24 h-32 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                                        <img
                                            src={barber.imageBase64}
                                            alt={barber.displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {barber.displayName}
                                                </h3>
                                                <p className="text-sm text-gray-400">@{barber.name}</p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded ${
                                                    barber.isActive
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-gray-500/20 text-gray-400"
                                                }`}
                                            >
                                                {barber.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <div className="space-y-1 mb-3">
                                            <p className="text-sm text-gray-300">
                                                <span className="text-gray-500">Redirect:</span> {barber.redirectUrl}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                <span className="text-gray-500">Landing Page:</span>{" "}
                                                {barber.hasLanding ? "Yes" : "No (Square)"}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                <span className="text-gray-500">Sort Order:</span> {barber.sortOrder}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditClick(barber)}
                                                className="border-theme-border hover:bg-theme-card"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteClick(barber)}
                                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-theme-card border-theme-border text-white max-w-2xl max-h-[85vh] flex flex-col p-0">
                        <DialogHeader className="px-6 pt-6 pb-4 border-b border-theme-border flex-shrink-0">
                            <DialogTitle>{editingBarber ? "Edit Barber" : "Add New Barber"}</DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name (username)</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., amir"
                                        className="bg-black border-theme-border"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        placeholder="e.g., Amir"
                                        className="bg-black border-theme-border"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="redirectUrl">Redirect URL</Label>
                                <Input
                                    id="redirectUrl"
                                    value={formData.redirectUrl}
                                    onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                                    placeholder="e.g., /amir or /book/services"
                                    className="bg-black border-theme-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Barber Image</Label>
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
                                        <img
                                            src={formData.imageBase64}
                                            alt="Preview"
                                            className="w-32 h-40 object-cover rounded border border-theme-border"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="hasLanding"
                                    checked={formData.hasLanding}
                                    onCheckedChange={(checked) => setFormData({ ...formData, hasLanding: checked })}
                                />
                                <Label htmlFor="hasLanding">Has dedicated landing page</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-4 border-t border-theme-border flex-shrink-0">
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
                                {isLoading ? "Saving..." : editingBarber ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="bg-theme-card border-theme-border">
                        <DialogHeader>
                            <DialogTitle>Delete Barber</DialogTitle>
                        </DialogHeader>

                        <p className="text-gray-300">
                            Are you sure you want to delete <strong>{deletingBarber?.displayName}</strong>? This action
                            cannot be undone.
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
