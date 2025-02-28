import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  ChevronDown,
  Search,
  FileText,
  Calendar,
  MessageSquare,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";

type StudentWithDetails = {
  id: string;
  studentId: string;
  insuranceNumber?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bloodType?: string;
    allergies?: string;
  };
  alerts?: Array<{
    status: string;
    priority: string;
  }>;
  appointments?: Array<{
    startTime: string;
    status: string;
  }>;
  medicalDocuments?: Array<{
    filename: string;
    uploadedAt: string;
  }>;
};

export default function PatientManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get<StudentWithDetails[]>(
          "http://localhost:3000/api/student",
          {
            params: {
              search: searchTerm,
              status: statusFilter,
              include: "profile,alerts,appointments",
            },
          }
        );

        if (Array.isArray(response.data)) {
          setStudents(response.data);
          setError(null);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load students";
        setError(message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchTerm, statusFilter]);

  const getStudentStatus = (student: StudentWithDetails) => {
    if (
      student.alerts?.some(
        (a) => a.status === "ACTIVE" && a.priority === "HIGH"
      )
    ) {
      return "Critical";
    }
    const lastAppointment = student.appointments?.[0];
    return lastAppointment?.status || "No History";
  };

  const statusVariants: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    "No History": "bg-blue-100 text-blue-800",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          className="flex items-center justify-center"
          to="/healthcare-provider/dashboard"
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
            Student Patient Management
          </h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Patient List</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  Error: {error}
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Sliders className="mr-2 h-4 w-4" />
                      Status: {statusFilter.replace("_", " ")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Statuses
                    </DropdownMenuItem>
                    {Object.keys(statusVariants).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status.replace("_", " ")}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Last Appointment</TableHead>
                    <TableHead>Active Alerts</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => {
                      const status = getStudentStatus(student);
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            {student.profile?.firstName}{" "}
                            {student.profile?.lastName}
                          </TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>
                            {student.profile?.phone || "N/A"}
                          </TableCell>
                          <TableCell>
                            {student.insuranceNumber || "None"}
                          </TableCell>
                          <TableCell>
                            {student.appointments?.[0]
                              ? new Date(
                                  student.appointments[0].startTime
                                ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {student.alerts?.filter(
                              (a) => a.status === "ACTIVE"
                            ).length || 0}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                statusVariants[status.replace(" ", "_")]
                              }
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions{" "}
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/healthcare-provider/students/${student.id}/records`}
                                    className="flex items-center"
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Health Records
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/healthcare-provider/appointments/new?studentId=${student.id}`}
                                    className="flex items-center"
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedule Appointment
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/healthcare-provider/alerts/new?studentId=${student.id}`}
                                    className="flex items-center"
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Create Alert
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
