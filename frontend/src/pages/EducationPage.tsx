import { motion } from "framer-motion";
import { BookOpen, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EducationPage() {
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
      <header className="">
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
              Health Education Resources
            </motion.h1>
            <motion.div
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger}
            >
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <BookOpen className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Health Awareness Articles</h2>
                <p className="text-sm text-gray-500 text-center">
                  Access curated articles written by students and health
                  professionals. Topics include basic first aid, stress
                  management, and maintaining a balanced diet during exams.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Peer-Led Health Forums</h2>
                <p className="text-sm text-gray-500 text-center">
                  Participate in forums led by trained student volunteers. Share
                  experiences, ask health-related questions, and learn from
                  peers in a safe, supportive environment.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-2 border p-4 rounded-lg"
                variants={fadeIn}
              >
                <BookOpen className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">Health Check Guidelines</h2>
                <p className="text-sm text-gray-500 text-center">
                  Follow step-by-step guidelines for self-checkups on vital
                  health parameters like BMI and hydration levels, designed
                  specifically for students.
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
