import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

interface StepCountProps {
  stepCount: number;
  stepGoal: number;
}

// Custom hook for geolocation tracking
const useGeolocationTracker = (accessToken: string) => {
  const [lastSentPosition, setLastSentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const calculateDistance = (
    pos1: { latitude: number; longitude: number },
    pos2: { latitude: number; longitude: number }
  ) => {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371e3; // Earth radius in meters
    const φ1 = (pos1.latitude * Math.PI) / 180;
    const φ2 = (pos2.latitude * Math.PI) / 180;
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const trackPosition = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;

    console.log("Current position:", { latitude, longitude });

    if (
      lastSentPosition &&
      calculateDistance(lastSentPosition, { latitude, longitude }) < 10
    ) {
      console.log("Position not sent: Moved less than 10 meters.");
      return;
    }

    try {
      console.log("Sending position to server...");
      const response = await axios.post(
        "/api/geo/track",
        { lat: latitude, lng: longitude },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error sending position:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request setup error:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }

    setLastSentPosition({ latitude, longitude });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        trackPosition,
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [accessToken, lastSentPosition]);
};

export default function StepCount({ stepCount, stepGoal }: StepCountProps) {
  const accessToken = localStorage.getItem("accessToken" as string);
  if (accessToken) {
    useGeolocationTracker(accessToken);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step Count</CardTitle>
        <CardDescription>Your daily activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <span className="text-2xl font-bold">
            {stepCount.toLocaleString()} steps
          </span>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Daily Goal</span>
              <span className="text-sm font-medium">
                {stepCount.toLocaleString()} / {stepGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={(stepCount / stepGoal) * 100} className="w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
