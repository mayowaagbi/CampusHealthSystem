import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
      <h3 className="text-lg font-semibold mb-2">Emergency Contacts</h3>
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
    </div>
  );
}
