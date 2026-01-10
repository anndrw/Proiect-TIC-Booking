const admin = require('firebase-admin');
const { faker } = require('@faker-js/faker');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const populare = async () => {
  console.log('Populare..');

  try {
    /* const snapshot = await db.collection('properties').get();
    snapshot.forEach((doc) => {
      doc.ref.delete();
    });
    console.log('Date vechi sterse.');
    */

    for (let i = 0; i < 10; i++) {
      const reviews = [];
      const nrReviews = faker.number.int({ min: 1, max: 5 });
      
      for (let j = 0; j < nrReviews; j++) {
        reviews.push({
          user: faker.person.fullName(),
          comment: faker.lorem.sentence(),
          rating: faker.number.int({ min: 3, max: 5 }),
          date: faker.date.past().toISOString()
        });
      }

      const tipFacilitati = ['WiFi', 'Parcare', 'AC', 'Piscina', 'Mic Dejun', 'All Inclusive', 'Pet Friendly', 'Gratar', 'Fitness', 'Foisor'];
      const facilities = faker.helpers.arrayElements(tipFacilitati, { min: 2, max: 5 });

      const propertyData = {
        name: faker.company.name() + ' Hotel',
        description: faker.lorem.paragraph(),
        pricePerNight: parseFloat(faker.commerce.price({ min: 100, max: 800 })),
        currency: 'RON',
        location: {
          city: faker.location.city(),
          address: faker.location.streetAddress(),
          country: 'Romania' 
        },
        imageUrl: `https://picsum.photos/400/300?random=${i}`, 
        facilities: facilities,
        rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
        reviews: reviews, 
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('properties').add(propertyData);
      console.log(`Proprietate adaugata: ${propertyData.name}`);
    }

    console.log('Verifica Firebase. Done.');
    process.exit(0);

  } catch (error) {
    console.error('Eroare populare:', error);
    process.exit(1);
  }
};

populare();