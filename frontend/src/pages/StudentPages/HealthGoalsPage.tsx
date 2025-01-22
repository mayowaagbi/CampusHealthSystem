import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
import { Progress } from "../../components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const goalData = [
  { day: "Mon", progress: 60 },
  { day: "Tue", progress: 70 },
  { day: "Wed", progress: 65 },
  { day: "Thu", progress: 80 },
  { day: "Fri", progress: 75 },
  { day: "Sat", progress: 90 },
  { day: "Sun", progress: 85 },
];

export default function StudentHealthGoalsPage() {
  const [goalType, setGoalType] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("New goal:", { type: goalType, target: goalTarget });
    // Here you would typically handle the goal submission to your server
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <span className="sr-only">Campus Health Management System</span>
          <img
            alt="Logo"
            className="h-6 w-6"
            src="/placeholder.svg?height=24&width=24"
          />
          <span className="ml-2 text-lg font-semibold">CHMS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/student/student"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/student/appointments"
          >
            Appointments
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/student/health-records"
          >
            Health Records
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/student/notifications"
          >
            Notifications
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/student/profile"
          >
            Profile
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Health Goals</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Set New Goal hello</CardTitle>
                <CardDescription>Define a new health objective</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-type">Goal Type</Label>
                    <Select onValueChange={setGoalType}>
                      <SelectTrigger id="goal-type">
                        <SelectValue placeholder="Select a goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="steps">Daily Steps</SelectItem>
                        <SelectItem value="water">Water Intake</SelectItem>
                        <SelectItem value="sleep">Sleep Hours</SelectItem>
                        <SelectItem value="exercise">
                          Exercise Minutes
                        </SelectItem>
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
            <Card>
              <CardHeader>
                <CardTitle>Current Goals</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Daily Steps</span>
                      <span className="text-sm font-medium">
                        8,000 / 10,000
                      </span>
                    </div>
                    <Progress value={80} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Water Intake</span>
                      <span className="text-sm font-medium">1.5L / 2L</span>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Sleep Hours</span>
                      <span className="text-sm font-medium">7h / 8h</span>
                    </div>
                    <Progress value={87.5} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Weekly Goal Progress</CardTitle>
              <CardDescription>
                Your goal achievement over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={goalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
