import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle, 
  ChefHat, 
  Clock, 
  Award, 
  Leaf, 
  Truck, 
  Heart 
} from "lucide-react";
import { getData } from "@/firebase/database"; // Your Realtime DB helper

export const metadata: Metadata = {
  title: "Catering Services | Bisoyin Confectionery & Catering Services",
  description:
    "Professional catering services for weddings, birthdays, corporate events, church programs, and special occasions.",
};

// Default fallback data in case the database is empty
const defaultCateringServices = [
  {
    title: "Wedding Catering",
    description: "Elegant buffets, custom wedding cakes, premium small chops, and dedicated drink stations designed to make your special day unforgettable.",
    image: "/images/catering/wedding.jpg",
    features: ["Custom Menu Design", "On-site Coordination", "Premium Table Setup"],
  },
  {
    title: "Corporate Catering",
    description: "Professional and punctual catering for meetings, seminars, conferences, and company events. From boxed lunches to full executive buffets.",
    image: "/images/catering/corporate.jpg",
    features: ["Timely Delivery", "Dietary Options", "Professional Staff"],
  },
  {
    title: "Birthday & Private Parties",
    description: "Celebrate milestones with our themed dessert tables, mouth-watering small chops platters, and delicious main course packages tailored to your guests.",
    image: "/images/catering/birthday.jpg",
    features: ["Themed Dessert Tables", "Kid-Friendly Options", "Flexible Portions"],
  },
  {
    title: "Church Programs & Conventions",
    description: "Reliable, large-scale catering for church events, conventions, thanksgiving services, and celebrations. We handle bulk orders with utmost care.",
    image: "/images/catering/church.jpg",
    features: ["Bulk Meal Packs", "Refreshment Stands", "Budget-Friendly"],
  },
  {
    title: "Outdoor Events & Festivals",
    description: "Quality food and excellent service for picnics, outdoor weddings, festivals, and community celebrations. We bring the kitchen to you.",
    image: "/images/catering/outdoor.jpg",
    features: ["Mobile Food Stations", "Weather-Resistant Setup", "Grill & BBQ Options"],
  },
  {
    title: "VIP & Executive Catering",
    description: "Premium, high-end catering for exclusive gatherings. Featuring beautifully plated meals, personalized service, and artisanal desserts.",
    image: "/images/catering/vip.jpg",
    features: ["Plated Service", "Drink Pairing", "Luxury Presentation"],
  },
];

const whyChooseUs = [
  {
    icon: <Leaf className="text-green-600" size={32} />,
    title: "Fresh Ingredients",
    desc: "We source the highest quality, freshest ingredients for every single dish.",
  },
  {
    icon: <ChefHat className="text-orange-600" size={32} />,
    title: "Expert Chefs",
    desc: "Our experienced culinary team creates unforgettable flavors and presentations.",
  },
  {
    icon: <Clock className="text-blue-600" size={32} />,
    title: "Always On Time",
    desc: "Punctuality is our promise. We ensure your food is ready exactly when you need it.",
  },
  {
    icon: <Award className="text-yellow-600" size={32} />,
    title: "Affordable Luxury",
    desc: "Premium catering experiences tailored to fit your specific budget.",
  },
  {
    icon: <Truck className="text-purple-600" size={32} />,
    title: "Reliable Delivery",
    desc: "Safe, hygienic, and prompt delivery to your venue, no matter the distance.",
  },
  {
    icon: <Heart className="text-red-600" size={32} />,
    title: "Customer First",
    desc: "Dedicated support from the first inquiry to the last guest at your event.",
  },
];

// ✅ Server Component can be async to fetch data directly
export default async function CateringPage() {
  let cateringServices = defaultCateringServices;

  try {
    // Fetch from Firebase Realtime Database "catering" node
    const dbData = await getData("catering");
    
    if (dbData && typeof dbData === "object") {
      // Transform Realtime DB object into an array
      cateringServices = Object.entries(dbData).map(([id, item]: [string, any]) => ({
        id,
        title: item.title || "Catering Service",
        description: item.description || "Professional catering services tailored to your needs.",
        image: item.image || "/images/catering/default.jpg",
        features: Array.isArray(item.features) ? item.features : [],
      }));
    }
  } catch (error) {
    console.error("Failed to load catering services from Realtime DB, using defaults:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-32 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em]">
            Catering Services
          </p>

          <h1 className="text-5xl font-bold md:text-7xl leading-tight">
            Exceptional Catering for <br className="hidden md:block" />
            <span className="text-amber-200">Every Occasion</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-orange-100 leading-relaxed">
            Whether it's a wedding, birthday, corporate event, church program,
            or private celebration, we deliver delicious meals and outstanding
            service that your guests will always remember.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-50 shadow-lg"
            >
              Book Our Catering
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-orange-600"
            >
              View Our Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Catering Services */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Our Catering Packages
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Flexible, customizable catering services tailored to your event size, theme, and budget.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cateringServices.map((service, index) => (
              <div
                key={service.id || index}
                className="group rounded-3xl bg-white overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <ul className="space-y-3">
                      {service.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                          <CheckCircle className="text-orange-600 flex-shrink-0" size={18} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link 
                    href="/contact"
                    className="mt-6 block w-full text-center rounded-xl bg-orange-50 py-3 font-semibold text-orange-600 transition hover:bg-orange-100"
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Why Choose Bisoyin Catering?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to making every event successful through quality, reliability, and exceptional taste.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-orange-200"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gray-50 p-3">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Your Event Memorable?
          </h2>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Let us take care of the food while you enjoy your event. Contact us
            today for a customized catering package tailored to your needs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-orange-500 px-10 py-4 font-semibold text-white transition hover:bg-orange-600 shadow-lg hover:shadow-orange-500/25"
            >
              Request a Custom Quote
            </Link>

            <Link
              href="/menu"
              className="rounded-full border-2 border-gray-600 px-10 py-4 font-semibold text-white transition hover:bg-white hover:text-gray-900"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}