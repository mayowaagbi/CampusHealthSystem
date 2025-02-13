import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyHealthOverviewProps {
  data: any[]; // Define a type if needed
}

export default function WeeklyHealthOverview({
  data,
}: WeeklyHealthOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Health Overview</CardTitle>
        <CardDescription>
          Your activity, calorie intake, and sleep for the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="steps"
                stroke="#8884d8"
                name="Steps"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="calories"
                stroke="#82ca9d"
                name="Calories"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sleep"
                stroke="#ffc658"
                name="Sleep (hours)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
