"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {useAuth} from "@/components/auth-provider"

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    bio: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        school: user.school || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();
    setIsUpdating(true);

    const res = await fetch("/api/user/save-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
      setUser({ ...user, ...formData });
    } else {
      toast({ title: "Update failed", description: "An error occurred while updating your profile.", variant: "destructive" });
    }

    setIsUpdating(false);
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(Object.keys(formData) as Array<keyof typeof formData>).map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input id={key} value={formData[key] ?? ""} onChange={handleChange} />
              </div>
            ))}
          </div>
          <Button type="submit" disabled={isUpdating}>{isUpdating ? "Updating..." : "Update profile"}</Button>
        </form>
      </div>
    </div>
  );
}
