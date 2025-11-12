// SEU Majors and Courses Data - الجامعة السعودية الإلكترونية
const MAJORS_DATA = {
    // كلية العلوم الصحية - تخصص المعلوماتية الصحية
    1: {
        id: 1,
        name_ar: 'المعلوماتية الصحية',
        name_en: 'Health Informatics',
        college_ar: 'كلية العلوم الصحية',
        college_en: 'College of Health Sciences',
        courses: [
            { id: 101, code: 'ENG001', name_ar: 'مهارات اللغة الإنجليزية', name_en: 'English Language Skills', difficulty_level: 2, credit_hours: 3 },
            { id: 102, code: 'CS001', name_ar: 'مهارات الحاسب الآلي', name_en: 'Computer Skills', difficulty_level: 1, credit_hours: 3 },
            { id: 103, code: 'COMM101', name_ar: 'مهارات الاتصال', name_en: 'Communication Skills', difficulty_level: 2, credit_hours: 3 },
            { id: 104, code: 'ENG102', name_ar: 'مهارات اللغة الإنجليزية II', name_en: 'English Language Skills II', difficulty_level: 2, credit_hours: 3 },
            { id: 105, code: 'MATH001', name_ar: 'مقدمة في الرياضيات', name_en: 'Introduction to Mathematics', difficulty_level: 3, credit_hours: 3 },
            { id: 106, code: 'CI001', name_ar: 'المهارات الأكاديمية', name_en: 'Academic Skills', difficulty_level: 2, credit_hours: 3 },
            { id: 107, code: 'BIO101', name_ar: 'المصطلحات الطبية الأساسية', name_en: 'Basic Medical Terminology', difficulty_level: 3, credit_hours: 3 },
            { id: 108, code: 'HCM101', name_ar: 'إدارة الرعاية الصحية', name_en: 'Health Care Management', difficulty_level: 3, credit_hours: 3 },
            { id: 109, code: 'HCM102', name_ar: 'السلوك التنظيمي', name_en: 'Organizational Behavior', difficulty_level: 3, credit_hours: 3 },
            { id: 110, code: 'PHC121', name_ar: 'مقدمة في الإحصاء الحيوي', name_en: 'Introduction to Biostatistics', difficulty_level: 4, credit_hours: 3 },
            { id: 111, code: 'IT231', name_ar: 'مقدمة في تقنية المعلومات ونظم المعلومات', name_en: 'Introduction to IT and Information Systems', difficulty_level: 3, credit_hours: 3 },
            { id: 112, code: 'IT232', name_ar: 'البرمجة الكائنية التوجه', name_en: 'Object Oriented Programming', difficulty_level: 4, credit_hours: 3 },
            { id: 113, code: 'BIO102', name_ar: 'مقدمة في علم التشريح وعلم وظائف الأعضاء', name_en: 'Introduction to Anatomy and Physiology', difficulty_level: 4, credit_hours: 3 },
            { id: 114, code: 'IT244', name_ar: 'مقدمة في قواعد البيانات', name_en: 'Introduction to Database', difficulty_level: 4, credit_hours: 3 },
            { id: 115, code: 'IT245', name_ar: 'هياكل البيانات', name_en: 'Data Structure', difficulty_level: 4, credit_hours: 3 },
            { id: 116, code: 'PHC131', name_ar: 'مقدمة في علم الأوبئة', name_en: 'Introduction to Epidemiology', difficulty_level: 4, credit_hours: 3 },
            { id: 117, code: 'HCM113', name_ar: 'السياسة الصحية ونظام الرعاية الصحية السعودي', name_en: 'Health Policy and Saudi Healthcare System', difficulty_level: 3, credit_hours: 3 },
            { id: 118, code: 'ISLM101', name_ar: 'مقدمة في الثقافة الإسلامية I', name_en: 'Introduction to Islamic Culture I', difficulty_level: 2, credit_hours: 2 },
            { id: 119, code: 'PHC212', name_ar: 'مفاهيم التثقيف والتعزيز الصحي', name_en: 'Concepts of Health Education and Promotion', difficulty_level: 3, credit_hours: 3 },
            { id: 120, code: 'IT351', name_ar: 'شبكات الحاسب', name_en: 'Computer Networks', difficulty_level: 4, credit_hours: 3 },
            { id: 121, code: 'IT352', name_ar: 'التفاعل بين الإنسان والحاسب', name_en: 'Human Computer Interaction', difficulty_level: 3, credit_hours: 3 },
            { id: 122, code: 'HCI111', name_ar: 'مقدمة في المعلوماتية الصحية', name_en: 'Introduction to Health Informatics', difficulty_level: 3, credit_hours: 3 },
            { id: 123, code: 'ISLM102', name_ar: 'السلوك المهني والأخلاق في الإسلام', name_en: 'Professional Conduct & Ethics in Islam', difficulty_level: 2, credit_hours: 2 },
            { id: 124, code: 'IT353', name_ar: 'تحليل وتصميم النظم', name_en: 'System Analysis and Design', difficulty_level: 4, credit_hours: 3 },
            { id: 125, code: 'HCM213', name_ar: 'الإدارة المالية للرعاية الصحية', name_en: 'Financial Management for Healthcare', difficulty_level: 4, credit_hours: 3 },
            { id: 126, code: 'PHC215', name_ar: 'طرق البحث في الرعاية الصحية', name_en: 'Healthcare Research Methods', difficulty_level: 4, credit_hours: 3 },
            { id: 127, code: 'IT362', name_ar: 'إدارة مشاريع تقنية المعلومات', name_en: 'IT Project Management', difficulty_level: 4, credit_hours: 3 },
            { id: 128, code: 'PHC216', name_ar: 'الأخلاقيات واللوائح في الرعاية الصحية', name_en: 'Ethics & Regulations in Healthcare', difficulty_level: 3, credit_hours: 3 },
            { id: 129, code: 'HCI112', name_ar: 'السجلات الصحية الإلكترونية', name_en: 'Electronic Health Records', difficulty_level: 4, credit_hours: 3 },
            { id: 130, code: 'IT361', name_ar: 'تقنيات الويب', name_en: 'Web Technologies', difficulty_level: 3, credit_hours: 3 },
            { id: 131, code: 'IT475', name_ar: 'نظم دعم القرار', name_en: 'Decision Support Systems', difficulty_level: 4, credit_hours: 3 },
            { id: 132, code: 'IT476', name_ar: 'أمن تقنية المعلومات والسياسات', name_en: 'IT Security & Policies', difficulty_level: 4, credit_hours: 3 },
            { id: 133, code: 'HCI214', name_ar: 'المعلوماتية الصحية للمستهلك', name_en: 'Consumer Health Informatics', difficulty_level: 3, credit_hours: 3 },
            { id: 134, code: 'ISLM103', name_ar: 'النظام الاقتصادي الإسلامي', name_en: 'Islamic Economic System', difficulty_level: 2, credit_hours: 2 },
            { id: 135, code: 'HCI213', name_ar: 'الترميز الطبي والفوترة', name_en: 'Medical Coding and Billing', difficulty_level: 4, credit_hours: 3 },
            { id: 136, code: 'PHC312', name_ar: 'الاتصالات الصحية', name_en: 'Health Communications', difficulty_level: 3, credit_hours: 3 },
            { id: 137, code: 'HCI315', name_ar: 'الصحة والطب عن بعد', name_en: 'Telehealth and Telemedicine', difficulty_level: 4, credit_hours: 3 },
            { id: 138, code: 'HCI316', name_ar: 'الصحة الإلكترونية', name_en: 'E-Health', difficulty_level: 4, credit_hours: 3 },
            { id: 139, code: 'HCI314', name_ar: 'معلوماتية الصحة العامة', name_en: 'Public Health Informatics', difficulty_level: 4, credit_hours: 3 },
            { id: 140, code: 'ISLM104', name_ar: 'النظام الاجتماعي وحقوق الإنسان', name_en: 'Social System and Human Rights', difficulty_level: 2, credit_hours: 2 }
        ]
    },
    // كلية العلوم الصحية - تخصص الصحة العامة
    2: {
        id: 2,
        name_ar: 'الصحة العامة',
        name_en: 'Public Health',
        college_ar: 'كلية العلوم الصحية',
        college_en: 'College of Health Sciences',
        courses: [
            { id: 201, code: 'ENG001', name_ar: 'مهارات اللغة الإنجليزية', name_en: 'English Language Skills', difficulty_level: 2, credit_hours: 3 },
            { id: 202, code: 'CS001', name_ar: 'مهارات الحاسب الآلي', name_en: 'Computer Skills', difficulty_level: 1, credit_hours: 3 },
            { id: 203, code: 'COMM101', name_ar: 'مهارات الاتصال', name_en: 'Communication Skills', difficulty_level: 2, credit_hours: 3 },
            { id: 204, code: 'ENG102', name_ar: 'مهارات اللغة الإنجليزية II', name_en: 'English Language Skills II', difficulty_level: 2, credit_hours: 3 },
            { id: 205, code: 'MATH001', name_ar: 'مقدمة في الرياضيات', name_en: 'Introduction to Mathematics', difficulty_level: 3, credit_hours: 3 },
            { id: 206, code: 'CI001', name_ar: 'المهارات الأكاديمية', name_en: 'Academic Skills', difficulty_level: 2, credit_hours: 3 },
            { id: 207, code: 'BIOL101', name_ar: 'المصطلحات الطبية الأساسية', name_en: 'Basic Medical Terminology', difficulty_level: 3, credit_hours: 3 },
            { id: 208, code: 'ISLM101', name_ar: 'مقدمة في الثقافة الإسلامية I', name_en: 'Introduction to Islamic Culture I', difficulty_level: 2, credit_hours: 2 },
            { id: 209, code: 'HCM101', name_ar: 'إدارة الرعاية الصحية', name_en: 'Health Care Management', difficulty_level: 3, credit_hours: 3 },
            { id: 210, code: 'PHC121', name_ar: 'مقدمة في الإحصاء الحيوي', name_en: 'Introduction to Biostatistics', difficulty_level: 4, credit_hours: 3 },
            { id: 211, code: 'PHC101', name_ar: 'مقدمة في الصحة العامة', name_en: 'Introduction to Public Health', difficulty_level: 2, credit_hours: 3 },
            { id: 212, code: 'HCM102', name_ar: 'السلوك التنظيمي', name_en: 'Organizational Behavior', difficulty_level: 3, credit_hours: 3 },
            { id: 213, code: 'BIOL102', name_ar: 'مقدمة في علم التشريح وعلم وظائف الأعضاء', name_en: 'Introduction to Anatomy and Physiology', difficulty_level: 4, credit_hours: 3 },
            { id: 214, code: 'BIOL103', name_ar: 'مبادئ علم الأحياء الدقيقة للصحة العامة', name_en: 'Principles of Microbiology for Public Health', difficulty_level: 4, credit_hours: 3 },
            { id: 215, code: 'HCM113', name_ar: 'السياسة الصحية ونظام الرعاية الصحية السعودي', name_en: 'Health Policy & Saudi Healthcare System', difficulty_level: 3, credit_hours: 3 },
            { id: 216, code: 'PHC131', name_ar: 'مقدمة في علم الأوبئة', name_en: 'Introduction to Epidemiology', difficulty_level: 4, credit_hours: 3 },
            { id: 217, code: 'PHC151', name_ar: 'الصحة البيئية', name_en: 'Environmental Health', difficulty_level: 3, credit_hours: 3 },
            { id: 218, code: 'PHC181', name_ar: 'علم اجتماع الصحة والمرض والرعاية الصحية', name_en: 'Sociology of Health, Illness and Healthcare', difficulty_level: 3, credit_hours: 3 },
            { id: 219, code: 'PHC212', name_ar: 'مفاهيم التثقيف والتعزيز الصحي', name_en: 'Concepts of Health Education and Promotion', difficulty_level: 3, credit_hours: 3 },
            { id: 220, code: 'PHC241', name_ar: 'المفاهيم الأساسية في الغذاء والتغذية', name_en: 'Fundamental Concepts in Food and Nutrition', difficulty_level: 3, credit_hours: 3 },
            { id: 221, code: 'PHC261', name_ar: 'الصحة المهنية', name_en: 'Occupational Health', difficulty_level: 3, credit_hours: 3 },
            { id: 222, code: 'PHC271', name_ar: 'مقدمة في الأمراض', name_en: 'Introduction to Disease', difficulty_level: 4, credit_hours: 3 },
            { id: 223, code: 'PHC281', name_ar: 'السلوك الصحي', name_en: 'Health Behavior', difficulty_level: 3, credit_hours: 3 },
            { id: 224, code: 'ISLM102', name_ar: 'مقدمة في الثقافة الإسلامية II', name_en: 'Introduction to Islamic Culture II', difficulty_level: 2, credit_hours: 2 },
            { id: 225, code: 'HCM213', name_ar: 'الإدارة المالية للرعاية الصحية', name_en: 'Financial Management for Healthcare', difficulty_level: 4, credit_hours: 3 },
            { id: 226, code: 'PHC215', name_ar: 'طرق وتحليل البحث في الرعاية الصحية', name_en: 'Healthcare Research Methods and Analysis', difficulty_level: 4, credit_hours: 3 },
            { id: 227, code: 'PHC216', name_ar: 'الأخلاقيات واللوائح في الرعاية الصحية', name_en: 'Ethics and Regulation in Health Care', difficulty_level: 3, credit_hours: 3 },
            { id: 228, code: 'PHC231', name_ar: 'مقدمة في علم أوبئة المستشفيات', name_en: 'Introduction to Hospital Epidemiology', difficulty_level: 4, credit_hours: 3 },
            { id: 229, code: 'PHC273', name_ar: 'مقدمة في الصحة النفسية', name_en: 'Introduction to Mental Health', difficulty_level: 3, credit_hours: 3 },
            { id: 230, code: 'PHC274', name_ar: 'التخطيط الصحي', name_en: 'Health Planning', difficulty_level: 4, credit_hours: 3 },
            { id: 231, code: 'ISLM103', name_ar: 'مقدمة في الثقافة الإسلامية III', name_en: 'Introduction to Islamic Culture III', difficulty_level: 2, credit_hours: 2 },
            { id: 232, code: 'PHC311', name_ar: 'الصحة العالمية', name_en: 'Global Health', difficulty_level: 4, credit_hours: 3 },
            { id: 233, code: 'PHC312', name_ar: 'الاتصالات الصحية', name_en: 'Health Communication', difficulty_level: 3, credit_hours: 3 },
            { id: 234, code: 'PHC313', name_ar: 'إصابات حوادث المرور والوقاية من الإعاقة', name_en: 'Road Traffic Injuries and Disability Prevention', difficulty_level: 3, credit_hours: 3 },
            { id: 235, code: 'PHC331', name_ar: 'علم أوبئة الأمراض المزمنة والوقاية منها', name_en: 'Chronic Disease Epidemiology and Prevention', difficulty_level: 4, credit_hours: 3 },
            { id: 236, code: 'PHC372', name_ar: 'تفشي الصحة العامة وإدارة الكوارث', name_en: 'Public Health Outbreak and Disaster Management', difficulty_level: 4, credit_hours: 3 },
            { id: 237, code: 'PHC373', name_ar: 'صحة الأم والطفل', name_en: 'Maternal and Child Health', difficulty_level: 3, credit_hours: 3 },
            { id: 238, code: 'PHC374', name_ar: 'تعزيز صحة الفم', name_en: 'Oral Health Promotion', difficulty_level: 3, credit_hours: 3 },
            { id: 239, code: 'PHC314', name_ar: 'المجتمع والإدمان', name_en: 'Society and Addiction', difficulty_level: 3, credit_hours: 3 },
            { id: 240, code: 'ISLM104', name_ar: 'مقدمة في الثقافة الإسلامية IV', name_en: 'Introduction to Islamic Culture IV', difficulty_level: 2, credit_hours: 2 },
            { id: 241, code: 'PHC321', name_ar: 'الإحصاء الحيوي التطبيقي', name_en: 'Applied Biostatistics', difficulty_level: 5, credit_hours: 3 },
            { id: 242, code: 'PHC332', name_ar: 'علم الأوبئة المتقدم', name_en: 'Advanced Epidemiology', difficulty_level: 5, credit_hours: 3 },
            { id: 243, code: 'PHC335', name_ar: 'خطر الإصابة بالسرطان والوقاية منه', name_en: 'Cancer Risk and Prevention', difficulty_level: 4, credit_hours: 3 },
            { id: 244, code: 'PHC351', name_ar: 'تقييم المخاطر الصحية والبيئية', name_en: 'Health and Environmental Risk Assessment', difficulty_level: 4, credit_hours: 3 },
            { id: 245, code: 'PHC361', name_ar: 'أساسيات السلامة', name_en: 'Safety Fundamentals', difficulty_level: 3, credit_hours: 3 },
            { id: 246, code: 'PHC362', name_ar: 'تعزيز الصحة في مكان العمل', name_en: 'Workplace Health Promotion', difficulty_level: 3, credit_hours: 3 },
            { id: 247, code: 'PHC315', name_ar: 'تقييم برامج الصحة العامة', name_en: 'Public Health Program Evaluation', difficulty_level: 4, credit_hours: 3 },
            { id: 248, code: 'PHC375', name_ar: 'تعزيز النشاط البدني والصحة', name_en: 'Promoting Physical Activity and Health', difficulty_level: 3, credit_hours: 3 },
            { id: 249, code: 'PHC376', name_ar: 'تعزيز الصحة والحياة اللاحقة', name_en: 'Health Promotion and Later Life', difficulty_level: 3, credit_hours: 3 }
        ]
    }
};

// Helper function
function getAllMajors() {
    return Object.values(MAJORS_DATA);
}

function getCoursesByMajor(majorId) {
    return MAJORS_DATA[majorId]?.courses || [];
}

console.log('✅ Majors data loaded successfully');
console.log(`Found ${Object.keys(MAJORS_DATA).length} majors`);
