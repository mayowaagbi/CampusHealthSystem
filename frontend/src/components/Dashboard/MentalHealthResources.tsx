import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Heart, PhoneCall } from "lucide-react";

export default function MentalHealthResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mental Health Resources</CardTitle>
        <CardDescription>Helpful tools and information</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <Link
              to="/meditation"
              className="flex items-center text-blue-600 hover:underline"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Guided Meditations
            </Link>
          </li>
          <li>
            <Link
              to="/stress-management"
              className="flex items-center text-blue-600 hover:underline"
            >
              <Heart className="mr-2 h-4 w-4" /> Stress Management Tips
            </Link>
          </li>
          <li>
            <Link
              to="/crisis-helpline"
              className="flex items-center text-blue-600 hover:underline"
            >
              <PhoneCall className="mr-2 h-4 w-4" /> Crisis Helpline
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
