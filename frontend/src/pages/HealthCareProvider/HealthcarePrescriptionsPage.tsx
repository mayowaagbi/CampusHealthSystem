import { useContext, useEffect, useState } from "react";
import { useAmbulanceRequestContext } from "../../context/AmbulanceRequestContext";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

export default function AmbulanceRequestsPage() {
  const { ambulanceRequests, resolveRequest, socket } =
    useAmbulanceRequestContext();
  const { toast } = useToast();

  // Filter requests with statuses other than "PENDING"
  const nonPendingRequests = ambulanceRequests.filter(
    (request) => request.status !== "PENDING"
  );

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
            Ambulance
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
            Ambulance Request Management
          </h1>

          {/* Table for Pending Requests */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pending Ambulance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ambulanceRequests
                    .filter((request) => request.status === "PENDING")
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.userId}</TableCell>
                        <TableCell>
                          {request.user.profile.firstName}{" "}
                          {request.user.profile.lastName}{" "}
                        </TableCell>
                        <TableCell>{request.user.profile.bloodType}</TableCell>
                        <TableCell>{request.user.profile.phone}</TableCell>
                        <TableCell>{request.address}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded ${
                              request.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "RESOLVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {request.status === "PENDING" && (
                            <Button
                              variant="destructive"
                              onClick={() => resolveRequest(request.id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Table for Resolved/Other Requests */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resolved/Other Ambulance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nonPendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.userId}</TableCell>
                      <TableCell>
                        {request.user.profile.firstName}{" "}
                        {request.user.profile.lastName}{" "}
                      </TableCell>
                      <TableCell>{request.user.profile.bloodType}</TableCell>
                      <TableCell>{request.user.profile.phone}</TableCell>
                      <TableCell>{request.address}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded ${
                            request.status === "RESOLVED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
