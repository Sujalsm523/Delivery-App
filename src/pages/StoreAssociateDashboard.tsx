import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/Auth";
import { type Package } from "../types";
import { firestoreService } from "../services/firestoreService";
import Card from "../components/Card";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const StoreAssociateDashboard: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user && userProfile?.role === "storeAssociate") {
      setFetchLoading(true);
      // Store associates need to see all public packages
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
          setAllPackages(fetchedPackages);
          setFetchLoading(false);
        },
        (error) => {
          console.error("Error listening to all packages:", error);
          setFetchLoading(false);
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <Card className="text-center">
          <p>Loading user data...</p>
        </Card>
      </div>
    );
  }

  if (!user || userProfile?.role !== "storeAssociate") {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <Card className="text-center">
          <p>Access denied. This page is for store associates.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Store Associate Dashboard
      </h2>

      <Card>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          All Active Deliveries
        </h3>
        {fetchLoading ? (
          <p className="text-gray-600">Loading all packages...</p>
        ) : allPackages.length === 0 ? (
          <p className="text-gray-600">No packages to manage.</p>
        ) : (
          <div className="space-y-4">
            {allPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-orange-50 p-4 rounded-md border border-orange-200"
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
                {pkg.assignedVolunteerEmail && (
                  <p className="text-sm text-blue-700">
                    Assigned Volunteer: {pkg.assignedVolunteerEmail}
                  </p>
                )}
                {/* Store associates could have buttons here to mark picked up, verify, etc. */}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StoreAssociateDashboard;
