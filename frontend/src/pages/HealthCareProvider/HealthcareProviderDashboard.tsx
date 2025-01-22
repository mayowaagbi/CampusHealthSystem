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
import {
  Users,
  Calendar,
  FileText,
  Bell,
  MessageSquare,
  Pill,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const appointmentData = [
  { name: "Mon", scheduled: 8, completed: 7 },
  { name: "Tue", scheduled: 10, completed: 9 },
  { name: "Wed", scheduled: 12, completed: 11 },
  { name: "Thu", scheduled: 9, completed: 8 },
  { name: "Fri", scheduled: 11, completed: 10 },
];

export default function HealthcareProviderDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          className="flex items-center justify-center"
          to="/healthcare-provider"
        >
          <span className="sr-only">
            Campus Health Management System - Healthcare Provider
          </span>
          <img
            alt="Logo"
            className="h-6 w-6"
            src="/placeholder.svg?height=24&width=24"
          />
          <span className="ml-2 text-lg font-semibold">CHMS Provider</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/healthcare-provider/patients"
          >
            Patients
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/healthcare-provider/appointments"
          >
            Appointments
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/healthcare-provider/health-records"
          >
            Health Records
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/healthcare-provider/prescriptions"
          >
            Prescriptions
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/healthcare-provider/alerts"
          >
            Alerts
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">
            Healthcare Provider Dashboard
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Patients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Today's Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">
                  3 pending approval
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
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  Uploaded in the last 24 hours
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
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">1 high priority</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Overview</CardTitle>
                <CardDescription>
                  Weekly scheduled vs. completed appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="scheduled"
                        fill="#8884d8"
                        name="Scheduled"
                      />
                      <Bar
                        dataKey="completed"
                        fill="#82ca9d"
                        name="Completed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Frequently used provider actions
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button asChild>
                  <Link to="/healthcare-provider/appointments/create">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/healthcare-provider/health-records/upload">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Health Record
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/healthcare-provider/prescriptions/create">
                    <Pill className="mr-2 h-4 w-4" />
                    Write Prescription
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/healthcare-provider/alerts/create">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Create Health Alert
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Messages</CardTitle>
                <CardDescription>
                  Latest communications from patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      John Doe: Question about medication side effects
                    </span>
                  </li>
                  <li className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      Jane Smith: Request for appointment rescheduling
                    </span>
                  </li>
                  <li className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      Mike Johnson: Follow-up on recent lab results
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>
                  Recently added health tips and articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      10 Tips for Managing Stress During Exams
                    </span>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      The Importance of Sleep for Academic Performance
                    </span>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Nutrition Guide for College Students
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
