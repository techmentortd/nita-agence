// Dictionnaire de traduction FR/AR — module sans dépendance React (peut être
// réutilisé tel quel par un futur script Node, ex. prérendu SEO).
// Convention : clé plate, même clé présente dans fr et ar.
export const TR = {
  fr: {
    tagline: "Le transfert le plus fiable au Tchad",

    // Navigation
    nav_home: 'Accueil',
    nav_map: 'Carte des agences',
    nav_calc: 'Calculatrice',
    nav_about: 'À propos',
    nav_admin: 'Admin',
    nav_logout: 'Déconnexion',
    nav_admin_space: 'Espace administrateur',

    // Réglages (langue / thème)
    settings_theme: 'Thème',
    settings_light: 'Clair',
    settings_dark: 'Sombre',
    settings_auto: 'Auto',
    settings_language: 'Langue',
    settings_lang_auto_tag: 'détecté automatiquement',

    // Footer
    footer_brand: "NITA — Le transfert le plus fiable au Tchad",
    footer_location: "N'Djamena, Tchad",

    // Accueil
    home_h1_before: "Trouvez l'agence",
    home_h1_after: 'la plus proche',
    home_sub: "Localisation en temps réel, itinéraire et informations pratiques pour toutes les agences NITA de N'Djamena.",
    home_search_ph: 'Rechercher un quartier, une agence…',
    home_btn_map: 'Voir la carte',
    home_stat_agences: "Agences à N'Djamena",
    home_stat_nearest: 'Agence la plus proche',
    home_stat_support: 'Support NITA',
    home_title_near: 'Agences classées par proximité',
    home_title_all: "Nos agences à N'Djamena",
    home_see_all: 'Voir toutes sur la carte',
    home_badge_nearest: 'La plus proche',
    home_badge_unavailable: 'Indisponible',
    home_type_principale: 'Agence principale',
    home_type_standard: 'Agence standard',
    home_btn_itinerary: 'Itinéraire',
    home_btn_details: 'Détails',
    home_btn_call: 'Appeler',
    home_loading: 'Chargement…',

    // Carte
    map_search_ph: 'Rechercher une agence, un quartier…',
    map_filter_all: 'Toutes',
    map_filter_principale: 'Principales',
    map_filter_standard: 'Standard',
    map_dist_label: 'Dist.',
    map_agence_count: '{n} agence(s)',
    map_located: 'Localisé',
    map_ndjamena: "N'Djamena",
    map_offline_data: 'Données hors ligne (dernière synchro)',
    map_dl_downloading: 'Téléchargement de la carte…',
    map_dl_available: 'Carte disponible hors ligne ({n} tuiles)',
    map_dl_retry: 'Échec — réessayer',
    map_dl_download: 'Télécharger la carte hors ligne',
    map_loading: 'Chargement…',
    map_none_found: 'Aucune agence trouvée',
    map_badge_principale: 'Principale',
    map_badge_standard: 'Standard',
    map_itinerary: 'Itinéraire',
    map_call: 'Appeler',
    map_hide_filters: 'Masquer filtres',
    map_show_filters: 'Afficher filtres',
    map_hide_panel: 'Masquer le panneau',
    map_show_panel: 'Afficher le panneau',
    map_locate_me: 'Me localiser',

    // Calculatrice
    calc_title: 'Calculatrice de frais',
    calc_sub: "Estimez les frais d'un transfert NITA, au Tchad ou vers l'international.",
    calc_tab_national: 'Tchad (national)',
    calc_tab_intl: 'Autre pays',
    calc_label_country: 'Pays de destination',
    calc_label_amount: 'Montant à envoyer',
    calc_intl_note: "NITA est présent dans plusieurs pays d'Afrique de l'Ouest et du Centre, dont le %PAYS%. Le site officiel ne publie pas de grille tarifaire en ligne pour les transferts internationaux — les frais vers le %PAYS% sont communiqués directement en agence NITA au moment de l'envoi.",
    calc_result_sent: 'Montant envoyé',
    calc_result_fees: 'Frais',
    calc_result_total: "Total à payer par l'expéditeur",
    calc_result_receives: 'Le destinataire reçoit',
    calc_out_of_range: 'Montant hors grille (max. 25 000 000 FCFA) — contactez une agence NITA.',
    calc_empty: 'Saisissez un montant pour voir les frais.',
    calc_note_national: "Grille tarifaire officielle NITA (zone nationale) — aucun frais supplémentaire n'est facturé au retrait.",
    calc_note_intl: 'Zone internationale : montant indicatif, les frais réels sont fixés en agence selon le pays et le mode de retrait.',
    calc_table_title_national: 'Grille tarifaire — National',
    calc_table_title_intl: 'Pays desservis par NITA',
    calc_th_amount: 'Montant',
    calc_th_fees: 'Frais',

    // À propos
    about_h1: 'À propos de NITA',
    about_intro: "NITA Transfert d'Argent est un réseau de transfert d'argent implanté au Tchad, avec pour mission de connecter les Tchadiens grâce à un service fiable, rapide et garanti — à N'Djamena comme dans les 23 régions du pays.",
    about_stat_regions: 'Régions couvertes',
    about_stat_agences_tchad: 'Agences au Tchad',
    about_stat_agences_ndj: "Agences à N'Djamena",
    about_who_title: 'Qui est NITA ?',
    about_who_p1: "NITA opère au Tchad en s'appuyant sur un large maillage d'agences réparties dans la capitale et les provinces, permettant d'envoyer et de retirer des fonds rapidement, sans avoir besoin d'un compte bancaire. Le siège du réseau se trouve à Moursal, à N'Djamena.",
    about_who_p2: "Les transactions sont conçues pour être disponibles instantanément : dès l'envoi effectué en agence, le bénéficiaire peut retirer son argent dans n'importe quelle agence NITA de sa région, muni d'une pièce d'identité et du code de transfert communiqué par l'expéditeur.",
    about_app_title: "MyNITA — l'application mobile",
    about_app_p1: "En complément du réseau d'agences physiques, NITA propose MyNITA, une application mobile pensée pour rapprocher les services de transfert d'argent du quotidien des utilisateurs, au Tchad comme à l'international. Elle combine la simplicité du digital avec le suivi personnalisé qui fait la force du réseau d'agences.",
    about_feat_1_title: 'Suivi des transferts',
    about_feat_1_desc: 'Gardez un œil sur vos envois et votre activité financière en temps réel.',
    about_feat_2_title: 'Approvisionnement de compte',
    about_feat_2_desc: 'Alimentez votre compte MyNITA pour préparer vos prochains transferts.',
    about_feat_3_title: 'Envoi vers une agence',
    about_feat_3_desc: "Envoyez des fonds à retirer en espèces dans n'importe quelle agence NITA.",
    about_feat_4_title: 'Compte à compte',
    about_feat_4_desc: 'Transférez directement entre utilisateurs MyNITA, sans passer par une agence.',
    about_feat_5_title: 'Informations pratiques',
    about_feat_5_desc: 'Accédez aux ressources et informations utiles du réseau NITA depuis l\'application.',
    about_feat_6_title: 'Support client',
    about_feat_6_desc: "Un accès simplifié à l'assistance NITA en cas de besoin.",
    about_install_title: 'Installer NITA Agences sur votre téléphone',
    about_install_installed: "Application déjà installée — vous pouvez la lancer depuis votre écran d'accueil.",
    about_install_available: 'Accès rapide et carte disponible hors connexion, sans passer par le navigateur.',
    about_install_manual: "Android/Chrome : menu ⋮ → « Installer l'application ». iPhone/Safari : bouton Partager → « Sur l'écran d'accueil ».",
    about_install_btn: "Télécharger l'application",
    about_install_done: 'Installée',
    about_commit_title: 'Nos engagements',
    about_commit_p_before: "Aucun frais supplémentaire n'est facturé au retrait : le bénéficiaire reçoit exactement le montant envoyé. Les frais de transfert sont payés uniquement par l'expéditeur, selon une grille tarifaire transparente disponible sur la page ",
    about_commit_link: 'Calculatrice de frais',
    about_commit_p_after: '.',
    about_contact_title: 'Nous contacter',
    about_contact_address: 'Siège social — Moursal, en face de la CECOCDA, N\'Djamena, Tchad.',
    about_contact_hours: '7h - 23h, tous les jours',

    // Fiche agence
    detail_not_found: 'Agence introuvable.',
    detail_back_home: "Retour à l'accueil",
    detail_status_unavailable: 'Indisponible',
    detail_type_principale: 'Principale',
    detail_type_standard: 'Standard',
    detail_btn_call: 'Appeler',
    detail_btn_whatsapp: 'WhatsApp',
    detail_btn_itinerary: 'Itinéraire',
    detail_distance_suffix: 'de votre position',
    detail_hours_title: 'Horaires',
    detail_hours_everyday: 'Tous les jours',
    detail_services_title: 'Services',
    detail_location_title: 'Localisation',
    whatsapp_message: "Bonjour, je voudrais des informations sur l'agence NITA %NOM%.",
    zone_prefix: 'Zone',

    // Connexion admin
    login_badge: 'Authentification',
    login_username_ph: "Nom d'utilisateur",
    login_password_ph: 'Mot de passe',
    login_error_default: 'Identifiants incorrects',
    login_submit: 'Se connecter',
    login_submitting: 'Connexion…',

    // Invite PWA
    install_toast_title: 'Installer NITA Agences',
    install_toast_sub: 'Accès rapide, même hors ligne',
    install_toast_btn: 'Installer',
  },

  ar: {
    tagline: 'التحويل الأكثر موثوقية في تشاد',

    // التنقل
    nav_home: 'الرئيسية',
    nav_map: 'خريطة الوكالات',
    nav_calc: 'حاسبة الرسوم',
    nav_about: 'حول نيتا',
    nav_admin: 'الإدارة',
    nav_logout: 'تسجيل الخروج',
    nav_admin_space: 'مساحة الإدارة',

    // الإعدادات (اللغة / المظهر)
    settings_theme: 'المظهر',
    settings_light: 'فاتح',
    settings_dark: 'داكن',
    settings_auto: 'تلقائي',
    settings_language: 'اللغة',
    settings_lang_auto_tag: 'تم الكشف تلقائيًا',

    // التذييل
    footer_brand: 'نيتا — التحويل الأكثر موثوقية في تشاد',
    footer_location: 'انجمينا، تشاد',

    // الصفحة الرئيسية
    home_h1_before: 'ابحث عن أقرب وكالة',
    home_h1_after: 'منك',
    home_sub: 'تحديد الموقع في الوقت الفعلي، خط السير، ومعلومات عملية لجميع وكالات نيتا في انجمينا.',
    home_search_ph: 'ابحث عن حي أو وكالة…',
    home_btn_map: 'عرض الخريطة',
    home_stat_agences: 'وكالات في انجمينا',
    home_stat_nearest: 'أقرب وكالة',
    home_stat_support: 'دعم نيتا',
    home_title_near: 'الوكالات مرتبة حسب القرب',
    home_title_all: 'وكالاتنا في انجمينا',
    home_see_all: 'عرض الكل على الخريطة',
    home_badge_nearest: 'الأقرب',
    home_badge_unavailable: 'غير متاحة',
    home_type_principale: 'وكالة رئيسية',
    home_type_standard: 'وكالة عادية',
    home_btn_itinerary: 'خط السير',
    home_btn_details: 'التفاصيل',
    home_btn_call: 'اتصال',
    home_loading: 'جارٍ التحميل…',

    // الخريطة
    map_search_ph: 'ابحث عن وكالة أو حي…',
    map_filter_all: 'الكل',
    map_filter_principale: 'رئيسية',
    map_filter_standard: 'عادية',
    map_dist_label: 'المسافة',
    map_agence_count: '{n} وكالة',
    map_located: 'تم تحديد موقعك',
    map_ndjamena: 'انجمينا',
    map_offline_data: 'بيانات غير متصلة (آخر مزامنة)',
    map_dl_downloading: 'جارٍ تنزيل الخريطة…',
    map_dl_available: 'الخريطة متاحة دون اتصال ({n} بلاطة)',
    map_dl_retry: 'فشل — إعادة المحاولة',
    map_dl_download: 'تنزيل الخريطة للاستخدام دون اتصال',
    map_loading: 'جارٍ التحميل…',
    map_none_found: 'لم يتم العثور على أي وكالة',
    map_badge_principale: 'رئيسية',
    map_badge_standard: 'عادية',
    map_itinerary: 'خط السير',
    map_call: 'اتصال',
    map_hide_filters: 'إخفاء عوامل التصفية',
    map_show_filters: 'إظهار عوامل التصفية',
    map_hide_panel: 'إخفاء اللوحة',
    map_show_panel: 'إظهار اللوحة',
    map_locate_me: 'تحديد موقعي',

    // حاسبة الرسوم
    calc_title: 'حاسبة الرسوم',
    calc_sub: 'قدّر رسوم تحويل نيتا، داخل تشاد أو نحو الخارج.',
    calc_tab_national: 'تشاد (داخلي)',
    calc_tab_intl: 'بلد آخر',
    calc_label_country: 'بلد الوجهة',
    calc_label_amount: 'المبلغ المراد إرساله',
    calc_intl_note: 'نيتا حاضرة في عدة دول بغرب ووسط أفريقيا، من بينها %PAYS%. لا ينشر الموقع الرسمي جدول رسوم للتحويلات الدولية عبر الإنترنت — يتم إبلاغ رسوم التحويل إلى %PAYS% مباشرة في الوكالة عند الإرسال.',
    calc_result_sent: 'المبلغ المرسل',
    calc_result_fees: 'الرسوم',
    calc_result_total: 'المجموع الذي يدفعه المرسل',
    calc_result_receives: 'المبلغ الذي يستلمه المستفيد',
    calc_out_of_range: 'مبلغ خارج الجدول (الحد الأقصى 25,000,000 فرنك) — يرجى الاتصال بوكالة نيتا.',
    calc_empty: 'أدخل مبلغًا لعرض الرسوم.',
    calc_note_national: 'جدول الرسوم الرسمي لنيتا (المنطقة الوطنية) — لا تُفرض أي رسوم إضافية عند الاستلام.',
    calc_note_intl: 'المنطقة الدولية: المبلغ إرشادي، وتُحدَّد الرسوم الفعلية في الوكالة حسب البلد وطريقة الاستلام.',
    calc_table_title_national: 'جدول الرسوم — داخلي',
    calc_table_title_intl: 'الدول التي تخدمها نيتا',
    calc_th_amount: 'المبلغ',
    calc_th_fees: 'الرسوم',

    // حول نيتا
    about_h1: 'حول نيتا',
    about_intro: 'نيتا لتحويل الأموال هي شبكة تحويل أموال منتشرة في تشاد، مهمتها ربط التشاديين بخدمة موثوقة وسريعة ومضمونة — في انجمينا كما في المناطق الـ23 للبلاد.',
    about_stat_regions: 'منطقة مغطاة',
    about_stat_agences_tchad: 'وكالة في تشاد',
    about_stat_agences_ndj: 'وكالة في انجمينا',
    about_who_title: 'من هي نيتا؟',
    about_who_p1: 'تعمل نيتا في تشاد بالاعتماد على شبكة واسعة من الوكالات المنتشرة في العاصمة والأقاليم، مما يتيح إرسال واستلام الأموال بسرعة دون الحاجة إلى حساب مصرفي. يقع المقر الرئيسي للشبكة في مورسال، انجمينا.',
    about_who_p2: 'صُممت المعاملات لتكون متاحة فوريًا: بمجرد إتمام الإرسال في الوكالة، يمكن للمستفيد سحب أمواله من أي وكالة نيتا في منطقته، بإبراز بطاقة هوية ورمز التحويل الذي يرسله المُرسِل.',
    about_app_title: 'MyNITA — التطبيق على الهاتف',
    about_app_p1: 'إلى جانب شبكة الوكالات الفعلية، تقدّم نيتا تطبيق MyNITA، وهو تطبيق للهاتف مصمم لتقريب خدمات تحويل الأموال من الاستخدام اليومي، داخل تشاد وخارجها. يجمع بين بساطة الخدمات الرقمية والمتابعة الشخصية التي تميز شبكة الوكالات.',
    about_feat_1_title: 'متابعة التحويلات',
    about_feat_1_desc: 'تابع تحويلاتك ونشاطك المالي في الوقت الفعلي.',
    about_feat_2_title: 'شحن الرصيد',
    about_feat_2_desc: 'اشحن رصيد حسابك في MyNITA لتحضير تحويلاتك القادمة.',
    about_feat_3_title: 'إرسال إلى وكالة',
    about_feat_3_desc: 'أرسل أموالًا يمكن سحبها نقدًا من أي وكالة نيتا.',
    about_feat_4_title: 'من حساب إلى حساب',
    about_feat_4_desc: 'حوّل مباشرة بين مستخدمي MyNITA، دون المرور عبر وكالة.',
    about_feat_5_title: 'معلومات عملية',
    about_feat_5_desc: 'اطّلع على موارد ومعلومات مفيدة عن شبكة نيتا من داخل التطبيق.',
    about_feat_6_title: 'دعم العملاء',
    about_feat_6_desc: 'وصول مبسّط إلى مساعدة نيتا عند الحاجة.',
    about_install_title: 'ثبّت تطبيق وكالات نيتا على هاتفك',
    about_install_installed: 'التطبيق مثبّت بالفعل — يمكنك تشغيله من شاشتك الرئيسية.',
    about_install_available: 'وصول سريع وخريطة متاحة دون اتصال، دون المرور عبر المتصفح.',
    about_install_manual: 'أندرويد/Chrome: القائمة ⋮ ← «تثبيت التطبيق». آيفون/Safari: زر المشاركة ← «إضافة إلى الشاشة الرئيسية».',
    about_install_btn: 'تنزيل التطبيق',
    about_install_done: 'مثبَّت',
    about_commit_title: 'التزاماتنا',
    about_commit_p_before: 'لا تُفرض أي رسوم إضافية عند الاستلام: يستلم المستفيد المبلغ المرسل بالضبط. تُدفع رسوم التحويل من طرف المُرسِل فقط، وفق جدول رسوم شفاف متاح في صفحة ',
    about_commit_link: 'حاسبة الرسوم',
    about_commit_p_after: '.',
    about_contact_title: 'اتصل بنا',
    about_contact_address: 'المقر الرئيسي — مورسال، مقابل CECOCDA، انجمينا، تشاد.',
    about_contact_hours: 'من 7 صباحًا إلى 11 مساءً، كل أيام الأسبوع',

    // صفحة الوكالة
    detail_not_found: 'الوكالة غير موجودة.',
    detail_back_home: 'العودة إلى الرئيسية',
    detail_status_unavailable: 'غير متاحة',
    detail_type_principale: 'رئيسية',
    detail_type_standard: 'عادية',
    detail_btn_call: 'اتصال',
    detail_btn_whatsapp: 'واتساب',
    detail_btn_itinerary: 'خط السير',
    detail_distance_suffix: 'من موقعك',
    detail_hours_title: 'أوقات العمل',
    detail_hours_everyday: 'كل أيام الأسبوع',
    detail_services_title: 'الخدمات',
    detail_location_title: 'الموقع',
    whatsapp_message: 'مرحبًا، أرغب في معلومات عن وكالة نيتا %NOM%.',
    zone_prefix: 'المنطقة',

    // تسجيل دخول الإدارة
    login_badge: 'تسجيل الدخول',
    login_username_ph: 'اسم المستخدم',
    login_password_ph: 'كلمة المرور',
    login_error_default: 'بيانات الدخول غير صحيحة',
    login_submit: 'تسجيل الدخول',
    login_submitting: 'جارٍ الاتصال…',

    // دعوة تثبيت PWA
    install_toast_title: 'تثبيت تطبيق وكالات نيتا',
    install_toast_sub: 'وصول سريع، حتى دون اتصال',
    install_toast_btn: 'تثبيت',
  },
};

