import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function AmbulanceRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const COOLDOWN_DURATION = 10 * 60 * 1000;

  // Start the cooldown timer
  const startCooldown = () => {
    setCooldown(true);
    setCooldownTime(COOLDOWN_DURATION);
    const interval = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setCooldown(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };
  const handleRequestAmbulance = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser.");
      }

      // Get the user's location with a timeout
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true, // Use high accuracy mode
            timeout: 10000, // 10 seconds timeout
            maximumAge: 0, // Do not use cached location
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Send the ambulance request
      const response = await axios.post(
        "http://localhost:3000/api/ambulance-requests",
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log(
        "Ambulance request sent successfully!\n" +
          `Request ID: ${response.data.id}\n` +
          `Status: ${response.data.status}`
      );
      startCooldown();
    } catch (error) {
      console.error("Error requesting ambulance:", error);

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(
              "Location access denied. Please enable location services."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("Failed to retrieve your location.");
        }
      } else {
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to request ambulance."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const formatCooldownTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Ambulance Request</CardTitle>
        <CardDescription>
          In case of emergency, click below to send your current location to
          dispatch an ambulance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="destructive" // Red button with white text
          onClick={handleRequestAmbulance}
          disabled={loading || cooldown}
          className={`w-full ${
            loading || cooldown ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting Assistance...
            </>
          ) : cooldown ? (
            `Please wait (${formatCooldownTime(cooldownTime)})`
          ) : (
            "Request Emergency Ambulance"
          )}
        </Button>

        {error && (
          <div className="text-red-500 text-sm mt-2">Error: {error}</div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>• Your precise location will be shared with emergency services</p>
          <p>• Keep your phone accessible for follow-up communication</p>
        </div>
      </CardContent>
    </Card>
  );
}
