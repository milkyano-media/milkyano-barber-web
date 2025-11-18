export interface Barber {
    id: string;
    name: string;
    displayName: string;
    imageBase64: string;
    redirectUrl: string;
    hasLanding: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBarberDto {
    name: string;
    displayName: string;
    imageBase64: string;
    redirectUrl: string;
    hasLanding: boolean;
    isActive?: boolean;
}

export interface UpdateBarberDto {
    name?: string;
    displayName?: string;
    imageBase64?: string;
    redirectUrl?: string;
    hasLanding?: boolean;
    isActive?: boolean;
}

export interface ReorderBarberDto {
    id: string;
    sortOrder: number;
}
