import React, { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../hooks/Auth";
import { type Package } from "../types";
import { firestoreService } from "../services/firestoreService";
import Card from "../components/Card";
import Input from "../components/Input";
// import Button from "../components/Button";
import {
  PackagePlus,
  LoaderCircle,
  Inbox,
  MapPin,
  Package as PackageIcon,
  FileText,
  CheckCircle2,
  Truck,
  History,
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const RecipientDashboard: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [size, setSize] = useState<Package["size"]>("small");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user && userProfile?.role === "recipient") {
      setFetchLoading(true);
      const path = firestoreService.getCollectionPath("packages", user.uid);
      const packagesColRef = collection(db, path);
      const q = query(packagesColRef, orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedPackages = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
          })) as Package[];
          setPackages(fetchedPackages);
          setFetchLoading(false);
        },
        (error) => {
          console.error("Error listening to recipient packages:", error);
          setMessage("Failed to load packages.");
          setFetchLoading(false);
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, userProfile]);

  const handleCreatePackage = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) {
      setMessage("You must be logged in to create a package.");
      return;
    }
    setMessage("");
    try {
      const newPackageData = {
        senderId: user.uid,
        senderEmail: user.email,
        pickupLocation,
        deliveryLocation,
        size,
        description,
        status: "pending" as const,
        createdAt: new Date(),
      };

      // Add to public data, so volunteers can see it
      const publicPath = firestoreService.getCollectionPath("packages");
      const publicDocRef = await addDoc(
        collection(db, publicPath),
        newPackageData
      );

      // Also add to recipient's private collection using the same ID
      const privatePath = firestoreService.getCollectionPath(
        "packages",
        user.uid
      );
      await setDoc(doc(db, privatePath, publicDocRef.id), newPackageData);

      setMessage("Package created successfully!");
      setPickupLocation("");
      setDeliveryLocation("");
      setDescription("");
    } catch (error: any) {
      console.error("Error creating package:", error);
      setMessage("Failed to create package: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <Card className="text-center">
          <p>Loading user data...</p>
        </Card>
      </div>
    );
  }

  if (!user || userProfile?.role !== "recipient") {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <Card className="text-center">
          <p>Access denied. This page is for recipients.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column: Form */}
      <div className="lg:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <PackagePlus className="mr-3 text-blue-600" />
          Request a Delivery
        </h2>
        <Card>
          <form onSubmit={handleCreatePackage} className="space-y-4">
            <div>
              <label
                htmlFor="pickupLocation"
                className="block text-sm font-medium text-gray-700"
              >
                Pickup Location
              </label>
              <Input
                id="pickupLocation"
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                placeholder="e.g., Walmart Supercenter"
              />
            </div>
            <div>
              <label
                htmlFor="deliveryLocation"
                className="block text-sm font-medium text-gray-700"
              >
                Your Delivery Address
              </label>
              <Input
                id="deliveryLocation"
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                required
                placeholder="e.g., 123 Main St, City"
              />
            </div>
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Package Size
              </label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value as Package["size"])}
                className="w-full p-3 rounded-md border border-gray-300"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Bag of groceries"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Request Delivery
            </button>
            {message && (
              <p className="mt-2 text-center text-sm text-green-600">
                {message}
              </p>
            )}
          </form>
        </Card>
      </div>

      {/* Right Column: Package List */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <History className="mr-3 text-blue-600" />
          Your Delivery History
        </h2>
        <Card>
          {fetchLoading ? (
            <div className="flex flex-col items-center justify-center p-10">
              <LoaderCircle className="animate-spin text-blue-600" size={32} />
              <p className="mt-4 text-gray-600">Loading your packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Inbox className="text-gray-400" size={48} />
              <p className="mt-4 font-semibold text-gray-700">
                No Packages Yet
              </p>
              <p className="text-sm text-gray-500">
                Use the form to request your first delivery.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => {
                const statusInfo = {
                  pending: {
                    icon: PackageIcon,
                    color: "bg-yellow-100 text-yellow-800",
                    label: "Pending",
                  },
                  assigned: {
                    icon: Truck,
                    color: "bg-blue-100 text-blue-800",
                    label: "In Transit",
                  },
                  delivered: {
                    icon: CheckCircle2,
                    color: "bg-green-100 text-green-800",
                    label: "Delivered",
                  },
                  cancelled: {
                    icon: FileText,
                    color: "bg-red-100 text-red-800",
                    label: "Cancelled",
                  },
                  inTransit: {
                    icon: Truck,
                    color: "bg-blue-100 text-blue-800",
                    label: "In Transit",
                  },
                }[pkg.status];

                return (
                  <div
                    key={pkg.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500">ID: {pkg.id}</p>
                        <p className="font-semibold text-gray-800 flex items-center mt-1">
                          <MapPin className="mr-2 text-gray-400" size={16} />{" "}
                          From: {pkg.pickupLocation}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <statusInfo.icon className="mr-1.5" size={14} />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <strong>Description:</strong> {pkg.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Requested: {pkg.createdAt.toLocaleString()}
                      </p>
                      {pkg.assignedVolunteerEmail && (
                        <p className="text-xs text-blue-600 mt-1">
                          Volunteer: {pkg.assignedVolunteerEmail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecipientDashboard;
