import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db, appId } from '../firebase/config';

// More realistic sample data
const samplePackages = [
  {
    senderId: 'recipient-test-user-1',
    senderEmail: 'sara.davis@example.com',
    pickupLocation: 'Walmart Supercenter, 123 Maple St',
    deliveryLocation: '456 Oak Ave, Apt 2B',
    size: 'medium',
    description: 'Weekly groceries, includes milk and eggs.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    senderId: 'recipient-test-user-2',
    senderEmail: 'john.miller@example.com',
    pickupLocation: 'Walmart Neighborhood Market, 789 Pine Ln',
    deliveryLocation: '101 Birch Rd',
    size: 'small',
    description: 'Prescription pickup from the pharmacy.',
    status: 'assigned',
    assignedVolunteerId: 'volunteer-test-user-1',
    assignedVolunteerEmail: 'liam.nguyen@example.com',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    senderId: 'recipient-test-user-3',
    senderEmail: 'emily.white@example.com',
    pickupLocation: 'Walmart Supercenter, 123 Maple St',
    deliveryLocation: '212 Cedar Ct',
    size: 'large',
    description: 'Small microwave oven.',
    status: 'delivered',
    assignedVolunteerId: 'volunteer-test-user-2',
    assignedVolunteerEmail: 'chloe.garcia@example.com',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    deliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

export const seedDatabase = async () => {
  console.log('Starting to seed database...');
  const publicPath = `artifacts/${appId}/public/data/packages`;
  const publicPackagesRef = collection(db, publicPath);

  // Simple check to avoid re-seeding every time.
  const existingPackages = await getDocs(publicPackagesRef);
  if (existingPackages.size > 5) {
    console.log('Database already has packages. Seeding skipped.');
    alert('Database already contains data. Seeding was skipped.');
    return;
  }

  try {
    const promises = samplePackages.map(async (pkg) => {
      // For this seeder, we'll just use the description as a pseudo-ID
      const docId = pkg.description.replace(/\s+/g, '-').toLowerCase();
      const publicDocRef = doc(db, publicPath, docId);
      await setDoc(publicDocRef, pkg);

      // Also seed the private collection for the recipient
      const privatePath = `artifacts/${appId}/users/${pkg.senderId}/packages`;
      const privateDocRef = doc(db, privatePath, docId);
      await setDoc(privateDocRef, pkg);
    });

    await Promise.all(promises);
    console.log('Database seeded successfully!');
    alert('Test data has been successfully added to your database!');
  } catch (error) {
    console.error('Error seeding database:', error);
    alert('An error occurred while seeding the database. Check the console.');
  }
};