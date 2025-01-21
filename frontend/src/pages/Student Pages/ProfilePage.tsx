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
import { Switch } from "../../components/ui/switch";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    emergencyContact: "Jane Doe",
    emergencyPhone: "(987) 654-3210",
    bloodType: "A+",
    allergies: "None",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleNotificationChange = (type: "email" | "sms" | "push") => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      notifications: {
        ...prevProfile.notifications,
        [type]: !prevProfile.notifications[type],
      },
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Updated profile:", profile);
    // Here you would typically handle the profile update submission to your server
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
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/appointments"
          >
            Appointments
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/health-records"
          >
            Health Records
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/health-goals"
          >
            Health Goals
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/notifications"
          >
            Notifications
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>
                  Who should we contact in case of emergency?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">
                    Emergency Contact Name
                  </Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={profile.emergencyContact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">
                    Emergency Contact Phone
                  </Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={profile.emergencyPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>Important health details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    value={profile.bloodType}
                    onValueChange={(value) =>
                      setProfile((prev) => ({ ...prev, bloodType: value }))
                    }
                  >
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    value={profile.allergies}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={profile.notifications.email}
                    onCheckedChange={() => handleNotificationChange("email")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    checked={profile.notifications.sms}
                    onCheckedChange={() => handleNotificationChange("sms")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Switch
                    id="pushNotifications"
                    checked={profile.notifications.push}
                    onCheckedChange={() => handleNotificationChange("push")}
                  />
                </div>
              </CardContent>
            </Card>
            <Button type="submit">Save Changes</Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
