"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getData, updateData } from "@/firebase/database";

interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  profileImage?: string;
  createdAt?: number;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load user profile from Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const loadProfile = async () => {
      try {
        const userData = await getData(`users/${user.uid}`);

        if (userData) {
          setProfile({
            name: userData.name || "",
            email: userData.email || user.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            profileImage: userData.profileImage || "",
            createdAt: userData.createdAt,
          });

          if (userData.profileImage) {
            setImagePreview(userData.profileImage);
          }
        } else {
          // Create default profile if doesn't exist
          setProfile({
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
            address: "",
            city: "",
            state: "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.uid, user?.displayName, user?.email]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
    setHasChanges(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setProfile({
          ...profile,
          profileImage: result,
        });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    // Validate required fields
    if (!profile.name || !profile.email || !profile.phone) {
      alert("Please fill in all required fields (Name, Email, Phone).");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setSaving(true);

    try {
      await updateData(`users/${user.uid}`, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        profileImage: profile.profileImage,
        updatedAt: new Date().toISOString(),
      });

      setHasChanges(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-6">

        {/* Heading */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">

          {/* Left Card - Profile Picture */}

          <div className="rounded-2xl bg-white p-8 shadow-sm h-fit">

            <div className="flex flex-col items-center">

              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-orange-500 bg-gray-200">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <span className="text-sm">No photo</span>
                  </div>
                )}
              </div>

              <label
                htmlFor="image-upload"
                className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 cursor-pointer"
              >
                Change Photo
              </label>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className="hidden"
              />

              <h2 className="mt-8 text-2xl font-bold text-center">
                {profile.name || "User"}
              </h2>

              <p className="mt-2 text-gray-500 text-center text-sm break-all">
                {profile.email}
              </p>

              <p className="mt-4 text-xs text-gray-400 text-center">
                Member since{" "}
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "now"}
              </p>

            </div>

          </div>

          {/* Right Card - Profile Information */}

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            {hasChanges && (
              <div className="mb-6 rounded-xl bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm text-blue-700">
                  You have unsaved changes. Click "Save Changes" to apply them.
                </p>
              </div>
            )}

            <h2 className="mb-8 text-2xl font-bold">
              Personal Information
            </h2>

            <div className="grid gap-6">

              <div>
                <label className="mb-2 block font-medium text-gray-900">
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-900">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-900">
                  Phone Number <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-900">
                  Address
                </label>

                <textarea
                  rows={3}
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter your full address"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block font-medium text-gray-900">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Enter your city"
                    className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-900">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Enter your state"
                    className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                  />
                </div>

              </div>

            </div>

            <div className="mt-10 flex gap-4">

              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>

              {hasChanges && (
                <button
                  onClick={() => window.location.reload()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Discard Changes
                </button>
              )}

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}