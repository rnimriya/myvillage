import { mockData } from './mockData';

const DB_KEYS = {
  PROVIDERS: 'my_village_providers_v5',
  CURRENT_SESSION: 'my_village_session_v5',
  ANNOUNCEMENTS: 'my_village_announcements_v5',
  NEWS: 'my_village_news_v5',
  SCHEMES: 'my_village_schemes_v5',
  LEADERS: 'my_village_leaders_v6',
  SCHOOLS: 'my_village_schools_v5',
  ADMIN_SESSION: 'my_village_admin_session_v5',
  JOBS: 'my_village_jobs_v5'
};

// Seeding Default Providers
const defaultProviders = [
  ...mockData.services.map((item, index) => ({
    ...item,
    password: 'password123',
    status: 'approved',
    reviews: [
      {
        id: `rev-init-${index}-1`,
        author: index % 2 === 0 ? "Ramesh Yadav" : "Anil Sharma",
        rating: 5,
        comment: {
          en: "Great service, prompt and very polite behavior.",
          hi: "शानदार सेवा, बहुत ही समय पर और विनम्र व्यवहार।"
        },
        date: { en: "1 day ago", hi: "1 दिन पहले" }
      },
      {
        id: `rev-init-${index}-2`,
        author: index % 2 === 0 ? "Deepak Sen" : "Kiran Verma",
        rating: 4,
        comment: {
          en: "Satisfactory work. Charging reasonable rates.",
          hi: "संतोषजनक काम। उचित दाम लिया गया।"
        },
        date: { en: "3 days ago", hi: "3 दिन पहले" }
      }
    ],
    image: item.category === 'doctors'
      ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'
      : item.category === 'electricians'
      ? 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300'
      : item.category === 'plumbers'
      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
      : item.category === 'mechanics'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300'
  })),
  // Sample approved listings for new categories
  {
    id: 'internet-1',
    category: 'internet',
    name: { en: "Rajesh Saini (Village Net)", hi: "राजेश सैनी (विलेज नेट)" },
    rating: 4.7,
    phone: "+919876543297",
    experience: { en: "5 years exp", hi: "5 साल का अनुभव" },
    availability: { en: "Wi-Fi setup & repairs, 9 AM - 6 PM", hi: "वाई-फाई सेटअप और मरम्मत, सुबह 9 - शाम 6" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'
  },
  {
    id: 'parlor-1',
    category: 'parlor',
    name: { en: "Pooja Sharma (Beauty Zone)", hi: "पूजा शर्मा (ब्यूटी ज़ोन)" },
    rating: 4.8,
    phone: "+919876543296",
    experience: { en: "8 years exp", hi: "8 साल का अनुभव" },
    availability: { en: "Home bridal makeup & salon service", hi: "होम ब्राइडल मेकअप और सैलून सेवा" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300'
  },
  {
    id: 'photo-1',
    category: 'photographer',
    name: { en: "Vijay Studio (Weddings & Events)", hi: "विजय स्टूडियो (शादी और इवेंट)" },
    rating: 4.9,
    phone: "+919876543295",
    experience: { en: "10 years exp", hi: "10 साल का अनुभव" },
    availability: { en: "Available for functions & outdoor shoots", hi: "कार्यों और आउटडोर शूट के लिए उपलब्ध" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
  },
  {
    id: 'csc-1',
    category: 'csc',
    name: { en: "Ramesh Sen (CSC DigiPay)", hi: "रमेश सेन (सीएससी डिजीपे)" },
    rating: 4.6,
    phone: "+919876543294",
    experience: { en: "6 years exp", hi: "6 साल का अनुभव" },
    availability: { en: "Aadhaar, PAN & government scheme applications", hi: "आधार, पैन और सरकारी योजना आवेदन" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
  },
  {
    id: 'tuition-1',
    category: 'tuition',
    name: { en: "Mrs. Sneha Vyas (Maths & Science Tutor)", hi: "श्रीमती स्नेहा व्यास (गणित और विज्ञान ट्यूटर)" },
    rating: 4.9,
    phone: "+919876543293",
    experience: { en: "12 years exp", hi: "12 साल का अनुभव" },
    availability: { en: "Class 5th to 10th coaching, 4 PM - 7 PM", hi: "कक्षा 5वीं से 10वीं कोचिंग, शाम 4 - 7" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
  },
  {
    id: 'blacksmith-1',
    category: 'blacksmith',
    name: { en: "Kishan Lohar (Iron Works)", hi: "किशन लोहार (आयरन वर्क्स)" },
    rating: 4.5,
    phone: "+919876543292",
    experience: { en: "15 years exp", hi: "15 साल का अनुभव" },
    availability: { en: "Sickle, plough & agricultural tools repairs", hi: "हँसिया, हल और कृषि औजारों की मरम्मत" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300'
  },
  {
    id: 'goldsmith-1',
    category: 'goldsmith',
    name: { en: "Verma Jewellers (Devendra Verma)", hi: "वर्मा ज्वेलर्स (देवेन्द्र वर्मा)" },
    rating: 4.8,
    phone: "+919876543291",
    experience: { en: "20 years exp", hi: "20 साल का अनुभव" },
    availability: { en: "Traditional gold & silver ornaments designs", hi: "पारंपरिक सोने और चांदी के आभूषण डिजाइन" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
  },
  {
    id: 'sports-1',
    category: 'sports',
    name: { en: "Coach Sandeep Yadav (Kabaddi & Athletic)", hi: "कोच संदीप यादव (कबड्डी और एथलेटिक)" },
    rating: 4.7,
    phone: "+919876543290",
    experience: { en: "7 years exp", hi: "7 साल का अनुभव" },
    availability: { en: "Village sports club ground training, 6 AM", hi: "ग्राम स्पोर्ट्स क्लब मैदान प्रशिक्षण, सुबह 6 बजे" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=300'
  },
  {
    id: 'carpenter-1',
    category: 'carpenter',
    name: { en: "Madan Lal (Panchayat Carpenter)", hi: "मदन लाल (पंचायत बढ़ई)" },
    rating: 4.8,
    phone: "+919876543289",
    experience: { en: "15 years exp", hi: "15 साल का अनुभव" },
    availability: { en: "Door repairs, customized furniture, 9 AM - 6 PM", hi: "दरवाजे की मरम्मत, कस्टमाइज्ड फर्नीचर, सुबह 9 - शाम 6" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
  },
  {
    id: 'painter-1',
    category: 'painter',
    name: { en: "Satish Kumar (House Painter)", hi: "सतीश कुमार (हाउस पेंटर)" },
    rating: 4.7,
    phone: "+919876543288",
    experience: { en: "6 years exp", hi: "6 साल का अनुभव" },
    availability: { en: "Wall painting, distemper & polish, 8 AM - 6 PM", hi: "दीवार पेंटिंग, डिस्टेंपर और पॉलिश, सुबह 8 - शाम 6" },
    password: 'password123',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300'
  },
  // Seed two PENDING entries for testing the Sarpanch approval queue immediately
  {
    id: 'pending-1',
    category: 'plumbers',
    name: { en: "Vikram Singh (Water Expert)", hi: "विक्रम सिंह (जल विशेषज्ञ)" },
    rating: 4.2,
    phone: "+919876543299",
    experience: { en: "4 years exp", hi: "4 साल का अनुभव" },
    availability: { en: "Available 24/7 for tube wells", hi: "ट्यूबवेल के लिए 24 घंटे उपलब्ध" },
    password: 'password123',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300'
  },
  {
    id: 'pending-2',
    category: 'electricians',
    name: { en: "Deepak Patel (Solar Installer)", hi: "दीपक पटेल (सोलर इंस्टॉलर)" },
    rating: 4.6,
    phone: "+919876543298",
    experience: { en: "6 years exp", hi: "6 साल का अनुभव" },
    availability: { en: "Solar grid panel repairs, Ward 2", hi: "सोलर ग्रिड पैनल मरम्मत, वार्ड 2" },
    password: 'password123',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
  }
];

const seededProviders = defaultProviders.map((item, index) => {
  if (!item.reviews || item.reviews.length === 0) {
    const defaultItemReviews = [
      {
        id: `rev-init-manual-${item.id}-1`,
        author: index % 2 === 0 ? "Sunita Devi" : "Rajesh Kumar",
        rating: 5,
        comment: {
          en: "Very prompt and professional work. Highly satisfied!",
          hi: "बहुत ही त्वरित और पेशेवर काम। अत्यधिक संतुष्ट!"
        },
        date: { en: "2 days ago", hi: "2 दिन पहले" }
      },
      {
        id: `rev-init-manual-${item.id}-2`,
        author: index % 2 === 0 ? "Amit Saini" : "Preeti Vyas",
        rating: 4,
        comment: {
          en: "Reasonable charges and polite behavior.",
          hi: "उचित दाम और विनम्र व्यवहार।"
        },
        date: { en: "5 days ago", hi: "5 दिन पहले" }
      }
    ];
    const totalRating = defaultItemReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      ...item,
      rating: totalRating / defaultItemReviews.length,
      reviews: defaultItemReviews
    };
  }
  return item;
});

export const db = {
  // --- PROVIDERS (Service Providers) ---
  getProviders() {
    const data = localStorage.getItem(DB_KEYS.PROVIDERS);
    if (!data) {
      localStorage.setItem(DB_KEYS.PROVIDERS, JSON.stringify(seededProviders));
      return seededProviders;
    }
    return JSON.parse(data);
  },

  saveProviders(providers) {
    localStorage.setItem(DB_KEYS.PROVIDERS, JSON.stringify(providers));
  },

  getApprovedProviders() {
    return this.getProviders().filter((p) => p.status === 'approved');
  },

  getPendingProviders() {
    return this.getProviders().filter((p) => p.status === 'pending');
  },

  registerProvider(provider) {
    const list = this.getProviders();
    const newProvider = {
      ...provider,
      id: `prov-${Date.now()}`,
      rating: 5.0,
      status: 'pending',
      profilePhoto: '',
      kycDocType: '',
      kycDocument: '',
      kycStatus: 'none',
      kycNote: '',
      image: provider.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'
    };
    list.push(newProvider);
    this.saveProviders(list);
    return newProvider;
  },

  updateProvider(id, updatedFields) {
    const list = this.getProviders();
    const index = list.findIndex((p) => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      this.saveProviders(list);
      
      const session = this.getSession();
      if (session && session.id === id) {
        this.saveSession(list[index]);
      }
      return list[index];
    }
    return null;
  },

  approveProvider(id) {
    return this.updateProvider(id, { status: 'approved' });
  },

  rejectProvider(id) {
    const list = this.getProviders();
    const updated = list.filter((p) => p.id !== id);
    this.saveProviders(updated);
  },

  addProviderReview(id, review) {
    const list = this.getProviders();
    const index = list.findIndex((p) => p.id === id);
    if (index !== -1) {
      const p = list[index];
      if (!p.reviews) p.reviews = [];
      const newReview = {
        id: `rev-${Date.now()}`,
        author: review.author,
        rating: Number(review.rating),
        comment: {
          en: review.comment,
          hi: review.comment
        },
        date: {
          en: "Just Now",
          hi: "अभी"
        }
      };
      p.reviews.unshift(newReview);
      
      // Recalculate average rating
      const totalRating = p.reviews.reduce((sum, r) => sum + r.rating, 0);
      p.rating = totalRating / p.reviews.length;
      
      list[index] = p;
      this.saveProviders(list);
      return p;
    }
    return null;
  },

  // --- KYC ---
  getPendingKYCProviders() {
    return this.getProviders().filter((p) => p.kycStatus === 'pending');
  },

  approveKYC(id) {
    return this.updateProvider(id, { kycStatus: 'approved', kycNote: '' });
  },

  rejectKYC(id, note) {
    return this.updateProvider(id, { kycStatus: 'rejected', kycNote: note || 'Document not valid.' });
  },

  deleteProvider(id) {
    const list = this.getProviders();
    const updated = list.filter((p) => p.id !== id);
    this.saveProviders(updated);
    
    const session = this.getSession();
    if (session && session.id === id) {
      this.clearSession();
    }
  },

  loginProvider(identifier, password) {
    const list = this.getProviders();
    const id = identifier.trim();
    const idLower = id.toLowerCase();
    const user = list.find((p) =>
      (p.phone === id || (p.email && p.email.toLowerCase() === idLower)) &&
      p.password === password
    );
    if (user) {
      this.saveSession(user);
      return user;
    }
    return null;
  },

  getSession() {
    const data = localStorage.getItem(DB_KEYS.CURRENT_SESSION);
    return data ? JSON.parse(data) : null;
  },

  saveSession(user) {
    localStorage.setItem(DB_KEYS.CURRENT_SESSION, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(DB_KEYS.CURRENT_SESSION);
  },


  // --- ANNOUNCEMENTS ---
  getAnnouncements() {
    const data = localStorage.getItem(DB_KEYS.ANNOUNCEMENTS);
    if (!data) {
      localStorage.setItem(DB_KEYS.ANNOUNCEMENTS, JSON.stringify(mockData.urgentAnnouncements));
      return mockData.urgentAnnouncements;
    }
    return JSON.parse(data);
  },

  saveAnnouncements(list) {
    localStorage.setItem(DB_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
  },

  addAnnouncement(item) {
    const list = this.getAnnouncements();
    const newItem = {
      ...item,
      id: `ann-${Date.now()}`
    };
    list.unshift(newItem); // Pinned at top
    this.saveAnnouncements(list);
    return newItem;
  },

  deleteAnnouncement(id) {
    const list = this.getAnnouncements();
    const updated = list.filter((item) => item.id !== id);
    this.saveAnnouncements(updated);
  },


  // --- NEWS FEED ---
  getNews() {
    const data = localStorage.getItem(DB_KEYS.NEWS);
    if (!data) {
      localStorage.setItem(DB_KEYS.NEWS, JSON.stringify(mockData.newsFeed));
      return mockData.newsFeed;
    }
    return JSON.parse(data);
  },

  saveNews(list) {
    localStorage.setItem(DB_KEYS.NEWS, JSON.stringify(list));
  },

  addNews(item) {
    const list = this.getNews();
    const newItem = {
      ...item,
      id: `news-${Date.now()}`,
      image: item.image || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600'
    };
    list.unshift(newItem);
    this.saveNews(list);
    return newItem;
  },

  deleteNews(id) {
    const list = this.getNews();
    const updated = list.filter((item) => item.id !== id);
    this.saveNews(updated);
  },


  // --- SCHEMES ---
  getSchemes() {
    const data = localStorage.getItem(DB_KEYS.SCHEMES);
    if (!data) {
      localStorage.setItem(DB_KEYS.SCHEMES, JSON.stringify(mockData.schemes));
      return mockData.schemes;
    }
    return JSON.parse(data);
  },

  saveSchemes(list) {
    localStorage.setItem(DB_KEYS.SCHEMES, JSON.stringify(list));
  },

  addScheme(item) {
    const list = this.getSchemes();
    const newItem = {
      ...item,
      id: `sch-${Date.now()}`
    };
    list.push(newItem);
    this.saveSchemes(list);
    return newItem;
  },

  deleteScheme(id) {
    const list = this.getSchemes();
    const updated = list.filter((item) => item.id !== id);
    this.saveSchemes(updated);
  },


  // --- LEADERS ---
  getLeaders() {
    const data = localStorage.getItem(DB_KEYS.LEADERS);
    if (!data) {
      localStorage.setItem(DB_KEYS.LEADERS, JSON.stringify(mockData.leaders));
      return mockData.leaders;
    }
    return JSON.parse(data);
  },

  saveLeaders(list) {
    localStorage.setItem(DB_KEYS.LEADERS, JSON.stringify(list));
  },

  addLeader(item) {
    const list = this.getLeaders();
    const newItem = {
      ...item,
      id: `lead-${Date.now()}`,
      image: item.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
    };
    list.push(newItem);
    this.saveLeaders(list);
    return newItem;
  },

  deleteLeader(id) {
    const list = this.getLeaders();
    const updated = list.filter((item) => item.id !== id);
    this.saveLeaders(updated);
  },


  // --- SCHOOLS (EDUCATION) ---
  getSchools() {
    const data = localStorage.getItem(DB_KEYS.SCHOOLS);
    if (!data) {
      localStorage.setItem(DB_KEYS.SCHOOLS, JSON.stringify(mockData.education));
      return mockData.education;
    }
    return JSON.parse(data);
  },

  saveSchools(list) {
    localStorage.setItem(DB_KEYS.SCHOOLS, JSON.stringify(list));
  },

  addSchool(item) {
    const list = this.getSchools();
    const newItem = {
      ...item,
      id: `sch-${Date.now()}`
    };
    list.push(newItem);
    this.saveSchools(list);
    return newItem;
  },

  deleteSchool(id) {
    const list = this.getSchools();
    const updated = list.filter((item) => item.id !== id);
    this.saveSchools(updated);
  },

  // --- JOBS ---
  getJobs() {
    const data = localStorage.getItem(DB_KEYS.JOBS);
    if (!data) {
      const defaultJobs = [
        {
          id: 'job-1',
          title: {
            en: "Haryana Police Constable Recruitment 2026",
            hi: "हरियाणा पुलिस कांस्टेबल भर्ती 2026"
          },
          department: {
            en: "Haryana Police Department",
            hi: "हरियाणा पुलिस विभाग"
          },
          vacancies: {
            en: "5,600 Posts (Male & Female)",
            hi: "5,600 पद (पुरुष और महिला)"
          },
          eligibility: {
            en: "12th Pass + CET Haryana Qualified",
            hi: "12वीं पास + सीईटी हरियाणा क्वालिफाइड"
          },
          lastDate: {
            en: "June 25, 2026",
            hi: "25 जून, 2026"
          },
          link: "https://hssc.gov.in"
        },
        {
          id: 'job-2',
          title: {
            en: "HSSC TGT & PGT Teacher Vacancies",
            hi: "एचएसएससी टीजीटी और पीजीटी शिक्षक रिक्तियां"
          },
          department: {
            en: "School Education Department, Haryana",
            hi: "स्कूल शिक्षा विभाग, हरियाणा"
          },
          vacancies: {
            en: "2,400 Posts",
            hi: "2,400 पद"
          },
          eligibility: {
            en: "Graduation + B.Ed + HTET Qualified",
            hi: "स्नातक + बी.एड + एचटीईटी क्वालिफाइड"
          },
          lastDate: {
            en: "July 10, 2026",
            hi: "10 जुलाई, 2026"
          },
          link: "https://hssc.gov.in"
        },
        {
          id: 'job-3',
          title: {
            en: "HPSC Assistant Professor Recruitment",
            hi: "एचपीएससी सहायक प्रोफेसर भर्ती"
          },
          department: {
            en: "Higher Education Department, Haryana",
            hi: "उच्च शिक्षा विभाग, हरियाणा"
          },
          vacancies: {
            en: "1,200 Posts",
            hi: "1,200 पद"
          },
          eligibility: {
            en: "Post Graduation + NET/SLET/Ph.D",
            hi: "स्नातकोत्तर + नेट/स्लेट/पीएच.डी"
          },
          lastDate: {
            en: "June 30, 2026",
            hi: "30 जून, 2026"
          },
          link: "https://hpsc.gov.in"
        }
      ];
      localStorage.setItem(DB_KEYS.JOBS, JSON.stringify(defaultJobs));
      return defaultJobs;
    }
    return JSON.parse(data);
  },

  saveJobs(list) {
    localStorage.setItem(DB_KEYS.JOBS, JSON.stringify(list));
  },

  addJob(item) {
    const list = this.getJobs();
    const newItem = {
      ...item,
      id: `job-${Date.now()}`
    };
    list.unshift(newItem);
    this.saveJobs(list);
    return newItem;
  },

  deleteJob(id) {
    const list = this.getJobs();
    const updated = list.filter((item) => item.id !== id);
    this.saveJobs(updated);
  },

  // --- SUPER ADMIN SESSION MANAGERS ---
  loginSuperAdmin(username, password) {
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      localStorage.setItem(DB_KEYS.ADMIN_SESSION, 'true');
      return true;
    }
    return false;
  },

  getAdminSession() {
    return localStorage.getItem(DB_KEYS.ADMIN_SESSION) === 'true';
  },

  clearAdminSession() {
    localStorage.removeItem(DB_KEYS.ADMIN_SESSION);
  }
};
