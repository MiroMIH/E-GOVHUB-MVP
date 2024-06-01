
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const dataUser = [
  {
    "userId": "6618cc4bf5c748610f5def65",
    "email": "leticialindsay@zaggle.com",
    "password": "grape",
    "firstName": "Loraine",
    "lastName": "Landry",
    "role": "admin",
    "status": "active",
    "createdAt": "2014-08-16T09:36:13-01:00",
    "updatedAt": "2021-08-16T16:13:45-01:00"
  },
  {
    "userId": "6618cc4bf1bd66b608d2457f",
    "email": "lorainelandry@zaggle.com",
    "password": "peach",
    "firstName": "Sonia",
    "lastName": "Padilla",
    "role": "superadmin",
    "status": "suspended",
    "createdAt": "2011-02-03T18:07:52-01:00",
    "updatedAt": "2020-12-19T13:06:10-01:00"
  },
  {
    "userId": "6618cc4b90128c0b575a6e75",
    "email": "soniapadilla@zaggle.com",
    "password": "peach",
    "firstName": "Nora",
    "lastName": "Fuller",
    "role": "superadmin",
    "status": "active",
    "createdAt": "2022-02-14T09:07:22-01:00",
    "updatedAt": "2021-09-22T19:37:41-01:00"
  },
  {
    "userId": "6618cc4b54a6a2e92233682d",
    "email": "norafuller@zaggle.com",
    "password": "watermelon",
    "firstName": "Herring",
    "lastName": "Maldonado",
    "role": "citizen",
    "status": "active",
    "createdAt": "2010-03-19T17:12:44-01:00",
    "updatedAt": "2021-06-28T04:58:55-01:00"
  },
  {
    "userId": "6618cc4ba4399b809bab9cfd",
    "email": "herringmaldonado@zaggle.com",
    "password": "peach",
    "firstName": "Ruthie",
    "lastName": "Melendez",
    "role": "citizen",
    "status": "active",
    "createdAt": "2020-02-23T09:36:44-01:00",
    "updatedAt": "2023-07-12T20:03:02-01:00"
  },
  // Additional user data
  {
    "userId": "6618cc4b823b3b577fb9bdee",
    "email": "superadmin@example.com",
    "password": "superadmin",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "superadmin",
    "status": "active",
    "createdAt": "2024-05-05T09:00:00-01:00",
    "updatedAt": "2024-05-05T09:00:00-01:00"
  },
  {
    "userId": "6618cc4b509bc4d6dcb9bcdb",
    "email": "admin@example.com",
    "password": "admin",
    "firstName": "Regular",
    "lastName": "Admin",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-05-05T09:00:00-01:00",
    "updatedAt": "2024-05-05T09:00:00-01:00"
  }
];


export const dataPublication = [
  {
    "_id": new ObjectId(),
    "type": "consultation",
    "title": "Community Feedback on Proposed Hospital Expansion",
    "domain": "healthcare",
    "content": "This consultation seeks feedback from the community on the proposed expansion of the local hospital...",
    "photos": [],
    "videos": [],
    "startDate": new Date("2024-04-15"),
    "endDate": null,
    "allowAnonymousParticipation": false,
    "participationOptions": [],
    "participationResults": {},
    "createdBy": new ObjectId(),
    "wilaya": "", // Add wilaya field with appropriate value
    "commune": "", // Add commune field with appropriate value
    "createdAt": new Date(), // Corrected
    "updatedAt": new Date(), // Corrected
    "comments": [
      {
        "_id": new ObjectId(),
        "content": "Great initiative! Looking forward to seeing the improvements.",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      },
      {
        "_id": new ObjectId(),
        "content": "I have some concerns about the impact on traffic in the area. Will there be any measures to address this?",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      }
    ]
  },
  {
    "_id": new ObjectId(),
    "type": "consultation",
    "title": "sgsd",
    "content": "fgsdfsdfsdfdsfsdf",
    "domain": "healthcare",
    "startDate": new Date("2024-04-22T09:03"), // Corrected
    "endDate": new Date("2024-05-04T09:08"), // Corrected
    "wilaya": "Alger", // Add wilaya field with appropriate value
    "commune": "Bourouba", // Add commune field with appropriate value
    "participationOptions": [],
    "allowAnonymousParticipation": true,
    "photos": [],
    "createdAt": new Date(), // Corrected
    "updatedAt": new Date(), // Corrected
    "comments": []
  },
  {
    "_id": new ObjectId(),
    "title":"ssssssssss",
    "content":"ssssssss",
    "type":"poll",
    "domain":"transportation",
    "startDate": new Date(), // Add appropriate value
    "endDate": new Date("2024-04-22T10:12"), // Corrected
    "wilaya": "Djelfa", // Add wilaya field with appropriate value
    "commune": "Messaad", // Add commune field with appropriate value
    "photos":[],
    "participationOptions":["ZXzX","cvccc"],
    "allowAnonymousParticipation":true,
    "createdAt": new Date(), // Corrected
    "updatedAt": new Date(), // Corrected
    "comments": [
      {
        "_id": new ObjectId(),
        "content": "Interesting poll options!",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      }
    ]
  },
  {
    "_id": new ObjectId(),
    "title":"ETWQGAGASGAS",
    "content":"ASGASGSAGASGASGASGASGASGASG",
    "type":"poll",
    "domain":"transportation",
    "startDate": new Date(), // Add appropriate value
    "endDate": new Date("2024-04-22T10:12"), // Corrected
    "wilaya": "Djelfa", // Add wilaya field with appropriate value
    "commune": "Messaad", // Add commune field with appropriate value
    "photos":[],
    "participationOptions":["ZXzX","cvccc"],
    "allowAnonymousParticipation":true,
    "createdAt": new Date(), // Corrected
    "updatedAt": new Date(), // Corrected
    "participationResults": {
      "ZXzX": 0, // Associate each participation option with a number value
      "cvccc": 0
    },
    "comments": [
      {
        "_id": new ObjectId(),
        "content": "Interesting poll options!",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      }
    ]
  }
  
  // Add other publication objects here if needed
];


