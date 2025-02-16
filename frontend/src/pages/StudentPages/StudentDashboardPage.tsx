// import { useState, useEffect } from "react";
// import { Link, Outlet } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { Progress } from "../../components/ui/progress";
// import {
//   Bell,
//   Calendar,
//   FileText,
//   Target,
//   User,
//   Plus,
//   Minus,
//   Heart,
//   PhoneCall,
//   BookOpen,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { useToast } from "../../hooks/use-toast";
// import { ToastAction } from "../../components/ui/toast";
// import { MoodTracker } from "../../components/MoodTracker";
// import { JournalEntry } from "../../components/JournalEntry";
// import { EmergencyContacts } from "../../components/EmergencyContacts";
// import StudentNavBar from "./components/StudentNavBar";

// const healthData = [
//   { day: "Mon", steps: 6000, calories: 2100, sleep: 7 },
//   { day: "Tue", steps: 7500, calories: 2300, sleep: 6.5 },
//   { day: "Wed", steps: 8000, calories: 2200, sleep: 7.5 },
//   { day: "Thu", steps: 7200, calories: 2400, sleep: 8 },
//   { day: "Fri", steps: 8500, calories: 2500, sleep: 7 },
//   { day: "Sat", steps: 9000, calories: 2600, sleep: 8.5 },
//   { day: "Sun", steps: 7800, calories: 2300, sleep: 7.5 },
// ];

// export default function StudentDashboardPage() {
//   const [waterIntake, setWaterIntake] = useState(1.5);
//   const [stepCount, setStepCount] = useState(8000);
//   const [sleepHours, setSleepHours] = useState(7.5);
//   const { toast } = useToast();

//   const waterGoal = 2.5;
//   const stepGoal = 10000;
//   const sleepGoal = 8;

//   useEffect(() => {
//     if (waterIntake >= waterGoal) {
//       toast({
//         title: "Water Intake Goal Reached!",
//         description: "Great job staying hydrated today!",
//         action: <ToastAction altText="Close">Dismiss</ToastAction>,
//       });
//     }
//     if (stepCount >= stepGoal) {
//       toast({
//         title: "Step Goal Reached!",
//         description: "Congratulations on meeting your step goal!",
//         action: <ToastAction altText="Close">Dismiss</ToastAction>,
//       });
//     }
//     if (sleepHours >= sleepGoal) {
//       toast({
//         title: "Sleep Goal Reached!",
//         description: "You've met your sleep goal. Keep up the good rest!",
//         action: <ToastAction altText="Close">Dismiss</ToastAction>,
//       });
//     }
//   }, [waterIntake, stepCount, sleepHours, toast]);

//   const handleWaterChange = (amount: number) => {
//     setWaterIntake((prev) => Math.max(0, prev + amount));
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <header className="px-4 lg:px-6 h-14 flex items-center">
//         <StudentNavBar />
//       </header>
//       <main className="flex-1 py-6 px-4 md:px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

