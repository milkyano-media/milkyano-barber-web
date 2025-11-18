import { useState, useEffect } from "react";
import { getBarbersManagement } from "@/utils/barberApi";
import type { Barber } from "@/interfaces/BarberInterface";

/**
 * Hook to fetch barbers
 * @param isActive - Optional filter for active status
 * @returns Object containing barbers array, loading state, and error
 */
export function useBarbers(isActive?: boolean) {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getBarbersManagement(isActive);
                setBarbers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch barbers");
                console.error("Error fetching barbers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBarbers();
    }, [isActive]);

    return { barbers, loading, error };
}
