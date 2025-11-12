// بيانات كاملة للجامعة السعودية الإلكترونية - جميع الكليات والتخصصات

const SEU_COMPLETE_DATA = {
    // معلومات الترمين
    terms: {
        term1: {
            id: 1,
            name_ar: 'الترم الأول',
            name_en: 'Term 1',
            academic_year: '2025-2026',
            start_date: '2025-09-01',
            end_date: '2025-12-31',
            exam_start_date: '2025-12-14',
            exam_end_date: '2025-12-31',
            is_open: true
        },
        term2: {
            id: 2,
            name_ar: 'الترم الثاني',
            name_en: 'Term 2',
            academic_year: '2025-2026',
            start_date: '2026-01-11',
            end_date: '2026-05-31',
            exam_start_date: '2026-05-15',
            exam_end_date: '2026-05-31',
            is_open: false,
            opens_on: '2026-01-11'
        }
    },
    
    // جميع التخصصات
    majors: {
        // كلية العلوم الصحية
        health_informatics: {
            id: 'health_informatics',
            name_ar: 'المعلوماتية الصحية',
            name_en: 'Health Informatics',
            college_ar: 'كلية العلوم الصحية',
            college_en: 'College of Health Sciences',
            courses: ['ENG001', 'CS001', 'COMM101', 'ENG102', 'MATH001', 'CI001', 'BIO101', 'HCM101', 'HCM102', 'PHC121', 'IT231', 'IT232', 'BIO102', 'IT244', 'IT245', 'PHC131', 'HCM113', 'ISLM101', 'PHC212', 'IT351', 'IT352', 'HCI111', 'ISLM102', 'IT353', 'HCM213', 'PHC215', 'IT362', 'PHC216', 'HCI112', 'IT361', 'IT475', 'IT476', 'HCI214', 'ISLM103', 'HCI213', 'PHC312', 'HCI315', 'HCI316', 'HCI314', 'ISLM104']
        },
        public_health: {
            id: 'public_health',
            name_ar: 'الصحة العامة',
            name_en: 'Public Health',
            college_ar: 'كلية العلوم الصحية',
            college_en: 'College of Health Sciences',
            courses: ['ENG001', 'CS001', 'COMM101', 'ENG102', 'MATH001', 'CI001', 'BIOL101', 'ISLM101', 'HCM101', 'PHC121', 'PHC101', 'HCM102', 'BIOL102', 'BIOL103', 'HCM113', 'PHC131', 'PHC151', 'PHC181', 'PHC212', 'PHC241', 'PHC261', 'PHC271', 'PHC281', 'ISLM102', 'HCM213', 'PHC215', 'PHC216', 'PHC231', 'PHC273', 'PHC274', 'ISLM103', 'PHC311', 'PHC312', 'PHC313', 'PHC331', 'PHC372', 'PHC373', 'PHC374', 'PHC314', 'ISLM104', 'PHC321', 'PHC332', 'PHC335', 'PHC351', 'PHC361', 'PHC362', 'PHC315', 'PHC375', 'PHC376']
        },
        
        // كلية الحوسبة والمعلوماتية
        it: {
            id: 'it',
            name_ar: 'تقنية المعلومات',
            name_en: 'Information Technology',
            college_ar: 'كلية الحوسبة والمعلوماتية',
            college_en: 'College of Computing and Informatics',
            courses: ['CI001', 'COMM001', 'CS001', 'ENG001', 'ENG103', 'ISLM101', 'ISLM102', 'ISLM103', 'ISLM104', 'IT231', 'IT232', 'IT233', 'IT241', 'IT244', 'IT245', 'IT351', 'IT352', 'IT353', 'IT354', 'IT361', 'IT362', 'IT363', 'IT364', 'IT365', 'IT470', 'IT471', 'IT472', 'IT473', 'IT474', 'IT475', 'IT476', 'IT478', 'IT479', 'IT480', 'IT481', 'IT482', 'IT483', 'IT484', 'IT485', 'IT487', 'IT488', 'IT489', 'IT490', 'IT499', 'MATH001', 'MATH150', 'MATH251', 'SCI101', 'SCI201', 'STAT101']
        },
        cs: {
            id: 'cs',
            name_ar: 'علوم الحاسب الآلي',
            name_en: 'Computer Science',
            college_ar: 'كلية الحوسبة والمعلوماتية',
            college_en: 'College of Computing and Informatics',
            courses: ['CI001', 'COMM001', 'CS001', 'CS230', 'CS231', 'CS240', 'CS241', 'CS242', 'CS243', 'CS350', 'CS351', 'CS352', 'CS353', 'CS360', 'CS361', 'CS362', 'CS363', 'CS364', 'CS470', 'CS471', 'CS475', 'CS476', 'CS477', 'CS478', 'CS479', 'CS480', 'CS481', 'CS485', 'CS488', 'CS489']
        },
        ds: {
            id: 'ds',
            name_ar: 'علوم البيانات',
            name_en: 'Data Science',
            college_ar: 'كلية الحوسبة والمعلوماتية',
            college_en: 'College of Computing and Informatics',
            courses: ['CI001', 'COMM001', 'CS001', 'DS230', 'DS231', 'DS240', 'DS242', 'DS243', 'DS350', 'DS351', 'DS352', 'DS353', 'DS360', 'DS361', 'DS362', 'DS363', 'DS364', 'DS470', 'DS471', 'DS472', 'DS473', 'DS474', 'DS475', 'DS476', 'DS479', 'DS480', 'DS481', 'DS482', 'DS483', 'DS484', 'MATH150', 'MATH251', 'SCI101', 'SCI201', 'STAT202']
        },
        
        // كلية العلوم الإدارية والمالية
        finance: {
            id: 'finance',
            name_ar: 'المالية',
            name_en: 'Finance',
            college_ar: 'كلية العلوم الإدارية والمالية',
            college_en: 'College of Administrative and Financial Sciences',
            courses: ['ENG001', 'CS001', 'COMM001', 'CI001', 'MATH001', 'ISLM101', 'ISLM102', 'ISLM103', 'ISLM104', 'ACCT101', 'MGT101', 'STAT101', 'ECON101', 'LAW101', 'ECOM101', 'STAT201', 'ECON201', 'MIS201', 'MGT201', 'FIN101', 'FIN201', 'FIN301', 'FIN402', 'FIN403', 'FIN405', 'FIN406', 'FIN401', 'FIN408', 'FIN424', 'FIN416', 'FIN421', 'MGT312']
        },
        business: {
            id: 'business',
            name_ar: 'إدارة الأعمال',
            name_en: 'Business Administration',
            college_ar: 'كلية العلوم الإدارية والمالية',
            college_en: 'College of Administrative and Financial Sciences',
            courses: ['ENG001', 'CS001', 'COMM001', 'CI001', 'MATH001', 'ISLM101', 'ISLM102', 'ISLM103', 'ISLM104', 'ACCT101', 'ACCT301', 'ECOM101', 'ECOM201', 'ECON101', 'ECON201', 'FIN101', 'LAW101', 'MGT101', 'MGT201', 'MGT211', 'MGT301', 'MGT311', 'MGT321', 'MGT322', 'MGT401', 'MIS201', 'STAT101', 'STAT201', 'MGT312', 'MGT323', 'MGT324', 'MGT402', 'MGT403', 'MGT404', 'MGT421', 'MGT422', 'MGT430']
        },
        ecommerce: {
            id: 'ecommerce',
            name_ar: 'التجارة الإلكترونية',
            name_en: 'E-Commerce',
            college_ar: 'كلية العلوم الإدارية والمالية',
            college_en: 'College of Administrative and Financial Sciences',
            courses: ['ENG001', 'CS001', 'MATH001', 'COMM001', 'CI001', 'ISLM101', 'ISLM102', 'ISLM103', 'ISLM104', 'STAT101', 'LAW101', 'ECON101', 'MGT101', 'ACCT101', 'STAT201', 'FIN101', 'MGT201', 'MGT211', 'ECOM101', 'ECON201', 'MIS201', 'ECOM201', 'MGT301', 'MGT311', 'ACCT301', 'MGT321', 'MGT322', 'MGT401', 'IT404', 'LAW402', 'ECOM421', 'ECOM402', 'ECOM301', 'IT403', 'IT401', 'IT402', 'ECOM430']
        },
        accounting: {
            id: 'accounting',
            name_ar: 'المحاسبة',
            name_en: 'Accounting',
            college_ar: 'كلية العلوم الإدارية والمالية',
            college_en: 'College of Administrative and Financial Sciences',
            courses: ['ENG001', 'CS001', 'MATH001', 'COMM001', 'CI001', 'ISLM101', 'ISLM102', 'ISLM103', 'ISLM104', 'MGT101', 'STAT101', 'ACCT101', 'LAW101', 'ECON101', 'ECOM101', 'MGT201', 'ACCT201', 'ACCT302', 'ACCT401', 'ACCT402', 'ACCT403', 'ACCT422', 'LAW401', 'ACCT322', 'ACCT405', 'ACCT321', 'ACCT424', 'FIN201', 'FIN401', 'FIN402', 'MGT312', 'MGT323', 'MGT402']
        },
        
        // كلية العلوم والدراسات النظرية
        english: {
            id: 'english',
            name_ar: 'اللغة الإنجليزية والترجمة',
            name_en: 'English Language and Translation',
            college_ar: 'كلية العلوم والدراسات النظرية',
            college_en: 'College of Sciences and Theoretical Studies',
            courses: ['CS001', 'ENG001', 'CI001', 'MATH001', 'COMM001', 'ISLM101', 'ISLM102', 'ISLM103', 'ISLM104', 'ENG201', 'ENG202', 'ENG210', 'ENG220', 'ARB211', 'ENG230', 'ENG231', 'ENG240', 'ENG250', 'ARB260', 'ENG301', 'ENG310', 'ENG320', 'TRA330', 'ENG340', 'ENG350', 'ENG360', 'TRA370', 'ENG380', 'ARB221', 'ENG401', 'TRA410', 'TRA420', 'TRA430', 'TRA440', 'TRA450', 'TRA460', 'TRA470', 'TRA480', 'TRA490', 'TRA499']
        },
        law: {
            id: 'law',
            name_ar: 'القانون',
            name_en: 'Law',
            college_ar: 'كلية العلوم والدراسات النظرية',
            college_en: 'College of Sciences and Theoretical Studies',
            courses: ['CS003', 'CI003', 'ENG003', 'COMM003', 'MATH003', 'ISLM101', 'LAW121', 'LAW122', 'LAW123', 'LAW211', 'LAW212', 'LAW213', 'LAW214', 'LAW215', 'LAW221', 'LAW222', 'LAW223', 'LAW224', 'LAW225', 'LAW311', 'LAW312', 'LAW313', 'LAW314', 'LAW315', 'LAW411', 'LAW412', 'LAW413', 'LAW421', 'LAW422', 'LAW423', 'LAW424', 'LAW425', 'LAW426', 'LAW428']
        },
        digital_media: {
            id: 'digital_media',
            name_ar: 'الإعلام الرقمي',
            name_en: 'Digital Media',
            college_ar: 'كلية العلوم والدراسات النظرية',
            college_en: 'College of Sciences and Theoretical Studies',
            courses: ['CS003', 'CI003', 'ENG003', 'COMM003', 'DMED101', 'DMED102', 'DMED103', 'ARB211', 'MATH003', 'DMED201', 'DMED202', 'DMED203', 'DMED204', 'ARB260', 'ISLM101', 'DMED205', 'DMED206', 'DMED207', 'DMPS101', 'DMED208', 'ISLM102', 'DMED301', 'DMED333', 'DMED302', 'DMIT202', 'DMED304', 'DMED401', 'DMED402', 'DMED403', 'DMED404', 'DMED405', 'DMED406', 'DMED407', 'DMED408', 'DMED409', 'DMSO101', 'DMED303', 'DMLO101']
        }
    },
    
    // جميع المقررات
    courses: {
        // مقررات مشتركة
        'ENG001': { code: 'ENG001', name_ar: 'مهارات اللغة الإنجليزية', name_en: 'English Language Skills', difficulty: 2, hours: 3 },
        'ENG102': { code: 'ENG102', name_ar: 'مهارات اللغة الإنجليزية II', name_en: 'English Language Skills II', difficulty: 2, hours: 3 },
        'ENG103': { code: 'ENG103', name_ar: 'الكتابة التقنية', name_en: 'Technical Writing', difficulty: 3, hours: 3 },
        'CS001': { code: 'CS001', name_ar: 'مهارات الحاسب الآلي', name_en: 'Computer Skills', difficulty: 1, hours: 3 },
        'COMM001': { code: 'COMM001', name_ar: 'مهارات الاتصال', name_en: 'Communication Skills', difficulty: 2, hours: 3 },
        'COMM101': { code: 'COMM101', name_ar: 'مهارات الاتصال', name_en: 'Communication Skills', difficulty: 2, hours: 3 },
        'CI001': { code: 'CI001', name_ar: 'المهارات الأكاديمية', name_en: 'Academic Skills', difficulty: 2, hours: 3 },
        'MATH001': { code: 'MATH001', name_ar: 'أساسيات الرياضيات', name_en: 'Fundamentals of Mathematics', difficulty: 3, hours: 3 },
        'ISLM101': { code: 'ISLM101', name_ar: 'مقدمة في الثقافة الإسلامية I', name_en: 'Introduction to Islamic Culture I', difficulty: 2, hours: 2 },
        'ISLM102': { code: 'ISLM102', name_ar: 'السلوك المهني والأخلاق في الإسلام', name_en: 'Professional Conduct & Ethics in Islam', difficulty: 2, hours: 2 },
        'ISLM103': { code: 'ISLM103', name_ar: 'النظام الاقتصادي الإسلامي', name_en: 'Islamic Economic System', difficulty: 2, hours: 2 },
        'ISLM104': { code: 'ISLM104', name_ar: 'النظام الاجتماعي وحقوق الإنسان', name_en: 'Social System and Human Rights', difficulty: 2, hours: 2 },
        
        // مقررات المعلوماتية الصحية
        'BIO101': { code: 'BIO101', name_ar: 'المصطلحات الطبية الأساسية', name_en: 'Basic Medical Terminology', difficulty: 3, hours: 3 },
        'BIO102': { code: 'BIO102', name_ar: 'مقدمة في علم التشريح وعلم وظائف الأعضاء', name_en: 'Introduction to Anatomy and Physiology', difficulty: 4, hours: 3 },
        'HCM101': { code: 'HCM101', name_ar: 'إدارة الرعاية الصحية', name_en: 'Health Care Management', difficulty: 3, hours: 3 },
        'HCM102': { code: 'HCM102', name_ar: 'السلوك التنظيمي', name_en: 'Organizational Behavior', difficulty: 3, hours: 3 },
        'HCM113': { code: 'HCM113', name_ar: 'السياسة الصحية ونظام الرعاية الصحية السعودي', name_en: 'Health Policy and Saudi Healthcare System', difficulty: 3, hours: 3 },
        'HCM213': { code: 'HCM213', name_ar: 'الإدارة المالية للرعاية الصحية', name_en: 'Financial Management for Healthcare', difficulty: 4, hours: 3 },
        'PHC121': { code: 'PHC121', name_ar: 'مقدمة في الإحصاء الحيوي', name_en: 'Introduction to Biostatistics', difficulty: 4, hours: 3 },
        'PHC131': { code: 'PHC131', name_ar: 'مقدمة في علم الأوبئة', name_en: 'Introduction to Epidemiology', difficulty: 4, hours: 3 },
        'PHC212': { code: 'PHC212', name_ar: 'مفاهيم التثقيف والتعزيز الصحي', name_en: 'Concepts of Health Education and Promotion', difficulty: 3, hours: 3 },
        'PHC215': { code: 'PHC215', name_ar: 'طرق البحث في الرعاية الصحية', name_en: 'Healthcare Research Methods', difficulty: 4, hours: 3 },
        'PHC216': { code: 'PHC216', name_ar: 'الأخلاقيات واللوائح في الرعاية الصحية', name_en: 'Ethics & Regulations in Healthcare', difficulty: 3, hours: 3 },
        'PHC312': { code: 'PHC312', name_ar: 'الاتصالات الصحية', name_en: 'Health Communications', difficulty: 3, hours: 3 },
        
        // مقررات تقنية المعلومات
        'IT231': { code: 'IT231', name_ar: 'مقدمة في تقنية المعلومات ونظم المعلومات', name_en: 'Introduction to IT and IS', difficulty: 3, hours: 3 },
        'IT232': { code: 'IT232', name_ar: 'البرمجة الكائنية التوجه', name_en: 'Object Oriented Programming', difficulty: 4, hours: 3 },
        'IT233': { code: 'IT233', name_ar: 'تنظيم الحاسب', name_en: 'Computer Organization', difficulty: 4, hours: 3 },
        'IT241': { code: 'IT241', name_ar: 'أنظمة التشغيل', name_en: 'Operating Systems', difficulty: 4, hours: 3 },
        'IT244': { code: 'IT244', name_ar: 'مقدمة في قواعد البيانات', name_en: 'Introduction to Database', difficulty: 4, hours: 3 },
        'IT245': { code: 'IT245', name_ar: 'هياكل البيانات', name_en: 'Data Structure', difficulty: 4, hours: 3 },
        'IT351': { code: 'IT351', name_ar: 'شبكات الحاسب', name_en: 'Computer Networks', difficulty: 4, hours: 3 },
        'IT352': { code: 'IT352', name_ar: 'التفاعل بين الإنسان والحاسب', name_en: 'Human Computer Interaction', difficulty: 3, hours: 3 },
        'IT353': { code: 'IT353', name_ar: 'تحليل وتصميم النظم', name_en: 'System Analysis and Design', difficulty: 4, hours: 3 },
        'IT354': { code: 'IT354', name_ar: 'نظم إدارة قواعد البيانات', name_en: 'Database Management Systems', difficulty: 4, hours: 3 },
        'IT361': { code: 'IT361', name_ar: 'تقنيات الويب', name_en: 'Web Technologies', difficulty: 3, hours: 3 },
        'IT362': { code: 'IT362', name_ar: 'إدارة مشاريع تقنية المعلومات', name_en: 'IT Project Management', difficulty: 4, hours: 3 },
        'IT363': { code: 'IT363', name_ar: 'إدارة الشبكات', name_en: 'Network Management', difficulty: 4, hours: 3 },
        'IT364': { code: 'IT364', name_ar: 'ريادة الأعمال والابتكار في تقنية المعلومات', name_en: 'IT Entrepreneurship and Innovation', difficulty: 3, hours: 3 },
        'IT365': { code: 'IT365', name_ar: 'أنظمة المؤسسات', name_en: 'Enterprise Systems', difficulty: 4, hours: 3 },
        'IT470': { code: 'IT470', name_ar: 'مقدمة في إنترنت الأشياء', name_en: 'Introduction to IoT', difficulty: 4, hours: 3 },
        'IT471': { code: 'IT471', name_ar: 'مقدمة في الحوسبة السحابية', name_en: 'Introduction to Cloud Computing', difficulty: 4, hours: 3 },
        'IT472': { code: 'IT472', name_ar: 'تصميم شبكات إنترنت الأشياء', name_en: 'IoT Network Design', difficulty: 5, hours: 3 },
        'IT473': { code: 'IT473', name_ar: 'بنية أنظمة السحابة', name_en: 'Cloud Systems Architecture', difficulty: 5, hours: 3 },
        'IT474': { code: 'IT474', name_ar: 'مقدمة في الأمن السيبراني والجريمة الرقمية', name_en: 'Introduction to Cyber Security and Digital Crime', difficulty: 4, hours: 3 },
        'IT475': { code: 'IT475', name_ar: 'نظم دعم القرار', name_en: 'Decision Support Systems', difficulty: 4, hours: 3 },
        'IT476': { code: 'IT476', name_ar: 'أمن تقنية المعلومات والسياسات', name_en: 'IT Security & Policies', difficulty: 4, hours: 3 },
        'IT478': { code: 'IT478', name_ar: 'أمن الشبكات', name_en: 'Network Security', difficulty: 5, hours: 3 },
        'IT479': { code: 'IT479', name_ar: 'مشروع التخرج I', name_en: 'Senior Project I', difficulty: 5, hours: 3 },
        'IT480': { code: 'IT480', name_ar: 'إنترنت الأشياء للمؤسسات', name_en: 'Enterprise Internet of Things', difficulty: 5, hours: 3 },
        'IT481': { code: 'IT481', name_ar: 'أمن السحابة', name_en: 'Cloud Security', difficulty: 5, hours: 3 },
        'IT482': { code: 'IT482', name_ar: 'أمن وخصوصية إنترنت الأشياء', name_en: 'IoT Security and Privacy', difficulty: 5, hours: 3 },
        'IT483': { code: 'IT483', name_ar: 'إدارة أنظمة السحابة', name_en: 'Cloud System Administration', difficulty: 5, hours: 3 },
        'IT484': { code: 'IT484', name_ar: 'شبكات الاستشعار اللاسلكية', name_en: 'Wireless Sensor Networks', difficulty: 5, hours: 3 },
        'IT485': { code: 'IT485', name_ar: 'الأخلاقيات المهنية في تقنية المعلومات', name_en: 'Professional Ethics in IT', difficulty: 3, hours: 3 },
        'IT487': { code: 'IT487', name_ar: 'تطوير تطبيقات الجوال', name_en: 'Mobile Application Development', difficulty: 4, hours: 3 },
        'IT488': { code: 'IT488', name_ar: 'الطب الشرعي السيبراني', name_en: 'Cyber Forensics', difficulty: 5, hours: 3 },
        'IT489': { code: 'IT489', name_ar: 'مشروع التخرج II', name_en: 'Senior Project II', difficulty: 5, hours: 3 },
        'IT490': { code: 'IT490', name_ar: 'التدريب العملي', name_en: 'Practical Training', difficulty: 3, hours: 6 },
        'IT499': { code: 'IT499', name_ar: 'التدريب العملي', name_en: 'Practical Training', difficulty: 3, hours: 6 },
        
        // مقررات المعلوماتية الصحية
        'HCI111': { code: 'HCI111', name_ar: 'مقدمة في المعلوماتية الصحية', name_en: 'Introduction to Health Informatics', difficulty: 3, hours: 3 },
        'HCI112': { code: 'HCI112', name_ar: 'السجلات الصحية الإلكترونية', name_en: 'Electronic Health Records', difficulty: 4, hours: 3 },
        'HCI213': { code: 'HCI213', name_ar: 'الترميز الطبي والفوترة', name_en: 'Medical Coding and Billing', difficulty: 4, hours: 3 },
        'HCI214': { code: 'HCI214', name_ar: 'المعلوماتية الصحية للمستهلك', name_en: 'Consumer Health Informatics', difficulty: 3, hours: 3 },
        'HCI314': { code: 'HCI314', name_ar: 'معلوماتية الصحة العامة', name_en: 'Public Health Informatics', difficulty: 4, hours: 3 },
        'HCI315': { code: 'HCI315', name_ar: 'الصحة والطب عن بعد', name_en: 'Telehealth and Telemedicine', difficulty: 4, hours: 3 },
        'HCI316': { code: 'HCI316', name_ar: 'الصحة الإلكترونية', name_en: 'E-Health', difficulty: 4, hours: 3 },
        
        // مقررات الصحة العامة
        'BIOL101': { code: 'BIOL101', name_ar: 'المصطلحات الطبية الأساسية', name_en: 'Basic Medical Terminology', difficulty: 3, hours: 3 },
        'BIOL102': { code: 'BIOL102', name_ar: 'مقدمة في علم التشريح وعلم وظائف الأعضاء', name_en: 'Introduction to Anatomy and Physiology', difficulty: 4, hours: 3 },
        'BIOL103': { code: 'BIOL103', name_ar: 'مبادئ علم الأحياء الدقيقة للصحة العامة', name_en: 'Principles of Microbiology for Public Health', difficulty: 4, hours: 3 },
        'PHC101': { code: 'PHC101', name_ar: 'مقدمة في الصحة العامة', name_en: 'Introduction to Public Health', difficulty: 2, hours: 3 },
        'PHC151': { code: 'PHC151', name_ar: 'الصحة البيئية', name_en: 'Environmental Health', difficulty: 3, hours: 3 },
        'PHC181': { code: 'PHC181', name_ar: 'علم اجتماع الصحة والمرض والرعاية الصحية', name_en: 'Sociology of Health, Illness and Healthcare', difficulty: 3, hours: 3 },
        'PHC231': { code: 'PHC231', name_ar: 'مقدمة في علم أوبئة المستشفيات', name_en: 'Introduction to Hospital Epidemiology', difficulty: 4, hours: 3 },
        'PHC241': { code: 'PHC241', name_ar: 'المفاهيم الأساسية في الغذاء والتغذية', name_en: 'Fundamental Concepts in Food and Nutrition', difficulty: 3, hours: 3 },
        'PHC261': { code: 'PHC261', name_ar: 'الصحة المهنية', name_en: 'Occupational Health', difficulty: 3, hours: 3 },
        'PHC271': { code: 'PHC271', name_ar: 'مقدمة في الأمراض', name_en: 'Introduction to Disease', difficulty: 4, hours: 3 },
        'PHC273': { code: 'PHC273', name_ar: 'مقدمة في الصحة النفسية', name_en: 'Introduction to Mental Health', difficulty: 3, hours: 3 },
        'PHC274': { code: 'PHC274', name_ar: 'التخطيط الصحي', name_en: 'Health Planning', difficulty: 4, hours: 3 },
        'PHC281': { code: 'PHC281', name_ar: 'السلوك الصحي', name_en: 'Health Behavior', difficulty: 3, hours: 3 },
        'PHC311': { code: 'PHC311', name_ar: 'الصحة العالمية', name_en: 'Global Health', difficulty: 4, hours: 3 },
        'PHC313': { code: 'PHC313', name_ar: 'إصابات حوادث المرور والوقاية من الإعاقة', name_en: 'Road Traffic Injuries and Disability Prevention', difficulty: 3, hours: 3 },
        'PHC314': { code: 'PHC314', name_ar: 'المجتمع والإدمان', name_en: 'Society and Addiction', difficulty: 3, hours: 3 },
        'PHC315': { code: 'PHC315', name_ar: 'تقييم برامج الصحة العامة', name_en: 'Public Health Program Evaluation', difficulty: 4, hours: 3 },
        'PHC321': { code: 'PHC321', name_ar: 'الإحصاء الحيوي التطبيقي', name_en: 'Applied Biostatistics', difficulty: 5, hours: 3 },
        'PHC331': { code: 'PHC331', name_ar: 'علم أوبئة الأمراض المزمنة والوقاية منها', name_en: 'Chronic Disease Epidemiology and Prevention', difficulty: 4, hours: 3 },
        'PHC332': { code: 'PHC332', name_ar: 'علم الأوبئة المتقدم', name_en: 'Advanced Epidemiology', difficulty: 5, hours: 3 },
        'PHC335': { code: 'PHC335', name_ar: 'خطر الإصابة بالسرطان والوقاية منه', name_en: 'Cancer Risk and Prevention', difficulty: 4, hours: 3 },
        'PHC351': { code: 'PHC351', name_ar: 'تقييم المخاطر الصحية والبيئية', name_en: 'Health and Environmental Risk Assessment', difficulty: 4, hours: 3 },
        'PHC361': { code: 'PHC361', name_ar: 'أساسيات السلامة', name_en: 'Safety Fundamentals', difficulty: 3, hours: 3 },
        'PHC362': { code: 'PHC362', name_ar: 'تعزيز الصحة في مكان العمل', name_en: 'Workplace Health Promotion', difficulty: 3, hours: 3 },
        'PHC372': { code: 'PHC372', name_ar: 'تفشي الصحة العامة وإدارة الكوارث', name_en: 'Public Health Outbreak and Disaster Management', difficulty: 4, hours: 3 },
        'PHC373': { code: 'PHC373', name_ar: 'صحة الأم والطفل', name_en: 'Maternal and Child Health', difficulty: 3, hours: 3 },
        'PHC374': { code: 'PHC374', name_ar: 'تعزيز صحة الفم', name_en: 'Oral Health Promotion', difficulty: 3, hours: 3 },
        'PHC375': { code: 'PHC375', name_ar: 'تعزيز النشاط البدني والصحة', name_en: 'Promoting Physical Activity and Health', difficulty: 3, hours: 3 },
        'PHC376': { code: 'PHC376', name_ar: 'تعزيز الصحة والحياة اللاحقة', name_en: 'Health Promotion and Later Life', difficulty: 3, hours: 3 },
        
        // مقررات إضافية
        'MATH150': { code: 'MATH150', name_ar: 'الرياضيات المنفصلة', name_en: 'Discrete Mathematics', difficulty: 4, hours: 3 },
        'MATH251': { code: 'MATH251', name_ar: 'الجبر الخطي', name_en: 'Linear Algebra', difficulty: 4, hours: 3 },
        'STAT101': { code: 'STAT101', name_ar: 'الإحصاء', name_en: 'Statistics', difficulty: 3, hours: 3 },
        'STAT201': { code: 'STAT201', name_ar: 'إحصاء الأعمال II', name_en: 'Business Statistics II', difficulty: 4, hours: 3 },
        'STAT202': { code: 'STAT202', name_ar: 'الإحصاء', name_en: 'Statistics', difficulty: 3, hours: 3 },
        'SCI101': { code: 'SCI101', name_ar: 'الفيزياء العامة 1', name_en: 'General Physics 1', difficulty: 4, hours: 3 },
        'SCI201': { code: 'SCI201', name_ar: 'الفيزياء العامة 2', name_en: 'General Physics 2', difficulty: 4, hours: 3 },
        
        // مقررات علوم البيانات (Data Science)
        'DS230': { code: 'DS230', name_ar: 'البرمجة الكائنية التوجه', name_en: 'Object Oriented Programming', difficulty: 4, hours: 3 },
        'DS231': { code: 'DS231', name_ar: 'مقدمة في برمجة علوم البيانات', name_en: 'Introduction to Data Science Programming', difficulty: 3, hours: 3 },
        'DS240': { code: 'DS240', name_ar: 'هياكل البيانات', name_en: 'Data Structure', difficulty: 4, hours: 3 },
        'DS242': { code: 'DS242', name_ar: 'برمجة علوم البيانات المتقدمة', name_en: 'Advanced Data Science Programming', difficulty: 4, hours: 3 },
        'DS243': { code: 'DS243', name_ar: 'معمارية وتنظيم الحاسب', name_en: 'Computer Architecture and Organization', difficulty: 4, hours: 3 },
        'DS350': { code: 'DS350', name_ar: 'مقدمة في قواعد البيانات', name_en: 'Introduction to Database', difficulty: 4, hours: 3 },
        'DS351': { code: 'DS351', name_ar: 'أنظمة التشغيل', name_en: 'Operating Systems', difficulty: 4, hours: 3 },
        'DS352': { code: 'DS352', name_ar: 'تصميم وتحليل الخوارزميات', name_en: 'Design and Analysis of Algorithms', difficulty: 5, hours: 3 },
        'DS353': { code: 'DS353', name_ar: 'إدارة المشاريع في الحوسبة', name_en: 'Project Management in Computing', difficulty: 3, hours: 3 },
        'DS360': { code: 'DS360', name_ar: 'شبكات الحاسب', name_en: 'Computer Networks', difficulty: 4, hours: 3 },
        'DS361': { code: 'DS361', name_ar: 'تحليل وتصميم النظم', name_en: 'System Analysis and Design', difficulty: 4, hours: 3 },
        'DS362': { code: 'DS362', name_ar: 'برمجة الويب', name_en: 'Web Programming', difficulty: 3, hours: 3 },
        'DS363': { code: 'DS363', name_ar: 'الذكاء الاصطناعي', name_en: 'Artificial Intelligence', difficulty: 5, hours: 3 },
        'DS364': { code: 'DS364', name_ar: 'إدارة وتنظيم البيانات', name_en: 'Data Curation (Management and Organization)', difficulty: 4, hours: 3 },
        'DS470': { code: 'DS470', name_ar: 'أمن وخصوصية البيانات', name_en: 'Data Security and Privacy', difficulty: 4, hours: 3 },
        'DS471': { code: 'DS471', name_ar: 'تعلم الآلة', name_en: 'Machine Learning', difficulty: 5, hours: 3 },
        'DS472': { code: 'DS472', name_ar: 'تنقيب البيانات', name_en: 'Data Mining', difficulty: 5, hours: 3 },
        'DS473': { code: 'DS473', name_ar: 'رؤية الحاسب', name_en: 'Computer Vision', difficulty: 5, hours: 3 },
        'DS474': { code: 'DS474', name_ar: 'نظم دعم القرار', name_en: 'Decision Support Systems', difficulty: 4, hours: 3 },
        'DS475': { code: 'DS475', name_ar: 'نمذجة البيانات الضخمة', name_en: 'Big Data Modeling', difficulty: 5, hours: 3 },
        'DS476': { code: 'DS476', name_ar: 'تكامل ومعالجة البيانات الضخمة', name_en: 'Big Data Integration and Processing', difficulty: 5, hours: 3 },
        'DS479': { code: 'DS479', name_ar: 'مشروع التخرج', name_en: 'Senior Project', difficulty: 5, hours: 3 },
        'DS480': { code: 'DS480', name_ar: 'تصور البيانات', name_en: 'Data Visualization', difficulty: 4, hours: 3 },
        'DS481': { code: 'DS481', name_ar: 'الأخلاقيات المهنية في علوم البيانات', name_en: 'Professional Ethics in Data Science', difficulty: 3, hours: 3 },
        'DS482': { code: 'DS482', name_ar: 'التعلم العميق', name_en: 'Deep Learning', difficulty: 5, hours: 3 },
        'DS483': { code: 'DS483', name_ar: 'معالجة اللغات الطبيعية', name_en: 'Natural Language Processing', difficulty: 5, hours: 3 },
        'DS484': { code: 'DS484', name_ar: 'تحسين البيانات الضخمة', name_en: 'Big Data Optimization', difficulty: 5, hours: 3 }
    }
};

console.log('✅ SEU Complete Data loaded');
console.log(`📚 ${Object.keys(SEU_COMPLETE_DATA.majors).length} majors loaded`);
console.log(`📖 ${Object.keys(SEU_COMPLETE_DATA.courses).length} courses loaded`);
