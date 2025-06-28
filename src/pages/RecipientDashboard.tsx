import React, { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../hooks/Auth";
import { type Package } from "../types";
import { firestoreService } from "../services/firestoreService";
import Input from "../components/Input";
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
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  Timestamp // Import Timestamp to correctly check its type
} from "firebase/firestore";
import { db } from "../firebase/config";

const RecipientDashboard: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [size, setSize] = useState<Package["size"]>("Small");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            return {
              ...data,
              id: doc.id,
              // Convert Firestore Timestamp to JavaScript Date object if it's an instance of Timestamp
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
              // If deliveryTime exists and is a Timestamp, convert it too
              deliveryTime: data.deliveryTime instanceof Timestamp ? data.deliveryTime.toDate() : data.deliveryTime,
            } as Package;
          });
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
    setIsSubmitting(true);
    
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
    } finally {
      setIsSubmitting(false);
    }
  };

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
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-gradient-to-r from-amber-500 to-orange-500",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        label: "Pending",
        description: "Waiting for volunteer"
      },
      assigned: {
        icon: Truck,
        color: "bg-gradient-to-r from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        label: "In Transit",
        description: "On the way to you"
      },
      delivered: {
        icon: CheckCircle2,
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        label: "Delivered",
        description: "Successfully delivered"
      },
      cancelled: {
        icon: FileText,
        color: "bg-gradient-to-r from-red-500 to-rose-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        label: "Cancelled",
        description: "Request cancelled"
      },
      inTransit: {
        icon: Truck,
        color: "bg-gradient-to-r from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        label: "In Transit",
        description: "On the way to you"
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getSizeLabel = (size: string) => {
    const labels = {
      small: { label: "Small", description: "Up to 5 lbs" },
      medium: { label: "Medium", description: "5-15 lbs" },
      large: { label: "Large", description: "15+ lbs" }
    };
    return labels[size as keyof typeof labels] || labels.small;
  };

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
                    placeholder="Describe what needs to be delivered..."
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
                  <div className={`p-4 rounded-xl ${message.includes('successfully') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <p className="text-sm font-medium">{message}</p>
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
                  {packages.length} {packages.length === 1 ? 'request' : 'requests'}
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
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
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
                            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${statusConfig.bgColor}`}>
                              <div className={`w-2 h-2 rounded-full ${statusConfig.color}`}></div>
                              <statusConfig.icon className={statusConfig.textColor} size={16} />
                              <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{statusConfig.description}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar size={14} />
                            {/* FIX: Ensure pkg.createdAt is treated as a Date object */}
                            <span>{(pkg.createdAt as Timestamp).toDate().toLocaleDateString()}</span>
                            <span>•</span>
                            {/* FIX: Ensure pkg.createdAt is treated as a Date object */}
                            <span>{(pkg.createdAt as Timestamp).toDate().toLocaleTimeString()}</span>
                          </div>
                          {pkg.assignedVolunteerEmail && (
                            <div className="flex items-center space-x-2 text-xs">
                              <User size={14} className="text-blue-500" />
                              <span className="text-blue-600 font-medium">{pkg.assignedVolunteerEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;