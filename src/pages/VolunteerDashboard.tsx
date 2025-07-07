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
  Calendar, // Added for date specific stats
  DollarSign // For earnings icon
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
    rating: 4.8, // Static for now, could be dynamic
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

          // Filter for packages available to the volunteer (pending) or assigned to them
          const packagesForVolunteer = fetchedPackages.filter(
            (pkg) =>
              pkg.status === "pending" ||
              (pkg.assignedVolunteerId === user.uid)
          );
          setAvailablePackages(packagesForVolunteer);

          const userAssignedPackages = fetchedPackages.filter(
            (pkg) => pkg.assignedVolunteerId === user.uid
          );
          const deliveredPackages = userAssignedPackages.filter(
            (pkg) => pkg.status === "delivered"
          );

          const today = new Date();
          const todayDeliveries = deliveredPackages.filter((pkg) => {
            const deliveryDate = pkg.deliveryTime ? pkg.deliveryTime : null;
            // Ensure both are Date objects for comparison
            return deliveryDate && deliveryDate.toDateString() === today.toDateString();
          });

          setStats((prev) => ({
            ...prev,
            totalDeliveries: deliveredPackages.length,
            completedToday: todayDeliveries.length,
            totalEarnings: deliveredPackages.length * 25, // Assuming $25 per delivery
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

  
// VolunteerDashboard.tsx

const handleUpdatePackageStatus = async (
  pkg: Package,
  status: "assigned" | "delivered"
) => {
  if (!user || !user.email) {
    setMessage("You must be logged in to perform this action.");
    return;
  }
  setMessage(""); // Clear previous messages
  try {
    const updateData =
      status === "assigned"
        ? {
            status: "assigned" as const,
            assignedVolunteerId: user.uid,
            assignedVolunteerEmail: user.email,
            assignedAt: new Date(), // As discussed previously, ensure this is set
          }
        : {
            status: "delivered" as const,
            deliveryTime: new Date(),
          };

    // 1. Update package in public collection
    const publicPath = firestoreService.getCollectionPath("packages");
    const publicPackageDocRef = doc(db, publicPath, pkg.id);
    await setDoc(publicPackageDocRef, updateData, { merge: true });

    // 2. Update package in sender's private collection (the person who originally requested)
    const senderPath = firestoreService.getCollectionPath(
      "packages",
      pkg.senderId
    );
    const senderPackageDocRef = doc(db, senderPath, pkg.id);
    await setDoc(senderPackageDocRef, updateData, { merge: true });

    // 3. NEW: Update package in recipient's private collection
    // This is crucial for the RecipientDashboard to reflect the change
    if (pkg.recipientId) { // Ensure recipientId exists on the package
        const recipientPath = firestoreService.getCollectionPath(
            "packages",
            pkg.recipientId
        );
        const recipientPackageDocRef = doc(db, recipientPath, pkg.id);
        await setDoc(recipientPackageDocRef, updateData, { merge: true });
    } else {
        console.warn("Recipient ID not found for package:", pkg.id, "Cannot update recipient's private collection.");
    }


    setMessage(`Package ${pkg.id} successfully updated to ${status}!`);
    setSelectedPackage(null); // Close modal on success
  } catch (error: unknown) {
    console.error(`Error updating package to ${status}:`, error);
    if (error instanceof Error) {
      setMessage(`Failed to update package: ` + error.message);
    } else {
      setMessage("Failed to update package due to an unknown error.");
    }
  }
};
  const filteredPackages = availablePackages.filter(pkg => {
    const matchesFilter = filter === "all" || pkg.status === filter;
    const matchesSearch = pkg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pkg.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pkg.pickupLocation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pkg.deliveryLocation || "").toLowerCase().includes(searchTerm.toLowerCase());
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
    // A more visually engaging placeholder for the map
    <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg relative overflow-hidden flex items-center justify-center">
      <div className="text-center text-gray-700">
        <MapPin className="h-10 w-10 text-blue-500 mx-auto mb-3 animate-pulse" />
        <p className="font-semibold text-lg mb-1">Route Visualization</p>
        <p className="text-sm text-gray-600">
          From: <span className="font-medium text-blue-800">{pkg.pickupLocation}</span>
        </p>
        <p className="text-sm text-gray-600">
          To: <span className="font-medium text-red-800">{pkg.deliveryLocation}</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          (Interactive map integration coming soon!)
        </p>
      </div>
      {/* Subtle map-like graphics */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="20" cy="20" r="15" fill="#a7f3d0" />
          <circle cx="80" cy="80" r="15" fill="#fecaca" />
          <path d="M25 25 Q 50 10 75 75" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          <path d="M25 25 L 75 75" stroke="#3b82f6" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Loader className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user || userProfile?.role !== "volunteer") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-gray-100 animate-fade-in">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <p className="text-2xl font-bold text-gray-900 mb-3">Access Denied</p>
          <p className="text-gray-700 max-w-sm">
            This page is exclusively for registered volunteers. Please log in with a volunteer account to proceed.
          </p>
          {/* Optionally add a link to login or home */}
          <div className="mt-6">
            <a href="/login" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Volunteer Dashboard</h1>
              <p className="text-md text-gray-600 mt-1">Efficiently manage your package deliveries</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-md font-semibold text-gray-900">
                  Hello, {userProfile?.name || user?.email?.split('@')[0] || "Volunteer"}!
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-end">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Online
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                <User className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 flex items-center justify-center">
                <PackageIcon className="h-7 w-7 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-7 w-7 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.rating}<span className="text-xl text-gray-500">/5</span></p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center animate-fade-in-down">
            <p className="text-blue-800 font-medium">{message}</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto flex-grow">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, description, location..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-700 w-full"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned to Me</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {fetchLoading ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-6" />
            <p className="text-xl text-gray-700 font-medium">Fetching available deliveries...</p>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-gray-900 mb-3">
              {availablePackages.length === 0
                ? "No deliveries available right now!"
                : "No packages found matching your criteria."
              }
            </p>
            <p className="text-gray-600 max-w-lg mx-auto">
              {availablePackages.length === 0
                ? "We're always adding new delivery opportunities. Check back soon!"
                : "Try adjusting your search query or filter options to see more packages."
              }
            </p>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform hover:translate-y-[-3px] transition-all duration-200 ease-in-out">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <PackageIcon className="h-6 w-6 text-indigo-500" />
                      <span className="font-bold text-lg text-gray-900">Package ID: {pkg.id}</span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(pkg.status)}`}>
                      {pkg.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4 mb-5 border-b pb-4 border-gray-100">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">Pickup Location</p>
                        <p className="text-gray-600">{pkg.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">Delivery Location</p>
                        <p className="text-gray-600">{pkg.deliveryLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                    <div>
                      <p className="text-gray-500">Package Size</p>
                      <p className="font-semibold text-gray-800 mt-1">{pkg.size}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Requested On</p>
                      <p className="font-semibold text-gray-800 mt-1">{pkg.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{pkg.description || "No description provided."}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>

                    {pkg.status === "pending" && (
                      <button
                        onClick={() => handleUpdatePackageStatus(pkg, "assigned")}
                        className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                      >
                        <Truck className="h-4 w-4 mr-2" /> Accept Delivery
                      </button>
                    )}

                    {pkg.status === "assigned" && pkg.assignedVolunteerId === user.uid && (
                      <button
                        onClick={() => handleUpdatePackageStatus(pkg, "delivered")}
                        className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Mark Delivered
                      </button>
                    )}

                    {pkg.status === "delivered" && pkg.assignedVolunteerId === user.uid && (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Delivery Completed!
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-up-modal">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Package Details - <span className="text-blue-600">{selectedPackage.id}</span>
              </h3>
              <button
                onClick={() => setSelectedPackage(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Package Info */}
              <div className="space-y-7">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <PackageIcon className="h-5 w-5 mr-2 text-indigo-500" /> Package Information
                  </h4>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="font-medium text-gray-600">Status:</span>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(selectedPackage.status)}`}>
                        {selectedPackage.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Size:</span>
                      <span className="font-semibold text-gray-900">{selectedPackage.size}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Requested On:</span>
                      <span className="font-semibold text-gray-900">{selectedPackage.createdAt.toLocaleString()}</span>
                    </div>
                    {selectedPackage.deliveryTime && selectedPackage.status === "delivered" && (
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Delivered On:</span>
                            <span className="font-semibold text-gray-900">{selectedPackage.deliveryTime.toLocaleString()}</span>
                        </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2 text-blue-500" /> Description
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {selectedPackage.description || "No specific description provided for this package."}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-500" /> Contact Information
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="font-medium text-blue-900 mb-2">Sender</p>
                    <p className="text-sm text-blue-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2" /> {selectedPackage.senderEmail}
                    </p>
                  </div>
                  {selectedPackage.status !== "pending" && selectedPackage.assignedVolunteerEmail && (
                     <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-4">
                     <p className="font-medium text-green-900 mb-2">Assigned Volunteer</p>
                     <p className="text-sm text-green-700 flex items-center">
                       <Truck className="h-4 w-4 mr-2" /> {selectedPackage.assignedVolunteerEmail}
                     </p>
                   </div>
                  )}
                </div>
              </div>

              {/* Right Column - Map and Locations */}
              <div className="space-y-7">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Navigation className="h-5 w-5 mr-2 text-orange-500" /> Route Overview
                  </h4>
                  <MapComponent package={selectedPackage} />
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-500" /> Key Locations
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                      <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">Pickup Location</p>
                        <p className="text-sm text-green-700">{selectedPackage.pickupLocation}</p>
                        <div className="mt-2">
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPackage.pickupLocation)}`}
                             target="_blank" rel="noopener noreferrer"
                             className="inline-flex items-center px-4 py-2 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors duration-150">
                            <Navigation className="h-3.5 w-3.5 mr-1.5" />
                            Navigate
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                      <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-900">Delivery Location</p>
                        <p className="text-sm text-red-700">{selectedPackage.deliveryLocation}</p>
                        <div className="mt-2">
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPackage.deliveryLocation)}`}
                             target="_blank" rel="noopener noreferrer"
                             className="inline-flex items-center px-4 py-2 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors duration-150">
                            <Navigation className="h-3.5 w-3.5 mr-1.5" />
                            Navigate
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-teal-500" /> Delivery Timeline
                  </h4>
                  <ol className="relative border-s border-gray-200 ml-4">
                    <li className="mb-6 ms-6">
                      <span className="absolute flex items-center justify-center w-3 h-3 bg-blue-100 rounded-full -start-1.5 ring-8 ring-white">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      </span>
                      <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900">
                        Package Created
                      </h3>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                        {selectedPackage.createdAt.toLocaleString()}
                      </time>
                    </li>
                    {selectedPackage.status !== "pending" && (
                      <li className="mb-6 ms-6">
                        <span className="absolute flex items-center justify-center w-3 h-3 bg-yellow-100 rounded-full -start-1.5 ring-8 ring-white">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                        </span>
                        <h3 className="mb-1 text-md font-semibold text-gray-900">Assigned to Volunteer</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                            {selectedPackage.assignedVolunteerEmail === user.email ? "You accepted this delivery" : "Assigned to another volunteer"}
                        </time>
                      </li>
                    )}
                    {selectedPackage.status === "delivered" && (
                      <li className="mb-6 ms-6">
                        <span className="absolute flex items-center justify-center w-3 h-3 bg-green-100 rounded-full -start-1.5 ring-8 ring-white">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        </span>
                        <h3 className="mb-1 text-md font-semibold text-gray-900">Package Delivered</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                          {selectedPackage.deliveryTime ? selectedPackage.deliveryTime.toLocaleString() : "Delivery time not recorded"}
                        </time>
                      </li>
                    )}
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 p-6">
              <button
                onClick={() => setSelectedPackage(null)}
                className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>

              {selectedPackage.status === "pending" && (
                <button
                  onClick={() => handleUpdatePackageStatus(selectedPackage, "assigned")}
                  className="px-8 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Truck className="h-5 w-5 mr-2" /> Accept Delivery
                </button>
              )}

              {selectedPackage.status === "assigned" && selectedPackage.assignedVolunteerId === user.uid && (
                <button
                  onClick={() => handleUpdatePackageStatus(selectedPackage, "delivered")}
                  className="px-8 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <CheckCircle className="h-5 w-5 mr-2" /> Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;