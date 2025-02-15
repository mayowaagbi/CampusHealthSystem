import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
export function EmergencyContacts() {
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([
    { name: "Campus Security", phone: "123-456-7890" },
  ]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const handleAddContact = () => {
    if (newContactName && newContactPhone) {
      setContacts([
        ...contacts,
        { name: newContactName, phone: newContactPhone },
      ]);
      setNewContactName("");
      setNewContactPhone("");
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          {/* <CardDescription>Track your daily hydration</CardDescription> */}
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {contacts.map((contact, index) => (
              <li key={index} className="border p-2 rounded">
                <strong>{contact.name}</strong>: {contact.phone}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Input
              placeholder="Contact Name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Contact Phone"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleAddContact}>Add Contact</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
