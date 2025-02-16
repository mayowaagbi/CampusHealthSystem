// src/components/SetNewGoal.jsx
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";

export default function SetNewGoal() {
  const [goalType, setGoalType] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalType || !goalTarget) {
      alert("Please select a goal type and enter a target.");
      return;
    }
    // Here, you would submit the new goal to your server
    console.log("New goal set:", { type: goalType, target: goalTarget });
    alert("New goal set successfully!");
    setGoalType("");
    setGoalTarget("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set New Health Goal</CardTitle>
        <CardDescription>
          Define a new health objective to work towards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-type">Goal Type</Label>
            <Select onValueChange={setGoalType} value={goalType}>
              <SelectTrigger id="goal-type">
                <SelectValue placeholder="Select a goal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steps">Daily Steps</SelectItem>
                <SelectItem value="water">Water Intake</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-target">Target</Label>
            <Input
              id="goal-target"
              placeholder="Enter your target"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
            />
          </div>
          <Button type="submit">Set Goal</Button>
        </form>
      </CardContent>
    </Card>
  );
}
