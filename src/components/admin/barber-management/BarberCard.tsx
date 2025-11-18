import { Barber } from "@/interfaces/BarberInterface";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, GripVertical } from "lucide-react";

interface BarberCardProps {
    barber: Barber;
    onEdit: (barber: Barber) => void;
    onDelete: (barber: Barber) => void;
}

export function BarberCard({ barber, onEdit, onDelete }: BarberCardProps) {
    return (
        <div className="bg-theme-card border border-theme-border rounded-lg p-4 hover:border-theme-primary transition-colors">
            <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing pt-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </div>

                {/* Image Preview */}
                <div className="w-24 h-32 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                    <img
                        src={barber.imageBase64}
                        alt={barber.displayName}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-white">{barber.displayName}</h3>
                            <p className="text-sm text-gray-400">@{barber.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Status Badge */}
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

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(barber)}
                            className="border-theme-border hover:bg-theme-card"
                        >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(barber)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