// Services d'agence (donnée seed) — petit ensemble fermé, traduit à part.
const SERVICE_LABELS = {
  fr: { 'Dépôt': 'Dépôt', 'Retrait': 'Retrait', 'Transfert national': 'Transfert national', 'Transfert international': 'Transfert international', 'Recharge MyNITA': 'Recharge MyNITA' },
  ar: { 'Dépôt': 'إيداع', 'Retrait': 'سحب', 'Transfert national': 'تحويل داخلي', 'Transfert international': 'تحويل دولي', 'Recharge MyNITA': 'شحن MyNITA' },
};

export function serviceLabel(service, lang) {
  return (SERVICE_LABELS[lang] || SERVICE_LABELS.fr)[service] || service;
}

// Horaires — seule la valeur par défaut du seed est traduite ; toute autre
// valeur saisie librement par un admin est affichée telle quelle.
const HORAIRES_LABELS = {
  '7h-23h, tous les jours': { fr: '7h-23h, tous les jours', ar: 'من 7 صباحًا إلى 11 مساءً، يوميًا' },
};

export function horairesLabel(horaires, lang) {
  return HORAIRES_LABELS[horaires]?.[lang] || horaires;
}

// Pays desservis (clé = valeur française stockée en état/BDD, inchangée).
const COUNTRY_LABELS_AR = {
  'Bénin': 'بنين',
  'Burkina Faso': 'بوركينا فاسو',
  "Côte d'Ivoire": 'ساحل العاج',
  'Ghana': 'غانا',
  'Guinée-Bissau': 'غينيا بيساو',
  'Guinée': 'غينيا',
  'Mali': 'مالي',
  'Mauritanie': 'موريتانيا',
  'Niger': 'النيجر',
  'Nigeria': 'نيجيريا',
  'Sénégal': 'السنغال',
  'Togo': 'توغو',
};

export function countryLabel(pays, lang) {
  return lang === 'ar' ? COUNTRY_LABELS_AR[pays] || pays : pays;
}
