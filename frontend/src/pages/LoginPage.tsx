import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Heart } from "lucide-react";
import Footer from "../components/footer";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Here you would typically handle the login lohgic
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
      </header>
      <main className="flex-1 flex items-center justify-center">
        <motion.div
          className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="text-center">
            {/* <LogIn className="mx-auto h-12 w-12 text-primary" /> */}
            <Heart className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-2xl font-bold">Login to Health Bridge</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="ID"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ID
              </label>
              <Input id="ID" placeholder="e.g 123456" type="ID" required />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          <div className="text-center text-sm">
            <Link to="#" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
