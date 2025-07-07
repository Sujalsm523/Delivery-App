import React, { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../hooks/Auth";
import { type Package } from "../types"; // Ensure your types.ts is updated
import { firestoreService } from "../services/firestoreService";
import Input from "../components/Input"; // Assuming this is a custom Input component
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
  Calendar,
  User,
  ArrowRight,
  Clock,
  Package2,
  AlertCircle,
  XCircle,
  Info,
  Phone,          // New Icon
  MessageSquare,  // New Icon
  RefreshCcw,     // New Icon for Re-request
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

// --- Utility Functions (could be in a separate file) ---
const formatDate = (date: Date | Timestamp | undefined): string => {
  if (!date) return "N/A";
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date: Date | Timestamp | undefined): string => {
  if (!date) return "N/A";
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// --- RecipientDashboard Component ---
const RecipientDashboard: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [size, setSize] = useState<Package["size"]>("Small"); // Default to 'small'
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [selectedPackageForDetails, setSelectedPackageForDetails] = useState<Package | null>(null);

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
          const fetchedPackages = snapshot.docs.map((doc) => {
            const data = doc.data();
            // Helper to convert FirestoreTimestamp-like objects to Date
            const toDateSafe = (val: any) => {
              if (val instanceof Timestamp) return val.toDate();
              if (val && typeof val.toDate === "function") return val.toDate();
              return val;
            };
            return {
              ...data,
              id: doc.id,
              createdAt: toDateSafe(data.createdAt),
              assignedAt: toDateSafe(data.assignedAt),
              inTransitAt: toDateSafe(data.inTransitAt),
              deliveryTime: toDateSafe(data.deliveryTime),
            } as Package;
          });
          setPackages(fetchedPackages);
          setFetchLoading(false);
        },
        (error) => {
          console.error("Error listening to recipient packages:", error);
          setMessage({
            type: "error",
            text: "Failed to load packages. Please try again.",
          });
          setFetchLoading(false);
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, userProfile]);

// RecipientDashboard.tsx

