// src/components/CurrentGoals.jsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";
import { Progress } from "./ui/progress";

export default function CurrentGoals() {
  // For demonstration purposes, using static data.
  const currentGoals = [
    { name: "Daily Steps", current: 8000, target: 10000, progress: 80 },
    { name: "Water Intake (L)", current: 1.5, target: 2, progress: 75 },
    { name: "Sleep Hours", current: 7, target: 8, progress: 87.5 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Goals</CardTitle>
        <CardDescription>
          Track your progress toward your set goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentGoals.map((goal, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{goal.name}</span>
                <span className="text-sm font-medium">
                  {goal.current} / {goal.target}
                </span>
              </div>
              <Progress value={goal.progress} className="w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
