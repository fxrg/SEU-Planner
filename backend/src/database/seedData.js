// بيانات الكليات والتخصصات والمقررات - الجامعة السعودية الإلكترونية
export const colleges = [
  {
    name_ar: 'كلية العلوم الصحية',
    name_en: 'College of Health Sciences'
  },
  {
    name_ar: 'كلية الحوسبة والمعلوماتية',
    name_en: 'College of Computing and Informatics'
  },
  {
    name_ar: 'كلية العلوم الإدارية والمالية',
    name_en: 'College of Administrative and Financial Sciences'
  },
  {
    name_ar: 'كلية العلوم والدراسات النظرية',
    name_en: 'College of Sciences and Theoretical Studies'
  }
];

export const majors = [
  // كلية العلوم الصحية
  {
    college: 'كلية العلوم الصحية',
    name_ar: 'المعلوماتية الصحية',
    name_en: 'Health Informatics',
    code: 'HI'
  },
  {
    college: 'كلية العلوم الصحية',
    name_ar: 'الصحة العامة',
    name_en: 'Public Health',
    code: 'PH'
  },
  // كلية الحوسبة والمعلوماتية
  {
    college: 'كلية الحوسبة والمعلوماتية',
    name_ar: 'تقنية المعلومات',
    name_en: 'Information Technology',
    code: 'IT'
  },
  {
    college: 'كلية الحوسبة والمعلوماتية',
    name_ar: 'علوم الحاسب الآلي',
    name_en: 'Computer Science',
    code: 'CS'
  },
  {
    college: 'كلية الحوسبة والمعلوماتية',
    name_ar: 'علوم البيانات',
    name_en: 'Data Science',
    code: 'DS'
  },
  // كلية العلوم الإدارية والمالية
  {
    college: 'كلية العلوم الإدارية والمالية',
    name_ar: 'المالية',
    name_en: 'Finance',
    code: 'FIN'
  },
  {
    college: 'كلية العلوم الإدارية والمالية',
    name_ar: 'إدارة الأعمال',
    name_en: 'Business Administration',
    code: 'MGT'
  },
  {
    college: 'كلية العلوم الإدارية والمالية',
    name_ar: 'التجارة الإلكترونية',
    name_en: 'E-Commerce',
    code: 'ECOM'
  },
  {
    college: 'كلية العلوم الإدارية والمالية',
    name_ar: 'المحاسبة',
    name_en: 'Accounting',
    code: 'ACCT'
  },
  // كلية العلوم والدراسات النظرية
  {
    college: 'كلية العلوم والدراسات النظرية',
    name_ar: 'اللغة الإنجليزية والترجمة',
    name_en: 'English Language and Translation',
    code: 'ENG'
  },
  {
    college: 'كلية العلوم والدراسات النظرية',
    name_ar: 'القانون',
    name_en: 'Law',
    code: 'LAW'
  },
  {
    college: 'كلية العلوم والدراسات النظرية',
    name_ar: 'الإعلام الرقمي',
    name_en: 'Digital Media',
    code: 'DMED'
  }
];

