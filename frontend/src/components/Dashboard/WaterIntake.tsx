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
interface WaterIntakeProps {
  waterIntake: number;
  waterGoal: number;
  onChange: (amount: number) => void;
}

// Export the component as default
export default function WaterIntake({
  waterIntake,
  waterGoal,
  onChange,
}: WaterIntakeProps) {
  return (
    <div>
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
                // onClick={() => handleWaterChange(-0.5)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold">
                {waterIntake.toFixed(1)}L
              </span>
              <Button
                variant="outline"
                size="icon"
                // onClick={() => handleWaterChange(0.5)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Daily Goal</span>
                <span className="text-sm font-medium">
                  {waterIntake.toFixed(1)}L / {waterGoal}L
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
    </div>
  );
}
