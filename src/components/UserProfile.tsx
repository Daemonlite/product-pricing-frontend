"use client";

import React, { useState, useEffect, ReactElement } from "react";
import Input from "./ui/Input-field";
import { Button } from "./ui/button";
import { useThemeCustomizer } from "./theme/ThemeProvider";
import { useAuth } from "../context/AuthContext";

const UserProfile = (): ReactElement => {
  const { primaryColor } = useThemeCustomizer();
  const { user } = useAuth();
  console.log("user", user);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [avatar, setAvatar] = useState<string | null>(null);

  // Initialize profile data from authenticated user
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.full_name || user.name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        role: user.role || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you might want to handle save logic like API calls
    alert("Profile saved! (this is a placeholder action)");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 card">
      {/* <h2
        className={`text-3xl font-semibold mb-6 text-[hsl(var(--primary))]`}
      >
        User Profile
      </h2> */}

      <div className="flex flex-col items-center mb-8">
        <div
          className={`w-32 h-32 rounded-full border-4 border-[hsl(var(--primary))] overflow-hidden mb-4`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-[hsl(var(--primary))] flex items-center justify-center text-white text-5xl font-bold`}
            >
              {profileData.name
                ? profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "UP"}
            </div>
          )}
        </div>
        {/* <label
          htmlFor="avatar-upload"
          className={`cursor-pointer text-[hsl(var(--primary))] hover:underline`}
        >
          Change Avatar
        </label>
        <input
          type="file"
          accept="image/*"
          id="avatar-upload"
          className="hidden"
          onChange={handleAvatarChange}
        /> */}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <Input
          label="Full Name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          disabled
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          disabled
        />
        <Input
          label="Role"
          type="text"
          name="role"
          value={profileData.role}
          onChange={handleChange}
          placeholder="Your role"
          disabled
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" color="primary" type="reset">
            Reset
          </Button>
          <Button variant="primary" color="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
