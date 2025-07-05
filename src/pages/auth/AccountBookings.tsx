import { Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AccountBookings() {
  // In a real implementation, this would fetch booking data from an API
  const bookings = [];

  return (
    <Card className="bg-[#0a0a0a] border-stone-800">
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
        <CardDescription>
          View your past and upcoming appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {/* Booking list would go here */}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No bookings yet</p>
            <p className="text-sm mt-2">Your booking history will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}