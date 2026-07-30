"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Loader,
} from "lucide-react";
import { getData, updateData } from "@/firebase/database";

interface Settings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  openingHours: string;
  deliveryFee: string;
  currency: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    businessName: "Bisoyin Confectionery & Catering Services",
    email: "info@bisoyin.com",
    phone: "+234 800 000 0000",
    address: "Osogbo, Osun State, Nigeria",
    website: "https://bisoyin.com",
    openingHours: "Monday - Saturday (8:00 AM - 7:00 PM)",
    deliveryFee: "3000",
    currency: "NGN (₦)",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await getData("settings");

        if (settingsData) {
          setSettings((prev) => ({
            ...prev,
            ...settingsData,
          }));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // Validate required fields
      if (
        !settings.businessName ||
        !settings.email ||
        !settings.phone ||
        !settings.address
      ) {
        alert("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(settings.email)) {
        alert("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      // Validate delivery fee is a number
      if (isNaN(parseFloat(settings.deliveryFee))) {
        alert("Delivery fee must be a number.");
        setLoading(false);
        return;
      }

      // Save to Firebase
      await updateData("settings", {
        ...settings,
        updatedAt: new Date().toISOString(),
      });

      setHasChanges(false);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Unable to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Business Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Update your business information and application settings.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          {hasChanges && (
            <div className="mb-6 rounded-xl bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-700">
                You have unsaved changes. Click "Save Settings" to apply them.
              </p>
            </div>
          )}

          <div className="grid gap-6">

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                <Store size={18} />
                Business Name
              </label>

              <input
                type="text"
                name="businessName"
                value={settings.businessName}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                <Mail size={18} />
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                <Phone size={18} />
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                <MapPin size={18} />
                Business Address
              </label>

              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                <Globe size={18} />
                Website
              </label>

              <input
                type="text"
                name="website"
                value={settings.website}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                <Clock size={18} />
                Opening Hours
              </label>

              <input
                type="text"
                name="openingHours"
                value={settings.openingHours}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., Monday - Saturday (8:00 AM - 7:00 PM)"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium text-gray-900">
                  Delivery Fee (₦)
                </label>

                <input
                  type="number"
                  name="deliveryFee"
                  value={settings.deliveryFee}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-900">
                  Currency
                </label>

                <input
                  type="text"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
                />
              </div>

            </div>

          </div>

          <div className="mt-10 flex gap-4">

            <button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Settings
                </>
              )}
            </button>

            {hasChanges && (
              <button
                onClick={() => {
                  window.location.reload();
                }}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Discard Changes
              </button>
            )}

          </div>

        </div>

        {/* Settings Info */}

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Settings Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-xl bg-orange-50 p-6 border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">
                Business Details
              </h3>
              <p className="text-sm text-orange-700">
                Your business name, phone, email and address are used for customer inquiries and order confirmations.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                Delivery Settings
              </h3>
              <p className="text-sm text-blue-700">
                Set your delivery fee that will be added to customer orders. Update opening hours to manage customer expectations.
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}