// Inside your handleCreatePackage function:
const handleCreatePackage = async (event: FormEvent) => {
  event.preventDefault();
  if (!user || !userProfile) {
    setMessage({ type: "error", text: "You must be logged in to create a package." });
    return;
  }
  setIsSubmitting(true);
  setMessage(null);

  try {
    const newPackageData = {
      senderId: user.uid,
      senderEmail: user.email,
      recipientId: user.uid, // <--- ADD THIS LINE
      pickupLocation,
      deliveryLocation,
      size,
      description,
      status: "pending" as const,
      createdAt: Timestamp.now(),
    };

    // Add to public collection
    const publicPath = firestoreService.getCollectionPath("packages");
    const publicDocRef = await addDoc(
      collection(db, publicPath),
      newPackageData
    );

    // Add to sender's private collection (which is the recipient in this case)
    const privatePath = firestoreService.getCollectionPath(
      "packages",
      user.uid // This user.uid is the sender's UID (the recipient who created it)
    );
    await setDoc(doc(db, privatePath, publicDocRef.id), newPackageData);

    setMessage({ type: "success", text: "Package request created successfully!" });
    // ... reset form fields and other logic
  } catch (error: any) {
    console.error("Error creating package:", error);
    setMessage({ type: "error", text: "Failed to create package: " + error.message });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCancelPackage = async (packageId: string) => {
    if (!user) {
      setMessage({ type: "error", text: "Authentication required to cancel." });
      return;
    }

    setMessage(null);
    setShowCancelConfirm(null);

    try {
      const publicPath = firestoreService.getCollectionPath("packages");
      await updateDoc(doc(db, publicPath, packageId), {
        status: "cancelled",
        cancelledAt: Timestamp.now(),
      });

      const privatePath = firestoreService.getCollectionPath(
        "packages",
        user.uid
      );
      await updateDoc(doc(db, privatePath, packageId), {
        status: "cancelled",
        cancelledAt: Timestamp.now(),
      });

      setMessage({ type: "success", text: "Package request cancelled." });
    } catch (error: any) {
      console.error("Error cancelling package:", error);
      setMessage({
        type: "error",
        text: "Failed to cancel package: " + error.message,
      });
    }
  };

  // New: Function to handle re-requesting a package
  const handleReRequestPackage = (pkg: Package) => {
    // Close the details modal first
    setSelectedPackageForDetails(null);

    // Populate the form fields with data from the package
    setPickupLocation(pkg.pickupLocation);
    setDeliveryLocation(pkg.deliveryLocation);
    setSize(pkg.size);
    setDescription(pkg.description);

    setMessage({
      type: "info",
      text: "Form pre-filled with details from your past request. Review and submit!",
    });

    // Optionally scroll to the top of the form for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-gradient-to-r from-amber-500 to-orange-500",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        label: "Pending",
        description: "Waiting for a volunteer to accept",
      },
      assigned: {
        icon: Truck,
        color: "bg-gradient-to-r from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        label: "Assigned",
        description: "A volunteer has accepted your request",
      },
      inTransit: {
        icon: Truck,
        color: "bg-gradient-to-r from-teal-500 to-cyan-500",
        bgColor: "bg-teal-50",
        textColor: "text-teal-700",
        label: "In Transit",
        description: "Your package is currently being delivered",
      },
      delivered: {
        icon: CheckCircle2,
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        label: "Delivered",
        description: "Successfully delivered to your address",
      },
      cancelled: {
        icon: XCircle,
        color: "bg-gradient-to-r from-red-500 to-rose-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        label: "Cancelled",
        description: "Delivery request cancelled",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getSizeLabel = (size: string) => {
    const labels = {
      small: { label: "Small", description: "Up to 5 lbs" },
      medium: { label: "Medium", description: "5-15 lbs" },
      large: { label: "Large", description: "15+ lbs" },
    };
    return labels[size.toLowerCase() as keyof typeof labels] || labels.small;
  };

  // --- Loading and Access Denied States ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center space-x-3">
            <LoaderCircle className="animate-spin text-blue-600" size={24} />
            <p className="text-gray-700 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || userProfile?.role !== "recipient") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageIcon className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h3>
          <p className="text-gray-600">This dashboard is exclusively for recipients.</p>
          <p className="text-gray-500 text-sm mt-2">Please log in with a recipient account to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Package2 className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Delivery Dashboard
              </h1>
              <p className="text-gray-600">Welcome back! Manage your delivery requests</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <PackagePlus className="text-white" size={16} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Request Delivery</h2>
              </div>

              <form onSubmit={handleCreatePackage} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="mr-2 text-gray-400" size={16} />
                    Pickup Location
                  </label>
                  <Input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                    placeholder="e.g., Walmart Supercenter, 123 Main St"
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="mr-2 text-gray-400" size={16} />
                    Delivery Address
                  </label>
                  <Input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    required
                    placeholder="Your complete address"
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Package2 className="mr-2 text-gray-400" size={16} />
                    Package Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as Package["size"])}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50"
                  >
                    <option value="small">Small (Up to 5 lbs)</option>
                    <option value="medium">Medium (5-15 lbs)</option>
                    <option value="large">Large (15+ lbs)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FileText className="mr-2 text-gray-400" size={16} />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 resize-none"
                    placeholder="Describe what needs to be delivered (e.g., Groceries, Medication, Documents)..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="animate-spin" size={20} />
                      <span>Creating Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Delivery</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {message && (
                  <div
                    className={`p-4 rounded-xl flex items-center space-x-3 ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : message.type === "info"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 size={20} className="flex-shrink-0" />
                    ) : message.type === "info" ? (
                      <Info size={20} className="flex-shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{message.text}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Package List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <History className="text-white" size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Delivery History</h2>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {packages.length} {packages.length === 1 ? "request" : "requests"}
                </div>
              </div>

              {fetchLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                    <LoaderCircle className="animate-spin text-white" size={24} />
                  </div>
                  <p className="text-gray-600 font-medium">Loading your packages...</p>
                  <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
                </div>
              ) : packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                    <Inbox className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Packages Yet</h3>
                  <p className="text-gray-500 mb-4">Create your first delivery request to get started</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <ArrowRight className="mr-2" size={16} />
                    Use the form on the left to request a delivery
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => {
                    const statusConfig = getStatusConfig(pkg.status);
                    const sizeInfo = getSizeLabel(pkg.size);

                    return (
                      <div
                        key={pkg.id}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/40 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                #{pkg.id.slice(-8)}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                              >
                                {sizeInfo.label}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-start space-x-2">
                                <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                                <div>
                                  <p className="font-medium text-gray-800">{pkg.pickupLocation}</p>
                                  <p className="text-sm text-gray-500">→ {pkg.deliveryLocation}</p>
                                </div>
                              </div>
                              {pkg.description && (
                                <div className="flex items-start space-x-2">
                                  <FileText className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                                  <p className="text-sm text-gray-600">{pkg.description}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <div
                              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${statusConfig.bgColor}`}
                            >
                              <div className={`w-2 h-2 rounded-full ${statusConfig.color}`}></div>
                              <statusConfig.icon className={statusConfig.textColor} size={16} />
                              <span
                                className={`text-sm font-medium ${statusConfig.textColor}`}
                              >
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{statusConfig.description}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar size={14} />
                            <span>{formatDate(pkg.createdAt)}</span>
                            <span>•</span>
                            <Clock size={14} />
                            <span>{formatTime(pkg.createdAt)}</span>
                          </div>
                          {pkg.assignedVolunteerEmail && (
                            <div className="flex items-center space-x-2 text-xs">
                              <User size={14} className="text-blue-500" />
                              <span className="text-blue-600 font-medium">
                                {pkg.assignedVolunteerName || pkg.assignedVolunteerEmail}
                                {pkg.assignedVolunteerPhone && ` (${pkg.assignedVolunteerPhone})`}
                              </span>
                            </div>
                          )}
                          {pkg.status === "pending" && (
                            <button
                              onClick={() => setShowCancelConfirm(pkg.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                            >
                              <XCircle size={14} />
                              <span>Cancel Request</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedPackageForDetails(pkg)}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center space-x-1 ml-4"
                          >
                            <Info size={14} />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center">
              <XCircle className="text-red-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Cancellation</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this delivery request? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Keep Request
                </button>
                <button
                  onClick={() => handleCancelPackage(showCancelConfirm)}
                  className="px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Package Details Modal */}
        {selectedPackageForDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-xl w-full relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedPackageForDetails(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                  <PackageIcon className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Package Details</h3>
                  <p className="text-gray-500 text-sm">#{selectedPackageForDetails.id.slice(-8)}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusConfig(selectedPackageForDetails.status).bgColor
                    } ${getStatusConfig(selectedPackageForDetails.status).textColor}`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusConfig(selectedPackageForDetails.status).color}`}></div>
                    {getStatusConfig(selectedPackageForDetails.status).label}
                  </span>
                </div>
              </div>

              {/* Delivery Progress Timeline */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center text-lg">
                  <Clock className="mr-2" size={20} /> Delivery Progress
                </h4>
                <div className="relative pl-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[10.5px] top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  {/* Step: Request Created */}
                  <div className="relative mb-6">
                    <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <p className="ml-6 font-medium text-gray-800">Request Created</p>
                    <p className="ml-6 text-sm text-gray-500">
                      {formatDate(selectedPackageForDetails.createdAt)} at{" "}
                      {formatTime(selectedPackageForDetails.createdAt)}
                    </p>
                  </div>

                  {/* Step: Volunteer Assigned */}
                  <div className="relative mb-6">
                    <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedPackageForDetails.assignedAt ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {selectedPackageForDetails.assignedAt ? <CheckCircle2 size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <p className="ml-6 font-medium text-gray-800">Volunteer Assigned</p>
                    <p className="ml-6 text-sm text-gray-500">
                      {selectedPackageForDetails.assignedAt ? (
                        <>
                            {selectedPackageForDetails.assignedVolunteerName || selectedPackageForDetails.assignedVolunteerEmail} on {" "}
                            {formatDate(selectedPackageForDetails.assignedAt)} at {formatTime(selectedPackageForDetails.assignedAt)}
                        </>
                      ) : (
                        "Waiting for a volunteer"
                      )}
                    </p>
                  </div>

                  {/* Step: In Transit */}
                  <div className="relative mb-6">
                    <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedPackageForDetails.inTransitAt ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {selectedPackageForDetails.inTransitAt ? <CheckCircle2 size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <p className="ml-6 font-medium text-gray-800">In Transit</p>
                    <p className="ml-6 text-sm text-gray-500">
                      {selectedPackageForDetails.inTransitAt ? (
                        `Started at ${formatDate(selectedPackageForDetails.inTransitAt)} at ${formatTime(selectedPackageForDetails.inTransitAt)}`
                      ) : (
                        selectedPackageForDetails.status === "assigned" ? "Volunteer is on the way" : "Not yet in transit"
                      )}
                    </p>
                  </div>

                  {/* Step: Delivered */}
                  <div className="relative">
                    <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedPackageForDetails.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {selectedPackageForDetails.status === 'delivered' ? <CheckCircle2 size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <p className="ml-6 font-medium text-gray-800">Delivered</p>
                    <p className="ml-6 text-sm text-gray-500">
                      {selectedPackageForDetails.status === 'delivered' ? (
                        `${formatDate(selectedPackageForDetails.deliveryTime)} at ${formatTime(selectedPackageForDetails.deliveryTime)}`
                      ) : (
                        "Awaiting delivery confirmation"
                      )}
                    </p>
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
                {/* Package Information Column */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center text-lg">
                    <PackageIcon className="mr-2" size={18} /> Package Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <span className="font-semibold text-gray-600 block">Pickup Location:</span>
                        <span>{selectedPackageForDetails.pickupLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <span className="font-semibold text-gray-600 block">Delivery Address:</span>
                        <span>{selectedPackageForDetails.deliveryLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Package2 className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <span className="font-semibold text-gray-600 block">Package Size:</span>
                        <span>
                          {getSizeLabel(selectedPackageForDetails.size).label} (
                          {getSizeLabel(selectedPackageForDetails.size).description})
                        </span>
                      </div>
                    </div>
                    {selectedPackageForDetails.description && (
                      <div className="flex items-start">
                        <FileText className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <span className="font-semibold text-gray-600 block">Description:</span>
                          <p className="break-words">{selectedPackageForDetails.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Details Column */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center text-lg">
                    <Calendar className="mr-2" size={18} /> Delivery Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <span className="font-semibold text-gray-600 block">Request Created:</span>
                        <span>
                          {formatDate(selectedPackageForDetails.createdAt)} at{" "}
                          {formatTime(selectedPackageForDetails.createdAt)}
                        </span>
                      </div>
                    </div>
                    {selectedPackageForDetails.assignedVolunteerEmail && (
                      <div className="flex items-start">
                        <User className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <span className="font-semibold text-gray-600 block">Assigned Volunteer:</span>
                          <p className="text-blue-600 font-medium">
                            {selectedPackageForDetails.assignedVolunteerName ||
                              selectedPackageForDetails.assignedVolunteerEmail}
                          </p>
                          {(selectedPackageForDetails.assignedVolunteerPhone || selectedPackageForDetails.assignedVolunteerEmail) && (
                            <div className="flex space-x-3 mt-2">
                                {selectedPackageForDetails.assignedVolunteerPhone && (
                                    <a
                                        href={`tel:${selectedPackageForDetails.assignedVolunteerPhone}`}
                                        className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
                                    >
                                        <Phone size={14} />
                                        <span>Call</span>
                                    </a>
                                )}
                                {selectedPackageForDetails.assignedVolunteerEmail && (
                                    <a
                                        href={`mailto:${selectedPackageForDetails.assignedVolunteerEmail}`}
                                        className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
                                    >
                                        <MessageSquare size={14} />
                                        <span>Email</span>
                                    </a>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* New: Delivery Notes Section */}
              {(selectedPackageForDetails.notesFromRecipient || selectedPackageForDetails.notesFromVolunteer) && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center text-lg">
                          <FileText className="mr-2" size={18} /> Delivery Notes
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                          {selectedPackageForDetails.notesFromRecipient && (
                              <p><span className="font-medium">Your Notes:</span> {selectedPackageForDetails.notesFromRecipient}</p>
                          )}
                          {selectedPackageForDetails.notesFromVolunteer && (
                              <p><span className="font-medium">Volunteer Notes:</span> {selectedPackageForDetails.notesFromVolunteer}</p>
                          )}
                      </div>
                  </div>
              )}

              {/* New: Proof of Delivery Section */}
              {selectedPackageForDetails.status === "delivered" && selectedPackageForDetails.proofOfDeliveryUrl && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center text-lg">
                          <CheckCircle2 className="mr-2" size={18} /> Proof of Delivery
                      </h4>
                      <a
                          href={selectedPackageForDetails.proofOfDeliveryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                          <Info size={16} />
                          <span>View Delivery Photo</span>
                      </a>
                  </div>
              )}

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                {/* New: Re-request button */}
                {(selectedPackageForDetails.status === "delivered" || selectedPackageForDetails.status === "cancelled") && (
                    <button
                        onClick={() => handleReRequestPackage(selectedPackageForDetails)}
                        className="px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors shadow-lg flex items-center space-x-2 text-sm"
                    >
                        <RefreshCcw size={16} />
                        <span>Re-request This Package</span>
                    </button>
                )}

                <button
                  onClick={() => setSelectedPackageForDetails(null)}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientDashboard;