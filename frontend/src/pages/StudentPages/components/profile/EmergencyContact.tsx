import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
interface EmergencyContactProps {
  contacts: Array<{
    name: string;
    phone: string;
    relation?: string;
  }>;
  onChange: (
    index: number,
    field: keyof EmergencyContactProps["contacts"][number],
    value: string
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  isEditing: boolean;
}

export default function EmergencyContact({
  contacts,
  onChange,
  onAdd,
  onRemove,
  isEditing,
}: EmergencyContactProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          Who should we contact in case of emergency?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="space-y-4 border-b pb-4 last:border-0">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Contact #{index + 1}</h4>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Name</Label>
              <Input
                id={`name-${index}`}
                value={contact.name}
                onChange={(e) => onChange(index, "name", e.target.value)}
                readOnly={!isEditing}
                className={cn(
                  !isEditing && "bg-muted/50 cursor-not-allowed",
                  "transition-colors"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>Phone</Label>
              <Input
                id={`phone-${index}`}
                value={contact.phone}
                onChange={(e) => onChange(index, "phone", e.target.value)}
                readOnly={!isEditing}
                className={cn(
                  !isEditing && "bg-muted/50 cursor-not-allowed",
                  "transition-colors"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`relation-${index}`}>Relation</Label>
              <Input
                id={`relation-${index}`}
                value={contact.relation || ""}
                onChange={(e) => onChange(index, "relation", e.target.value)}
                readOnly={!isEditing}
                className={cn(
                  !isEditing && "bg-muted/50 cursor-not-allowed",
                  "transition-colors"
                )}
              />
            </div>
          </div>
        ))}

        {isEditing && (
          <Button variant="outline" onClick={onAdd}>
            Add Emergency Contact
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
