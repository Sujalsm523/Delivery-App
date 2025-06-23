import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/Auth";
import { type Package } from "../types";
import { firestoreService } from "../services/firestoreService";
import Card from "../components/Card";
import Button from "../components/Button";
import {
  doc,
  setDoc,
  query,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

const VolunteerDashboard: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user && userProfile?.role === "volunteer") {
      setFetchLoading(true);
      // Listen to all public packages
      const path = firestoreService.getCollectionPath("packages");
      const q = query(collection(db, path), orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedPackages = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
          })) as Package[];

          // Filter for packages that are pending OR assigned to the current volunteer
          const filteredPackages = fetchedPackages.filter(
            (pkg) =>
              pkg.status === "pending" || pkg.assignedVolunteerId === user.uid
          );

          setAvailablePackages(filteredPackages);
          setFetchLoading(false);
        },
        (error) => {
          console.error("Error listening to available packages:", error);
          setMessage("Failed to load packages.");
          setFetchLoading(false);
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, userProfile]);

  const handleUpdatePackageStatus = async (
    pkg: Package,
    status: "assigned" | "delivered"
  ) => {
    if (!user || !user.email) {
      setMessage("You must be logged in to perform this action.");
      return;
    }
    setMessage("");
    try {
      const updateData =
        status === "assigned"
          ? {
              status: "assigned" as const,
              assignedVolunteerId: user.uid,
              assignedVolunteerEmail: user.email,
            }
          : {
              status: "delivered" as const,
              deliveryTime: new Date(),
            };

      // Update package in public collection
      const publicPath = firestoreService.getCollectionPath("packages");
      const publicPackageDocRef = doc(db, publicPath, pkg.id);
      await setDoc(publicPackageDocRef, updateData, { merge: true });

      // Update package in recipient's private collection
      const recipientPath = firestoreService.getCollectionPath(
        "packages",
        pkg.senderId
      );
      const recipientPackageDocRef = doc(db, recipientPath, pkg.id);
      await setDoc(recipientPackageDocRef, updateData, { merge: true });

      setMessage(`Package ${pkg.id} successfully updated to ${status}!`);
    } catch (error: any) {
      console.error(`Error updating package to ${status}:`, error);
      setMessage(`Failed to update package: ` + error.message);
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

  if (!user || userProfile?.role !== "volunteer") {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <Card className="text-center">
          <p>Access denied. This page is for volunteers.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Volunteer Dashboard
      </h2>
      <Card>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Available Deliveries
        </h3>
        {message && (
          <p className="mb-4 text-center text-sm text-blue-600">{message}</p>
        )}
        {fetchLoading ? (
          <p className="text-gray-600">Loading available packages...</p>
        ) : availablePackages.length === 0 ? (
          <p className="text-gray-600">
            No pending deliveries available right now. Check back later!
          </p>
        ) : (
          <div className="space-y-4">
            {availablePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-blue-50 p-4 rounded-md border border-blue-200"
              >
                <p className="text-lg font-medium text-gray-900">
                  Package ID: {pkg.id}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      pkg.status === "pending"
                        ? "text-yellow-700"
                        : pkg.status === "delivered"
                        ? "text-green-700"
                        : "text-blue-700"
                    }`}
                  >
                    {pkg.status.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>From:</strong> {pkg.pickupLocation}
                </p>
                <p>
                  <strong>To:</strong> {pkg.deliveryLocation}
                </p>
                <p>
                  <strong>Size:</strong> {pkg.size}
                </p>
                <p>
                  <strong>Description:</strong> {pkg.description}
                </p>
                <p className="text-sm text-gray-500">
                  Requested by: {pkg.senderEmail}
                </p>
                <p className="text-sm text-gray-500">
                  Requested on: {pkg.createdAt.toLocaleString()}
                </p>
                <div className="mt-3 flex space-x-2">
                  {pkg.status === "pending" && (
                    <Button
                      onClick={() => handleUpdatePackageStatus(pkg, "assigned")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept Delivery
                    </Button>
                  )}
                  {pkg.status === "assigned" &&
                    pkg.assignedVolunteerId === user.uid && (
                      <Button
                        onClick={() =>
                          handleUpdatePackageStatus(pkg, "delivered")
                        }
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  {pkg.status === "delivered" &&
                    pkg.assignedVolunteerId === user.uid && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                        You delivered this!
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default VolunteerDashboard;
