/**
 * Gallery Item Interface
 */
export interface GalleryItem {
    id: string;
    title: string;
    description?: string;
    imageBase64: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create Gallery Item DTO
 */
export interface CreateGalleryItemDto {
    title: string;
    description?: string;
    imageBase64: string;
    isActive?: boolean;
}

/**
 * Update Gallery Item DTO
 */
export interface UpdateGalleryItemDto {
    title?: string;
    description?: string;
    imageBase64?: string;
    isActive?: boolean;
}

/**
 * Reorder Gallery Item DTO
 */
export interface ReorderGalleryItemDto {
    id: string;
    sortOrder: number;
}
