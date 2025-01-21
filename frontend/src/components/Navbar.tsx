import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
function Navbar() {
  return (
    <>
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
        <Link to="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      </nav>
    </>
  );
}

export default Navbar;
