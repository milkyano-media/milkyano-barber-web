import { apiClient } from "./apiClients";
import type { GalleryItem, CreateGalleryItemDto, UpdateGalleryItemDto, ReorderGalleryItemDto } from "../interfaces/GalleryInterface";
import { convertImageToBase64, validateImageFile } from "./barberApi";

const GALLERY_MANAGEMENT_BASE = "/gallery-management";

/**
 * Get all gallery items with optional active filter (public)
 */
export async function getGalleryItems(isActive?: boolean): Promise<GalleryItem[]> {
    const params = isActive !== undefined ? { isActive } : {};
    const response = await apiClient.get<{ galleryItems: GalleryItem[] }>(GALLERY_MANAGEMENT_BASE, { params });
    return response.data.galleryItems;
}

/**
 * Get a single gallery item by ID (public)
 */
export async function getGalleryItemById(id: string): Promise<GalleryItem> {
    const response = await apiClient.get<GalleryItem>(`${GALLERY_MANAGEMENT_BASE}/${id}`);
    return response.data;
}

/**
 * Create a new gallery item (admin only)
 */
export async function createGalleryItem(data: CreateGalleryItemDto): Promise<GalleryItem> {
    const response = await apiClient.post<GalleryItem>(GALLERY_MANAGEMENT_BASE, data);
    return response.data;
}

/**
 * Update an existing gallery item (admin only)
 */
export async function updateGalleryItem(id: string, data: UpdateGalleryItemDto): Promise<GalleryItem> {
    const response = await apiClient.patch<GalleryItem>(`${GALLERY_MANAGEMENT_BASE}/${id}`, data);
    return response.data;
}

/**
 * Delete a gallery item (admin only)
 */
export async function deleteGalleryItem(id: string): Promise<void> {
    await apiClient.delete(`${GALLERY_MANAGEMENT_BASE}/${id}`);
}

/**
 * Reorder gallery items (admin only)
 */
export async function reorderGalleryItems(updates: ReorderGalleryItemDto[]): Promise<void> {
    await apiClient.patch(`${GALLERY_MANAGEMENT_BASE}/reorder`, { updates });
}

// Re-export image utilities from barberApi
export { convertImageToBase64, validateImageFile };
