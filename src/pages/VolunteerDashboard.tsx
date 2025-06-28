import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/Auth";
import { type Package } from "../types";
import { firestoreService } from "../services/firestoreService";
import {
  doc,
  setDoc,
  query,
  collection,
  orderBy,
  onSnapshot,
  Timestamp // Import Timestamp to correctly check its type
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  MapPin,
  Package as PackageIcon,
  User,
  Navigation,
  Filter,
  Search,
  Truck,
  CheckCircle,
  AlertCircle,
  X,
  Star,
  Eye,
  Loader,
} from "lucide-react";


const VolunteerDashboard: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    rating: 4.8,
    totalEarnings: 0
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user && userProfile?.role === "volunteer") {
      setFetchLoading(true);
      const path = firestoreService.getCollectionPath("packages");
      const q = query(collection(db, path), orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedPackages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
              // Convert Firestore Timestamp to JavaScript Date object
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
              // Convert Firestore Timestamp to JavaScript Date object, if deliveryTime exists
              deliveryTime: data.deliveryTime instanceof Timestamp ? data.deliveryTime.toDate() : data.deliveryTime,
            } as Package;
          });

          const filteredPackages = fetchedPackages.filter(
            (pkg) =>
              pkg.status === "pending" ||
              pkg.assignedVolunteerId === user.uid
          );
          setAvailablePackages(filteredPackages);

          const userPackages = fetchedPackages.filter(
            (pkg) => pkg.assignedVolunteerId === user.uid
          );
          const deliveredPackages = userPackages.filter(
            (pkg) => pkg.status === "delivered"
          );

          const today = new Date();
          const todayDeliveries = deliveredPackages.filter((pkg) => {
            // pkg.deliveryTime is already a Date object if converted in the map above
            const deliveryDate = pkg.deliveryTime ? pkg.deliveryTime : null;
            return deliveryDate && deliveryDate.toString() === today.toDateString();
          });

          setStats((prev) => ({
            ...prev,
            totalDeliveries: deliveredPackages.length,
            completedToday: todayDeliveries.length,
            totalEarnings: deliveredPackages.length * 25,
          }));

          setFetchLoading(false);
        },
        (error) => {
          console.error("Error listening to available packages:", error);
          setMessage("Failed to load packages.");
          setFetchLoading(false);
        }
      );
    }
    return () => unsubscribe && unsubscribe();
  }, [user, userProfile]);
  
  // Removed unused getUrgencyColor function


 
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
      setSelectedPackage(null);
    } catch (error: any) {
      console.error(`Error updating package to ${status}:`, error);
      setMessage(`Failed to update package: ` + error.message);
    }
  };

  const filteredPackages = availablePackages.filter(pkg => {
    const matchesFilter = filter === "all" || pkg.status === filter;
    const matchesSearch = pkg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pkg.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned": return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const MapComponent = ({ package: pkg }: { package: Package }) => (
    <div className="w-full h-64 bg-gray-200 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Interactive Map</p>
          <p className="text-xs text-gray-500 mt-1">
            From: {pkg.pickupLocation}
          </p>
          <p className="text-xs text-gray-500">
            To: {pkg.deliveryLocation}
          </p>
        </div>
      </div>
      {/* Simulated route line */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-blue-500 transform rotate-45"></div>
      {/* Pickup marker */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
      {/* Delivery marker */}
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user || userProfile?.role !== "volunteer") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-900 mb-2">Access Denied</p>
          <p className="text-gray-600">This page is for volunteers only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your deliveries efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.name || user?.email || "Volunteer"}
                </p>
                <p className="text-xs text-gray-500">Active • Online</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <PackageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-center">{message}</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {fetchLoading ? (
          <div className="text-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading available packages...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-900 mb-2">
              {availablePackages.length === 0 
                ? "No deliveries available"
                : "No packages found"
              }
            </p>
            <p className="text-gray-600">
              {availablePackages.length === 0
                ? "Check back later for new delivery opportunities!"
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <PackageIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">{pkg.id}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pkg.status)}`}>
                      {pkg.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">From</p>
                        <p className="text-gray-600">{pkg.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">To</p>
                        <p className="text-gray-600">{pkg.deliveryLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Size</p>
                      <p className="font-medium">{pkg.size}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      {/* FIX: pkg.createdAt is already a Date object from useEffect */}
                      <p className="font-medium">{pkg.createdAt.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-900 line-clamp-2">{pkg.description}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Requested by: {pkg.senderEmail}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>

                    {pkg.status === "pending" && (
                      <button
                        onClick={() => handleUpdatePackageStatus(pkg, "assigned")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Accept
                      </button>
                    )}

                    {pkg.status === "assigned" && pkg.assignedVolunteerId === user.uid && (
                      <button
                        onClick={() => handleUpdatePackageStatus(pkg, "delivered")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {pkg.status === "delivered" && pkg.assignedVolunteerId === user.uid && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Package Details Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Package Details - {selectedPackage.id}
              </h3>
              <button
                onClick={() => setSelectedPackage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Package Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Package Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPackage.status)}`}>
                          {selectedPackage.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{selectedPackage.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        {/* FIX: selectedPackage.createdAt is already a Date object from useEffect */}
                        <span className="font-medium">{selectedPackage.createdAt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Description</h4>
                    <p className="text-gray-700">{selectedPackage.description}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-2">Sender</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{selectedPackage.senderEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Map and Locations */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Route Map</h4>
                    <MapComponent package={selectedPackage} />
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Locations</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="p-2 bg-green-100 rounded-full">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Pickup Location</p>
                          <p className="text-sm text-green-700">{selectedPackage.pickupLocation}</p>
                          <div className="mt-2 flex space-x-2">
                            <button className="inline-flex items-center px-3 py-1 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50">
                              <Navigation className="h-3 w-3 mr-1" />
                              Navigate
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="p-2 bg-red-100 rounded-full">
                          <MapPin className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-red-900">Delivery Location</p>
                          <p className="text-sm text-red-700">{selectedPackage.deliveryLocation}</p>
                          <div className="mt-2 flex space-x-2">
                            <button className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                              <Navigation className="h-3 w-3 mr-1" />
                              Navigate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <p className="font-medium">Package created</p>
                          {/* FIX: selectedPackage.createdAt is already a Date object from useEffect */}
                          <p className="text-gray-600">{selectedPackage.createdAt.toLocaleString()}</p>
                        </div>
                      </div>
                      {selectedPackage.status !== "pending" && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="text-sm">
                            <p className="font-medium">Assigned to volunteer</p>
                            <p className="text-gray-600">You accepted this delivery</p>
                          </div>
                        </div>
                      )}
                      {selectedPackage.status === "delivered" && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="text-sm">
                            <p className="font-medium">Package delivered</p>
                            <p className="text-gray-600">
                              {/* FIX: selectedPackage.deliveryTime is already a Date object from useEffect */}
                              {selectedPackage.deliveryTime 
                                ? selectedPackage.deliveryTime.toLocaleString()
                                : "Recently completed"
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                
                {selectedPackage.status === "pending" && (
                  <button
                    onClick={() => handleUpdatePackageStatus(selectedPackage, "assigned")}
                    className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Accept Delivery
                  </button>
                )}

                {selectedPackage.status === "assigned" && selectedPackage.assignedVolunteerId === user.uid && (
                  <button
                    onClick={() => handleUpdatePackageStatus(selectedPackage, "delivered")}
                    className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
