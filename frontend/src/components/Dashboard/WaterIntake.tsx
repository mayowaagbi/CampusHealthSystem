import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Minus, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import axios from "axios";

export default function WaterIntake() {
  // waterIntake is stored in milliliters
  const [waterIntake, setWaterIntake] = useState(0);
  const [loading, setLoading] = useState(false);
  const waterGoal = 2500; // Fixed water goal in milliliters (2.5 L)

  // Fetch current water intake on mount
  useEffect(() => {
    const fetchWaterIntake = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token not found.");
        const response = await axios.get("http://localhost:3000/api/water", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setWaterIntake(response.data.current || 0);
      } catch (error) {
        console.error("Error fetching water intake:", error);
      }
    };
    fetchWaterIntake();
  }, []);

  const handleWaterChange = async (amount: number) => {
    const newTotal = waterIntake + amount;
    console.log(
      "Current:",
      waterIntake,
      "Amount:",
      amount,
      "New Total:",
      newTotal,
      "Goal:",
      waterGoal
    );
    if (newTotal < 0 || newTotal > waterGoal) {
      alert("Water intake cannot be negative or exceed the daily goal.");
      return;
    }
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Access token not found.");
      const response = await axios.post(
        "http://localhost:3000/api/water/intake",
        { amount },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Server response:", response.data);
      setWaterIntake(response.data.current);
    } catch (error) {
      console.error("Error updating water intake:", error);
      alert("Failed to update water intake.");
      if ((error as any).response) {
        // The request was made and the server responded with a status code
        if (axios.isAxiosError(error) && error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }

        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          alert("Invalid data. Please check your input and try again.");
        } else if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          alert("Unauthorized. Please log in again.");
        } else {
          alert("Failed to update water intake. Please try again later.");
        }
      } else if ((error as any).request) {
        // The request was made but no response was received
        if (axios.isAxiosError(error)) {
          console.error("No response received:", error.request);
        } else {
          console.error("No response received:", error);
        }
        alert("No response from the server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        if (error instanceof Error) {
          console.error("Request setup error:", error.message);
        } else {
          console.error("Request setup error:", error);
        }
        alert("Failed to send request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Intake</CardTitle>
        <CardDescription>Track your daily hydration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleWaterChange(-50)} // subtract 50 ml
              disabled={loading}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-2xl font-bold">
              {(waterIntake / 1000).toFixed(1)}L
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleWaterChange(50)} // add 50 ml
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Daily Goal</span>
              <span className="text-sm font-medium">
                {(waterIntake / 1000).toFixed(1)}L /{" "}
                {(waterGoal / 1000).toFixed(1)}L
              </span>
            </div>
            <Progress
              value={(waterIntake / waterGoal) * 100}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
