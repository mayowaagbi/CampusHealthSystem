import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// import { Input } from "../../components/ui/input";

import {
  BarChart,
  Users,
  Calendar,
  FileText,
  Settings,
  Bell,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Jan", appointments: 400, healthRecords: 240 },
  { name: "Feb", appointments: 300, healthRecords: 139 },
  { name: "Mar", appointments: 200, healthRecords: 980 },
  { name: "Apr", appointments: 278, healthRecords: 390 },
  { name: "May", appointments: 189, healthRecords: 480 },
  { name: "Jun", appointments: 239, healthRecords: 380 },
];

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/admin">
          <span className="sr-only">Campus Health Management System Admin</span>
          <img
            alt="Logo"
            className="h-6 w-6"
            src="/placeholder.svg?height=24&width=24"
          />
          <span className="ml-2 text-lg font-semibold">CHMS Admin</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/admin/students"
          >
            Students
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/admin/appointments"
          >
            Appointments
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/admin/health-records"
          >
            Health Records
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/admin/health-alerts"
          >
            Health Alerts
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/admin/settings"
          >
            Settings
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Appointments Today
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  -4% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  New Health Records
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  +12.3% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Alerts
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  2 new since last login
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>System Activity Overview</CardTitle>
              <CardDescription>
                Monthly appointments and health records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="appointments" fill="#8884d8" />
                    <Bar dataKey="healthRecords" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used admin actions</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button asChild>
                  <Link to="/admin/appointments/create">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule New Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/students/create">
                    <Users className="mr-2 h-4 w-4" />
                    Add New Student
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/health-records/create">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Health Record
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Bell className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-sm">
                      Emergency: Campus-wide health advisory issued
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Bell className="mr-2 h-4 w-4 text-yellow-500" />
                    <span className="text-sm">
                      Warning: High volume of appointment requests
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Bell className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Info: System maintenance scheduled for tonight
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Alerts</CardTitle>
              <CardDescription>
                Latest health notifications for campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-sm">High: Flu Outbreak Warning</span>
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="text-sm">
                    Medium: COVID-19 Vaccination Reminder
                  </span>
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Low: Mental Health Awareness Week
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
