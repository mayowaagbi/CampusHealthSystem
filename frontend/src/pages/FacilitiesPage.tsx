import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Building, Dumbbell, Leaf } from "lucide-react";

export default function FacilitiesPage() {
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
        <Navbar />
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
              Our Facilities
            </motion.h1>
            <motion.div
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger}
            >
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Building className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Medical Center</h2>
                <p className="text-sm text-gray-500 text-center">
                  Our state-of-the-art medical center is equipped with the
                  latest technology to provide comprehensive care. From general
                  check-ups to specialized treatments, we've got you covered.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Dumbbell className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Fitness Center</h2>
                <p className="text-sm text-gray-500 text-center">
                  Stay active and healthy in our modern gym. With a wide range
                  of equipment and expert trainers, our fitness center caters to
                  all levels of fitness enthusiasts.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Leaf className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Wellness Center</h2>
                <p className="text-sm text-gray-500 text-center">
                  Find your balance in our wellness center. Offering meditation
                  rooms, yoga studios, and spaces for relaxation, it's your
                  sanctuary for mental and emotional well-being.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 Health Bridge. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