export const courses = [
  // ==================== المعلوماتية الصحية ====================
  {
    major_code: 'HI',
    courses: [
      { code: 'ENG001', name_ar: 'مهارات اللغة الإنجليزية', name_en: 'English Language Skills', credit_hours: 3, difficulty: 2 },
      { code: 'CS001', name_ar: 'مهارات الحاسب', name_en: 'Computer Skills', credit_hours: 3, difficulty: 2 },
      { code: 'COMM101', name_ar: 'مهارات التواصل', name_en: 'Communication Skills', credit_hours: 3, difficulty: 2 },
      { code: 'ENG102', name_ar: 'مهارات اللغة الإنجليزية II', name_en: 'English Language Skills II', credit_hours: 3, difficulty: 2 },
      { code: 'MATH001', name_ar: 'مقدمة في الرياضيات', name_en: 'Introduction to Mathematics', credit_hours: 3, difficulty: 3 },
      { code: 'CI001', name_ar: 'المهارات الأكاديمية', name_en: 'Academic Skills', credit_hours: 3, difficulty: 2 },
      { code: 'BIO101', name_ar: 'المصطلحات الطبية الأساسية', name_en: 'Basic Medical Terminology', credit_hours: 3, difficulty: 3 },
      { code: 'HCM101', name_ar: 'إدارة الرعاية الصحية', name_en: 'Health Care Management', credit_hours: 3, difficulty: 3 },
      { code: 'HCM102', name_ar: 'السلوك التنظيمي', name_en: 'Organizational Behavior', credit_hours: 3, difficulty: 3 },
      { code: 'PHC121', name_ar: 'مقدمة في الإحصاء الحيوي', name_en: 'Introduction to Biostatistics', credit_hours: 3, difficulty: 4 },
      { code: 'IT231', name_ar: 'مقدمة في تقنية المعلومات ونظم المعلومات', name_en: 'Introduction to IT and Information Systems', credit_hours: 3, difficulty: 3 },
      { code: 'IT232', name_ar: 'البرمجة الشيئية', name_en: 'Object Oriented Programming', credit_hours: 3, difficulty: 4 },
      { code: 'BIO102', name_ar: 'مقدمة في علم التشريح ووظائف الأعضاء', name_en: 'Introduction to Anatomy and Physiology', credit_hours: 3, difficulty: 4 },
      { code: 'IT244', name_ar: 'مقدمة في قواعد البيانات', name_en: 'Introduction to Database', credit_hours: 3, difficulty: 4 },
      { code: 'IT245', name_ar: 'هيكلة البيانات', name_en: 'Data Structure', credit_hours: 3, difficulty: 4 },
      { code: 'PHC131', name_ar: 'مقدمة في علم الأوبئة', name_en: 'Introduction to Epidemiology', credit_hours: 3, difficulty: 4 },
      { code: 'HCM113', name_ar: 'السياسة الصحية والنظام الصحي السعودي', name_en: 'Health Policy and Saudi Healthcare System', credit_hours: 3, difficulty: 3 },
      { code: 'ISLM101', name_ar: 'مقدمة في الثقافة الإسلامية I', name_en: 'Introduction to Islamic Culture I', credit_hours: 2, difficulty: 2 },
      { code: 'PHC212', name_ar: 'مفاهيم التثقيف والتعزيز الصحي', name_en: 'Concepts of Health Education and Promotion', credit_hours: 3, difficulty: 3 },
      { code: 'IT351', name_ar: 'شبكات الحاسب', name_en: 'Computer Networks', credit_hours: 3, difficulty: 4 },
      { code: 'IT352', name_ar: 'التفاعل بين الإنسان والحاسوب', name_en: 'Human Computer Interaction', credit_hours: 3, difficulty: 3 },
      { code: 'HCI111', name_ar: 'مقدمة في المعلوماتية الصحية', name_en: 'Introduction to Health Informatics', credit_hours: 3, difficulty: 4 },
      { code: 'ISLM102', name_ar: 'السلوك المهني والأخلاق في الإسلام', name_en: 'Professional Conduct & Ethics in Islam', credit_hours: 2, difficulty: 2 },
      { code: 'IT353', name_ar: 'تحليل وتصميم النظم', name_en: 'System Analysis and Design', credit_hours: 3, difficulty: 4 },
      { code: 'HCM213', name_ar: 'الإدارة المالية للرعاية الصحية', name_en: 'Financial Management for Healthcare', credit_hours: 3, difficulty: 4 },
      { code: 'PHC215', name_ar: 'طرق البحث في الرعاية الصحية', name_en: 'Healthcare Research Methods', credit_hours: 3, difficulty: 4 },
      { code: 'IT362', name_ar: 'إدارة مشاريع تقنية المعلومات', name_en: 'IT Project Management', credit_hours: 3, difficulty: 4 },
      { code: 'PHC216', name_ar: 'الأخلاقيات والأنظمة في الرعاية الصحية', name_en: 'Ethics & Regulations in Healthcare', credit_hours: 3, difficulty: 3 },
      { code: 'HCI112', name_ar: 'السجلات الصحية الإلكترونية', name_en: 'Electronic Health Records', credit_hours: 3, difficulty: 4 },
      { code: 'IT361', name_ar: 'تقنيات الويب', name_en: 'Web Technologies', credit_hours: 3, difficulty: 4 },
      { code: 'IT475', name_ar: 'نظم دعم القرار', name_en: 'Decision Support Systems', credit_hours: 3, difficulty: 4 },
      { code: 'IT476', name_ar: 'أمن تقنية المعلومات والسياسات', name_en: 'IT Security & Policies', credit_hours: 3, difficulty: 4 },
      { code: 'HCI214', name_ar: 'معلوماتية صحة المستهلك', name_en: 'Consumer Health Informatics', credit_hours: 3, difficulty: 4 },
      { code: 'ISLM103', name_ar: 'النظام الاقتصادي الإسلامي', name_en: 'Islamic Economic System', credit_hours: 2, difficulty: 2 },
      { code: 'HCI213', name_ar: 'الترميز والفوترة الطبية', name_en: 'Medical Coding and Billing', credit_hours: 3, difficulty: 5 },
      { code: 'PHC312', name_ar: 'الاتصالات الصحية', name_en: 'Health Communications', credit_hours: 3, difficulty: 3 },
      { code: 'HCI315', name_ar: 'الصحة والطب عن بعد', name_en: 'Telehealth and Telemedicine', credit_hours: 3, difficulty: 4 },
      { code: 'HCI316', name_ar: 'الصحة الإلكترونية', name_en: 'E-Health', credit_hours: 3, difficulty: 4 },
      { code: 'HCI314', name_ar: 'معلوماتية الصحة العامة', name_en: 'Public Health Informatics', credit_hours: 3, difficulty: 4 },
      { code: 'ISLM104', name_ar: 'النظام الاجتماعي وحقوق الإنسان', name_en: 'Social System and Human Rights', credit_hours: 2, difficulty: 2 }
    ]
  },
  // ==================== الصحة العامة ====================
  {
    major_code: 'PH',
    courses: [
      { code: 'ENG001', name_ar: 'مهارات اللغة الإنجليزية', name_en: 'English Language Skills', credit_hours: 3, difficulty: 2 },
      { code: 'CS001', name_ar: 'مهارات الحاسب', name_en: 'Computer Skills', credit_hours: 3, difficulty: 2 },
      { code: 'COMM101', name_ar: 'مهارات التواصل', name_en: 'Communication Skills', credit_hours: 3, difficulty: 2 },
      { code: 'ENG102', name_ar: 'مهارات اللغة الإنجليزية II', name_en: 'English Language Skills II', credit_hours: 3, difficulty: 2 },
      { code: 'MATH001', name_ar: 'مقدمة في الرياضيات', name_en: 'Introduction to Mathematics', credit_hours: 3, difficulty: 3 },
      { code: 'CI001', name_ar: 'المهارات الأكاديمية', name_en: 'Academic Skills', credit_hours: 3, difficulty: 2 },
      { code: 'BIOL101', name_ar: 'المصطلحات الطبية الأساسية', name_en: 'Basic Medical Terminology', credit_hours: 3, difficulty: 3 },
      { code: 'ISLM101', name_ar: 'مقدمة في الثقافة الإسلامية I', name_en: 'Introduction to Islamic Culture I', credit_hours: 2, difficulty: 2 },
      { code: 'HCM101', name_ar: 'إدارة الرعاية الصحية', name_en: 'Health Care Management', credit_hours: 3, difficulty: 3 },
      { code: 'PHC121', name_ar: 'مقدمة في الإحصاء الحيوي', name_en: 'Introduction to Biostatistics', credit_hours: 3, difficulty: 4 },
      { code: 'PHC101', name_ar: 'مقدمة في الصحة العامة', name_en: 'Introduction to Public Health', credit_hours: 3, difficulty: 3 },
      { code: 'HCM102', name_ar: 'السلوك التنظيمي', name_en: 'Organizational Behavior', credit_hours: 3, difficulty: 3 },
      { code: 'BIOL102', name_ar: 'مقدمة في علم التشريح ووظائف الأعضاء', name_en: 'Introduction to Anatomy and Physiology', credit_hours: 3, difficulty: 4 },
      { code: 'BIOL103', name_ar: 'مبادئ علم الأحياء الدقيقة للصحة العامة', name_en: 'Principles of Microbiology for Public Health', credit_hours: 3, difficulty: 4 },
      { code: 'HCM113', name_ar: 'السياسة الصحية والنظام الصحي السعودي', name_en: 'Health Policy & Saudi Healthcare System', credit_hours: 3, difficulty: 3 },
      { code: 'PHC131', name_ar: 'مقدمة في علم الأوبئة', name_en: 'Introduction to Epidemiology', credit_hours: 3, difficulty: 4 },
      { code: 'PHC151', name_ar: 'الصحة البيئية', name_en: 'Environmental Health', credit_hours: 3, difficulty: 4 },
      { code: 'PHC181', name_ar: 'علم اجتماع الصحة والمرض والرعاية الصحية', name_en: 'Sociology of Health, Illness and Healthcare', credit_hours: 3, difficulty: 3 },
      { code: 'PHC212', name_ar: 'مفاهيم التثقيف والتعزيز الصحي', name_en: 'Concepts of Health Education and Promotion', credit_hours: 3, difficulty: 3 },
      { code: 'PHC241', name_ar: 'المفاهيم الأساسية في الغذاء والتغذية', name_en: 'Fundamental Concepts in Food and Nutrition', credit_hours: 3, difficulty: 3 },
      { code: 'PHC261', name_ar: 'الصحة المهنية', name_en: 'Occupational Health', credit_hours: 3, difficulty: 4 },
      { code: 'PHC271', name_ar: 'مقدمة في الأمراض', name_en: 'Introduction to Disease', credit_hours: 3, difficulty: 4 },
      { code: 'PHC281', name_ar: 'السلوك الصحي', name_en: 'Health Behavior', credit_hours: 3, difficulty: 3 },
      { code: 'ISLM102', name_ar: 'مقدمة في الثقافة الإسلامية II', name_en: 'Introduction to Islamic Culture II', credit_hours: 2, difficulty: 2 },
      { code: 'HCM213', name_ar: 'الإدارة المالية للرعاية الصحية', name_en: 'Financial Management for Healthcare', credit_hours: 3, difficulty: 4 },
      { code: 'PHC215', name_ar: 'طرق البحث والتحليل في الرعاية الصحية', name_en: 'Healthcare Research Methods and Analysis', credit_hours: 3, difficulty: 4 },
      { code: 'PHC216', name_ar: 'الأخلاقيات والأنظمة في الرعاية الصحية', name_en: 'Ethics and Regulation in Health Care', credit_hours: 3, difficulty: 3 },
      { code: 'PHC231', name_ar: 'مقدمة في علم الأوبئة المستشفيات', name_en: 'Introduction to Hospital Epidemiology', credit_hours: 3, difficulty: 4 },
      { code: 'PHC273', name_ar: 'مقدمة في الصحة النفسية', name_en: 'Introduction to Mental Health', credit_hours: 3, difficulty: 3 },
      { code: 'PHC274', name_ar: 'التخطيط الصحي', name_en: 'Health Planning', credit_hours: 3, difficulty: 4 },
      { code: 'ISLM103', name_ar: 'مقدمة في الثقافة الإسلامية III', name_en: 'Introduction to Islamic Culture III', credit_hours: 2, difficulty: 2 },
      { code: 'PHC311', name_ar: 'الصحة العالمية', name_en: 'Global Health', credit_hours: 3, difficulty: 4 },
      { code: 'PHC312', name_ar: 'الاتصالات الصحية', name_en: 'Health Communication', credit_hours: 3, difficulty: 3 },
      { code: 'PHC313', name_ar: 'إصابات الطرق والوقاية من الإعاقة', name_en: 'Road Traffic Injuries and Disability Prevention', credit_hours: 3, difficulty: 3 },
      { code: 'PHC331', name_ar: 'علم الأوبئة الأمراض المزمنة والوقاية منها', name_en: 'Chronic Disease Epidemiology and Prevention', credit_hours: 3, difficulty: 4 },
      { code: 'PHC372', name_ar: 'إدارة تفشي الصحة العامة والكوارث', name_en: 'Public Health Outbreak and Disaster Management', credit_hours: 3, difficulty: 4 },
      { code: 'PHC373', name_ar: 'صحة الأم والطفل', name_en: 'Maternal and Child Health', credit_hours: 3, difficulty: 4 },
      { code: 'PHC374', name_ar: 'تعزيز صحة الفم', name_en: 'Oral Health Promotion', credit_hours: 3, difficulty: 3 },
      { code: 'PHC314', name_ar: 'المجتمع والإدمان', name_en: 'Society and Addiction', credit_hours: 3, difficulty: 3 },
      { code: 'ISLM104', name_ar: 'مقدمة في الثقافة الإسلامية IV', name_en: 'Introduction to Islamic Culture IV', credit_hours: 2, difficulty: 2 },
      { code: 'PHC321', name_ar: 'الإحصاء الحيوي التطبيقي', name_en: 'Applied Biostatistics', credit_hours: 3, difficulty: 5 },
      { code: 'PHC332', name_ar: 'علم الأوبئة المتقدم', name_en: 'Advanced Epidemiology', credit_hours: 3, difficulty: 5 },
      { code: 'PHC335', name_ar: 'مخاطر السرطان والوقاية منه', name_en: 'Cancer Risk and Prevention', credit_hours: 3, difficulty: 4 },
      { code: 'PHC351', name_ar: 'تقييم المخاطر الصحية والبيئية', name_en: 'Health and Environmental Risk Assessment', credit_hours: 3, difficulty: 4 },
      { code: 'PHC361', name_ar: 'أساسيات السلامة', name_en: 'Safety Fundamentals', credit_hours: 3, difficulty: 3 },
      { code: 'PHC362', name_ar: 'تعزيز الصحة في مكان العمل', name_en: 'Workplace Health Promotion', credit_hours: 3, difficulty: 3 },
      { code: 'PHC315', name_ar: 'تقييم برامج الصحة العامة', name_en: 'Public Health Program Evaluation', credit_hours: 3, difficulty: 4 },
      { code: 'PHC375', name_ar: 'تعزيز النشاط البدني والصحة', name_en: 'Promoting Physical Activity and Health', credit_hours: 3, difficulty: 3 },
      { code: 'PHC376', name_ar: 'تعزيز الصحة في مراحل العمر المتقدمة', name_en: 'Health Promotion and Later Life', credit_hours: 3, difficulty: 3 }
    ]
  },
  // سأكمل باقي التخصصات...
];

// المزيد من التخصصات في الملف التالي (يُكمل بسبب الطول)
