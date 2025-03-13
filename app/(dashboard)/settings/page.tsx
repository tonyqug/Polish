"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { getAuth } from "firebase/auth";

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

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        school: user.school || "",
        bio: user.bio || ""
      });
      setLoading(false); // Set loading to false once user data is loaded
    }
  }, [user]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const auth = getAuth(); // Get the Firebase auth instance

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const user = auth.currentUser; // Get the current authenticated user

    const token = await user?.getIdToken();
    const res = await fetch("/api/user/save-user", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div
            className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full animate-spin"
            style={{ borderTopColor: "#fff" }}
          ></div>
          <p className="mt-4 text-xl font-bold text-white">Loading...</p>
        </div>
      </div>
    );
  }
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
          <Button type="submit" disabled={isUpdating || loading}>{isUpdating ? "Updating..." : "Update profile"}</Button>
        </form>
      </div>
    </div>
  );
}