// French publication with French comments
export const frenchPublication = {
  "_id": new ObjectId(),
  "type": "consultation",
  "title": "Consultation sur l'expansion proposée de l'hôpital local",
  "content": "Cette consultation vise à recueillir les commentaires de la communauté sur l'expansion proposée de l'hôpital local...",
  "domain": "healthcare",
  "photos": [],
  "videos": [],
  "startDate": new Date("2024-04-15"),
  "endDate": null,
  "allowAnonymousParticipation": false,
  "participationOptions": [],
  "participationResults": {},
  "createdBy": new ObjectId(),
  "wilaya": "Alger", 
  "commune": "Alger", 
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "comments": [
    {
      "_id": new ObjectId(),
      "content": "Grande initiative! J'attends avec impatience de voir les améliorations.",
      "createdBy": new ObjectId(),
      "createdAt": new Date()
    },
    {
      "_id": new ObjectId(),
      "content": "J'ai quelques préoccupations concernant l'impact sur la circulation dans la région. Y aura-t-il des mesures pour y remédier?",
      "createdBy": new ObjectId(),
      "createdAt": new Date()
    }
  ]
};

// Arabic publication with Arabic comments
export const arabicPublication = {
  "_id": new ObjectId(),
  "type": "consultation",
  "title": "استطلاع رأي المجتمع حول توسيع المستشفى المحلي المقترح",
  "content": "يهدف هذا الاستطلاع إلى جمع آراء المجتمع حول التوسع المقترح للمستشفى المحلي...",
  "domain": "healthcare",
  "photos": [],
  "videos": [],
  "startDate": new Date("2024-04-15"),
  "endDate": null,
  "allowAnonymousParticipation": false,
  "participationOptions": [],
  "participationResults": {},
  "createdBy": new ObjectId(),
  "wilaya": "Algiers", 
  "commune": "Algiers", 
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "comments": [
    {
      "_id": new ObjectId(),
      "content": "مبادرة عظيمة! أتطلع بشوق إلى رؤية التحسينات.",
      "createdBy": new ObjectId(),
      "createdAt": new Date()
    },
    {
      "_id": new ObjectId(),
      "content": "لدي بعض الاهتمامات بشأن التأثير على حركة المرور في المنطقة. هل ستتخذ أي إجراءات للتعامل مع هذا؟",
      "createdBy": new ObjectId(),
      "createdAt": new Date()
    }
  ]
};

// Algerian dialect publication with Algerian dialect comments
export const algerianPublication = {
  "_id": new ObjectId(),
  "type": "consultation",
  "title": "استشارة حول التوسيع المقترح للمستشفى المحلي",
  "content": "هذه الاستشارة تسعى إلى جمع آراء المجتمع حول التوسيع المقترح للمستشفى المحلي...",
  "domain": "healthcare",
  "photos": [],
  "videos": [],
  "startDate": new Date("2024-04-15"),
  "endDate": null,
  "allowAnonymousParticipation": false,
  "participationOptions": [],
  "participationResults": {},
  "createdBy": new ObjectId(),
  "wilaya": "Algiers", 
  "commune": "Algiers", 
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "comments": [
    {
      "_id": new ObjectId(),
      "content": "مبادرة زوينة! نتوقعوا بشوق البهجة.",
      "createdBy": new ObjectId(),
      "createdAt": new Date()
    },
    {
      "_id": new ObjectId(),
      "content": "عندي بعض الشكونات بخصوص الأثر فوق حركة السير في المنطقة. ماشي بزاف حاجة للتعويض؟",
      "createdBy": new ObjectId(),
      "createdAt": new Date()
    }
  ]
};

