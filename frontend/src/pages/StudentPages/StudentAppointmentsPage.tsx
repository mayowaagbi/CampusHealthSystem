import { z } from "zod";
import { ConfirmAppointmentDialog } from "../../components/ConfirmAppointmentDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { jwtDecode } from "jwt-decode";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

// Enums and Constants
enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  RESCHEDULED = "RESCHEDULED",
}

const SERVICE_OPTIONS = [
  { value: "General Check-up", duration: 30 },
  { value: "Dental", duration: 60 },
  { value: "Counseling", duration: 60 },
  { value: "Nutrition Consultation", duration: 45 },
];

// Zod schema for appointment creation
const appointmentSchema = z.object({
  service: z.string().nonempty({ message: "Please select a service." }),
  startTime: z.date().refine((date) => date >= new Date(), {
    message: "Date must be in the future.",
  }),
  notes: z.string().optional(),
});

// Type for form values
type AppointmentFormValues = z.infer<typeof appointmentSchema>;

// Define the shape of the decoded token (from login)
interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

export default function StudentAppointmentPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingAppointment, setPendingAppointment] =
    useState<AppointmentFormValues | null>(null);

  const navigate = useNavigate();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      service: "",
      startTime: new Date(),
      notes: "",
    },
  });

  // Fetch appointments – backend will filter by student using the token
  const fetchAppointments = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Access token not found.");

      const response = await axios.get(
        "http://localhost:3000/api/appointments",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { t: Date.now() }, // Add cache-busting parameter
        }
      );

      console.log("Appointments fetched:", response.data);
      setAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments.");
    }
  };

  // onSubmit: Open a confirmation dialog before booking
  const onSubmit = async (data: AppointmentFormValues) => {
    setPendingAppointment(data);
    setIsConfirmDialogOpen(true);
  };

  // When the appointment is confirmed, create it.
  const handleConfirmAppointment = async () => {
    if (!pendingAppointment) return;

    setIsLoading(true);
    try {
      const selectedService = SERVICE_OPTIONS.find(
        (s) => s.value === pendingAppointment.service
      );
      if (!selectedService) {
        throw new Error("Invalid service selected.");
      }

      // Calculate endTime based on startTime and service duration
      const startTimeISO = new Date(pendingAppointment.startTime).toISOString();

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found.");
      }

      // Decode the token to extract user information.
      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      console.log(pendingAppointment);
      // Ensure only a student can book an appointment.
      if (decodedToken.role !== "STUDENT") {
        throw new Error("Only students can book appointments.");
      }
      console.log(pendingAppointment);

      // Create appointment payload. The userId is derived from the token.
      await axios.post(
        `http://localhost:3000/api/appointments/`,
        {
          ...pendingAppointment,
          userid: decodedToken.id, // Send user ID here
          startTime: startTimeISO,
          duration: selectedService.duration,
          service: pendingAppointment.service,
          providerId: null, // To be assigned later by healthcare staff.
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success("Appointment booked successfully!");
      fetchAppointments();
      form.reset();
      setSelectedAppointment(null);
      setIsConfirmDialogOpen(false);
      setPendingAppointment(null);
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to book appointment."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reschedule: Pre-fill the form with the selected appointment details.
  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    form.setValue("service", appointment.service);
    form.setValue("startTime", new Date(appointment.startTime));
    form.setValue("notes", appointment.notes || "");
  };

  // Cancel an appointment – the backend should verify that the student making
  // the request is the owner using the token.
  const handleCancel = async (appointmentId: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Access token not found.");

      // Decode token to check user role
      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      if (decodedToken.role !== "STUDENT") {
        throw new Error("Only students can cancel appointments.");
      }

      await axios.delete(
        `http://localhost:3000/api/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      fetchAppointments();
      toast.success("Appointment canceled");
    } catch (error: any) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
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
            to="/student/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/student/health-records"
          >
            Health Records
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/student/health-goals"
          >
            Health Goals
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

      {/* Main Content */}
      <main className="flex-1 py-6 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Appointments</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedAppointment
                    ? "Reschedule Appointment"
                    : "Book an Appointment"}
                </CardTitle>
                <CardDescription>
                  Select a service and time for your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Service */}
                  <div className="space-y-2">
                    <Label>Service</Label>
                    <Select
                      onValueChange={(value) => form.setValue("service", value)}
                      value={form.watch("service")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_OPTIONS.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.value} ({service.duration} minutes)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-2">
                    <Label>Date and Time</Label>
                    <Calendar
                      mode="single"
                      selected={form.watch("startTime")}
                      onSelect={(date) => {
                        if (date) {
                          const newDateTime = new Date(date);
                          newDateTime.setHours(
                            form.watch("startTime").getHours()
                          );
                          newDateTime.setMinutes(
                            form.watch("startTime").getMinutes()
                          );
                          form.setValue("startTime", newDateTime);
                        }
                      }}
                      disabled={(date) => date < new Date()}
                    />
                    <Input
                      type="time"
                      value={format(form.watch("startTime"), "HH:mm")}
                      onChange={(e) => {
                        const newDateTime = parse(
                          e.target.value,
                          "HH:mm",
                          new Date()
                        );
                        newDateTime.setFullYear(
                          form.watch("startTime").getFullYear(),
                          form.watch("startTime").getMonth(),
                          form.watch("startTime").getDate()
                        );
                        form.setValue("startTime", newDateTime);
                      }}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      placeholder="Any additional information (optional)"
                      {...form.register("notes")}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? "Processing..."
                      : selectedAppointment
                      ? "Reschedule"
                      : "Book Appointment"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled health visits</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            {format(
                              new Date(appointment.startTime),
                              "MMM dd, yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(appointment.startTime), "hh:mm a")}
                          </TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{appointment.duration} minutes</TableCell>
                          <TableCell>{appointment.location || "N/A"}</TableCell>
                          <TableCell>{appointment.status}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReschedule(appointment)}
                            >
                              Reschedule
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No upcoming appointments.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <ConfirmAppointmentDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmAppointment}
        appointmentData={
          pendingAppointment || { service: "", startTime: new Date() }
        }
      />
    </div>
  );
}