//           {/* Physical Health Section */}
//           <h2 className="text-2xl font-semibold mb-4">Physical Health</h2>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Health Alerts</CardTitle>
//                 <CardDescription>
//                   Your recent health notifications
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   <li className="flex items-center text-yellow-600">
//                     <Bell className="mr-2 h-4 w-4" />
//                     Flu shot reminder
//                   </li>
//                   <li className="flex items-center text-green-600">
//                     <Bell className="mr-2 h-4 w-4" />
//                     Health check-up completed
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Upcoming Appointments</CardTitle>
//                 <CardDescription>Your scheduled health visits</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   <li className="flex items-center">
//                     <Calendar className="mr-2 h-4 w-4" />
//                     Dental Check-up - 05/15/2025
//                   </li>
//                   <li className="flex items-center">
//                     <Calendar className="mr-2 h-4 w-4" />
//                     Nutritionist Consult - 05/22/2025
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Water Intake</CardTitle>
//                 <CardDescription>Track your daily hydration</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       onClick={() => handleWaterChange(-0.5)}
//                     >
//                       <Minus className="h-4 w-4" />
//                     </Button>
//                     <span className="text-2xl font-bold">
//                       {waterIntake.toFixed(1)}L
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       onClick={() => handleWaterChange(0.5)}
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Daily Goal</span>
//                       <span className="text-sm font-medium">
//                         {waterIntake.toFixed(1)}L / {waterGoal}L
//                       </span>
//                     </div>
//                     <Progress
//                       value={(waterIntake / waterGoal) * 100}
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Step Count</CardTitle>
//                 <CardDescription>Your daily activity</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <span className="text-2xl font-bold">
//                     {stepCount.toLocaleString()} steps
//                   </span>
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Daily Goal</span>
//                       <span className="text-sm font-medium">
//                         {stepCount.toLocaleString()} /{" "}
//                         {stepGoal.toLocaleString()}
//                       </span>
//                     </div>
//                     <Progress
//                       value={(stepCount / stepGoal) * 100}
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Sleep Tracker</CardTitle>
//                 <CardDescription>Monitor your sleep patterns</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <span className="text-2xl font-bold">{sleepHours} hours</span>
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Daily Goal</span>
//                       <span className="text-sm font-medium">
//                         {sleepHours} / {sleepGoal} hours
//                       </span>
//                     </div>
//                     <Progress
//                       value={(sleepHours / sleepGoal) * 100}
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Mental Health Resources Section */}
//           <h2 className="text-2xl font-semibold mb-4">
//             Mental Health Resources
//           </h2>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Mood Tracker</CardTitle>
//                 <CardDescription>Track your daily mood</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <MoodTracker />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Journal</CardTitle>
//                 <CardDescription>Express your thoughts</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <JournalEntry />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Mental Health Resources</CardTitle>
//                 <CardDescription>Helpful tools and information</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   <li>
//                     <Link
//                       to="/meditation"
//                       className="flex items-center text-blue-600 hover:underline"
//                     >
//                       <BookOpen className="mr-2 h-4 w-4" />
//                       Guided Meditations
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/stress-management"
//                       className="flex items-center text-blue-600 hover:underline"
//                     >
//                       <Heart className="mr-2 h-4 w-4" />
//                       Stress Management Tips
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/crisis-helpline"
//                       className="flex items-center text-blue-600 hover:underline"
//                     >
//                       <PhoneCall className="mr-2 h-4 w-4" />
//                       Crisis Helpline
//                     </Link>
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Emergency Contacts Section */}
//           <h2 className="text-2xl font-semibold mb-4">Emergency Contacts</h2>
//           <div className="grid gap-6 md:grid-cols-2 mb-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Your Emergency Contacts</CardTitle>
//                 <CardDescription>
//                   Manage your emergency contacts
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <EmergencyContacts />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Request Help</CardTitle>
//                 <CardDescription>
//                   Contact campus security or health services
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <Button className="w-full" variant="destructive">
//                     <PhoneCall className="mr-2 h-4 w-4" />
//                     Contact Campus Security
//                   </Button>
//                   <Button className="w-full">
//                     <Heart className="mr-2 h-4 w-4" />
//                     Contact Health Services
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card className="mt-6">
//             <CardHeader>
//               <CardTitle>Weekly Health Overview</CardTitle>
//               <CardDescription>
//                 Your activity, calorie intake, and sleep for the past week
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={healthData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="day" />
//                     <YAxis yAxisId="left" />
//                     <YAxis yAxisId="right" orientation="right" />
//                     <Tooltip />
//                     <Line
//                       yAxisId="left"
//                       type="monotone"
//                       dataKey="steps"
//                       stroke="#8884d8"
//                       name="Steps"
//                     />
//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="calories"
//                       stroke="#82ca9d"
//                       name="Calories"
//                     />
//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="sleep"
//                       stroke="#ffc658"
//                       name="Sleep (hours)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//           <div className="grid gap-4 md:grid-cols-4 mt-6">
//             <Button asChild>
//               <Link to="/student/appointments">
//                 <Calendar className="mr-2 h-4 w-4" /> Book Appointment
//               </Link>
//             </Button>
//             <Button asChild variant="outline">
//               <Link to="/student/health-records">
//                 <FileText className="mr-2 h-4 w-4" /> View Health Records
//               </Link>
//             </Button>
//             <Button asChild variant="outline">
//               <Link to="/student/health-goals">
//                 <Target className="mr-2 h-4 w-4" /> Set New Goal
//               </Link>
//             </Button>
//             <Button asChild variant="outline">
//               <Link to="/student/profile">
//                 <User className="mr-2 h-4 w-4" /> Update Profile
//               </Link>
//             </Button>
//           </div>
//         </motion.div>
//         <Outlet />
//       </main>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastAction } from "../../components/ui/toast";
import { useToast } from "../../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
// Import the shared components
import StudentNavBar from "./components/StudentNavBar";

// Import dashboard widgets
import HealthAlerts from "../../components/Dashboard/HealthAlerts";
import UpcomingAppointments from "../../components/Dashboard/UpcomingAppointments";
import WaterIntake from "../../components/Dashboard/WaterIntake";
import StepCount from "../../components/Dashboard/StepCount";
import SleepTracker from "../../components/Dashboard/SleepTracker";
import { MoodTracker } from "../../components/Dashboard/MoodTracker";
import { JournalEntry } from "../../components/JournalEntry";
import MentalHealthResources from "../../components/Dashboard/MentalHealthResources";
import AmbulanceRequest from "../../components/Dashboard/AmbulanceRequest";
import WeeklyHealthOverview from "../../components/Dashboard/WeeklyHealthOverview";
import QuickLinks from "../../components/Dashboard/QuickLinks";
import { MoodAndJournal } from "../../components/Dashboard/MoodAndJournal";

// Dummy data for Weekly Health Overview
const healthData = [
  { day: "Mon", steps: 6000, calories: 2100, sleep: 7 },
  { day: "Tue", steps: 7500, calories: 2300, sleep: 6.5 },
  { day: "Wed", steps: 8000, calories: 2200, sleep: 7.5 },
  { day: "Thu", steps: 7200, calories: 2400, sleep: 8 },
  { day: "Fri", steps: 8500, calories: 2500, sleep: 7 },
  { day: "Sat", steps: 9000, calories: 2600, sleep: 8.5 },
  { day: "Sun", steps: 7800, calories: 2300, sleep: 7.5 },
];

export default function StudentDashboardPage() {
  const [waterIntake, setWaterIntake] = useState(1.5);
  const [stepCount, setStepCount] = useState(0);
  const [sleepHours, setSleepHours] = useState(7.5);
  const { toast } = useToast();

  const waterGoal = 2.5;
  const stepGoal = 10000;
  const sleepGoal = 8;

  useEffect(() => {
    if (waterIntake >= waterGoal) {
      toast({
        title: "Water Intake Goal Reached!",
        description: "Great job staying hydrated today!",
        action: <ToastAction altText="Close">Dismiss</ToastAction>,
      });
    }
    if (stepCount >= stepGoal) {
      toast({
        title: "Step Goal Reached!",
        description: "Congratulations on meeting your step goal!",
        action: <ToastAction altText="Close">Dismiss</ToastAction>,
      });
    }
    if (sleepHours >= sleepGoal) {
      toast({
        title: "Sleep Goal Reached!",
        description: "You've met your sleep goal. Keep up the good rest!",
        action: <ToastAction altText="Close">Dismiss</ToastAction>,
      });
    }
  }, [waterIntake, stepCount, sleepHours, toast]);

  const handleWaterChange = (amount: number) => {
    setWaterIntake((prev) => Math.max(0, prev + amount));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <StudentNavBar />
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

          {/* Physical Health Section */}
          <h2 className="text-2xl font-semibold mb-4">Physical Health</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <HealthAlerts />
            <UpcomingAppointments />
            <WaterIntake
              waterIntake={waterIntake}
              waterGoal={waterGoal}
              onChange={handleWaterChange}
            />
            <StepCount stepCount={stepCount} stepGoal={stepGoal} />
            {/* <SleepTracker sleepHours={sleepHours} sleepGoal={sleepGoal} /> */}
          </div>

          {/* Mental Health Resources Section */}
          <h2 className="text-2xl font-semibold mb-4">
            Mental Health Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Mood Tracker</CardTitle>
                <CardDescription>Track your daily mood</CardDescription>
              </CardHeader>
              <CardContent>
                <MoodAndJournal />
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle>Journal</CardTitle>
                <CardDescription>Express your thoughts</CardDescription>
              </CardHeader>
              <CardContent>
                <JournalEntry />
              </CardContent>
            </Card> */}
            <MentalHealthResources />
          </div>

          {/* Emergency Contacts Section */}
          <h2 className="text-2xl font-semibold mb-4">Ambulance Request</h2>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <AmbulanceRequest />
          </div>

          {/* Weekly Health Overview */}
          <WeeklyHealthOverview data={healthData} />

          {/* Quick Links */}
          <QuickLinks />
        </motion.div>
        <Outlet />
      </main>
    </div>
  );
}