// Previous publications
export const governmentProjects = [
  {
    "_id": new ObjectId(),
    "type": "consultation",
    "title": "Projet d'embellissement des espaces verts",
    "content": "Le gouvernement lance un projet d'embellissement des espaces verts dans les quartiers résidentiels pour améliorer le cadre de vie des citoyens.",
    "domain": "healthcare",
    "photos": [],
    "videos": [],
    "startDate": new Date("2024-06-01"),
    "endDate": null,
    "allowAnonymousParticipation": false,
    "participationOptions": [],
    "participationResults": {},
    "createdBy": new ObjectId(),
    "wilaya": "Alger", 
    "commune": "Alger", 
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "comments": [
      {
        "_id": new ObjectId(),
        "content": "Saha w raha, had el khedma mte3refha, choufou kifech t3ayatou w nchallah nchoufou besslama.",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      },
      {
        "_id": new ObjectId(),
        "content": "Bravo l'équipe! Ne9sou w nedrou lina, rou7na 3andkoum.",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      },
      {
        "_id": new ObjectId(),
        "content": "Yehdikoum rabi, twassa7 3la 7yatakoum, win rahoum el m7ale.",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      }
    ]
  },
  {
    "_id": new ObjectId(),
    "type": "consultation",
    "title": "Projet de rénovation des écoles publiques",
    "content": "Le gouvernement annonce un projet de rénovation des écoles publiques pour offrir un meilleur environnement d'apprentissage aux élèves.",
    "domain": "healthcare",
    "photos": ['daoud-abismail-E72PVn1qi30-unsplash.jpg'],
    "videos": [],
    "startDate": new Date("2024-07-01"),
    "endDate": null,
    "allowAnonymousParticipation": false,
    "participationOptions": [],
    "participationResults": {},
    "createdBy": new ObjectId(),
    "wilaya": "Alger", 
    "commune": "Alger", 
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "comments": [
      {
        "_id": new ObjectId(),
        "content": "Bravo, c'est une initiative louable, el m3alem choufou fikoum.",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      },
      {
        "_id": new ObjectId(),
        "content": "3andi l'honneur nekhdem m3a des enfants kbirin, ma3lich, nsawlikom hal kherb.",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      },
      {
        "_id": new ObjectId(),
        "content": "Yatik el saha, mchitiw 3la el m7al, nchallah yetfarkou fi chahwatkom.",
        "createdBy": new ObjectId(),
        "createdAt": new Date()
      }
    ]
  }
];



export const RegistrationData = [
  {
    "_id": new ObjectId(),
    "email": "user1@example.com",
    "password": "password1",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": new Date("2024-07-01"),
    "nationalIDNumber": "1234567890",
    "address": "123 Main St, Anytown, USA",
    "phoneNumber": "123-456-7890",
    "occupation": "Software Engineer",
    "employerName": "Tech Company Inc.",
    "workAddress": "456 Tech Blvd, Techland, USA",
    "educationLevel": "Bachelor's Degree",
    "institutionAttended": "University of Tech",
    "degreeEarned": "Computer Science",
    "languagePreferences": ["English", "Spanish"],
    "accessibilityNeeds": "None",
    "photos": ["path/to/photo1.jpg", "path/to/photo2.jpg"]
  },
  {
    "_id": new ObjectId(),
    "email": "user2@example.com",
    "password": "password2",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": new Date("2024-07-01"),
    "nationalIDNumber": "0987654321",
    "address": "456 Oak St, Othertown, USA",
    "phoneNumber": "987-654-3210",
    "occupation": "Teacher",
    "employerName": "ABC School",
    "workAddress": "789 School Ave, Othertown, USA",
    "educationLevel": "Master's Degree",
    "institutionAttended": "University of Education",
    "degreeEarned": "Education",
    "languagePreferences": ["English", "French"],
    "accessibilityNeeds": "Wheelchair access",
    "photos": ["path/to/photo3.jpg", "path/to/photo4.jpg"]
  },
  
];



