"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDeliveryCompleted = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
// Initialize the Admin SDK once
(0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
// The v2 syntax uses onDocumentUpdated directly
// It's region-specific, you can change 'us-central1' if needed
exports.onDeliveryCompleted = (0, firestore_1.onDocumentUpdated)("artifacts/{appId}/public/data/packages/{packageId}", async (event) => {
    // Start logging using the v2 logger
    logger.info("Function triggered by update to package:", event.params.packageId);
    // The event.data object contains before and after states
    if (!event.data) {
        logger.info("No data associated with the event, exiting.");
        return;
    }
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    // Check if the status changed from something else to 'delivered'
    if (beforeData.status !== "delivered" && afterData.status === "delivered") {
        const volunteerId = afterData.assignedVolunteerId;
        const packageValue = 10; // Award 10 credits per delivery
        if (!volunteerId) {
            logger.info("Delivery completed but no volunteer was assigned.");
            return;
        }
        logger.info(`Rewarding volunteer ${volunteerId} with ${packageValue} credits.`);
        // Get the volunteer's profile reference using the event parameters
        const volunteerProfileRef = db.doc(`artifacts/${event.params.appId}/users/${volunteerId}/userProfile/profile`);
        try {
            // Use a built-in increment operation for safety
            await volunteerProfileRef.update({
                credits: firestore_2.FieldValue.increment(packageValue),
                deliveriesCompleted: firestore_2.FieldValue.increment(1),
            });
            logger.info(`Successfully updated profile for volunteer ${volunteerId}`);
        }
        catch (error) {
            logger.error("Failed to update volunteer profile:", error);
        }
    }
    else {
        logger.info("Status did not change to 'delivered'. No action taken.");
    }
});
//# sourceMappingURL=index.js.map