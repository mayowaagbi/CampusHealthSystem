import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Heart,
  Stethoscope,
  Brain,
  Dumbbell,
  ShieldCheck,
  ClipboardCheck,
  Users,
} from "lucide-react";
import Footer from "../components/Footer";

export default function TSPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="ml-2 text-lg font-bold"
          >
            Health Bridge
          </motion.span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/services"
          >
            Services
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/facilities"
          >
            Facilities
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/education"
          >
            Education
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/contact"
          >
            Contact
          </Link>
          <Button variant="outline" size="sm">
            Login
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            className="container px-4 md:px-6"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8"
              variants={fadeIn}
            >
              Our Services
            </motion.h1>
            <motion.div
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger}
            >
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Stethoscope className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Primary Care</h2>
                <p className="text-sm text-gray-500 text-center">
                  Comprehensive health check-ups and treatments tailored to
                  student needs. From routine physicals to managing chronic
                  conditions, we’ve got you covered.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Brain className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Mental Health Support</h2>
                <p className="text-sm text-gray-500 text-center">
                  Expert counseling, therapy, and workshops to support your
                  mental well-being. We offer individual and group sessions to
                  help you navigate challenges.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Dumbbell className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Wellness Programs</h2>
                <p className="text-sm text-gray-500 text-center">
                  Fitness and nutrition programs designed to help you stay
                  active and healthy. Join yoga classes, fitness challenges, and
                  dietary seminars.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Emergency Services</h2>
                <p className="text-sm text-gray-500 text-center">
                  Quick and reliable emergency assistance, including on-campus
                  ambulance services. Your safety and health are our priority.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <ClipboardCheck className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Health Goal Tracking</h2>
                <p className="text-sm text-gray-500 text-center">
                  Set and monitor personal health goals with ease. Use our
                  platform to track progress and receive automated reminders.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Peer Health Programs</h2>
                <p className="text-sm text-gray-500 text-center">
                  Join peer-led initiatives to foster a supportive
                  health-focused campus community. Engage in campaigns and
                  support groups to promote awareness.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
