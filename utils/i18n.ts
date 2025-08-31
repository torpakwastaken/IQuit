export interface Translations {
  app: {
    name: string;
    tagline: string;
  };
  dashboard: {
    title: string;
    addHabit: string;
    streak: string;
    days: string;
    successRate: string;
    motivationalQuote: string;
    checkIn: string;
    upgradeForMore: string;
    habitsLimit: string;
  };
  habits: {
    smoking: string;
    alcohol: string;
    gaming: string;
    porn: string;
    socialMedia: string;
    junkFood: string;
    nailBiting: string;
    custom: string;
  };
  addHabit: {
    title: string;
    selectCategory: string;
    habitName: string;
    motivation: string;
    motivationPlaceholder: string;
    startDate: string;
    goalDays: string;
    reminderTime: string;
    createHabit: string;
  };
  statistics: {
    title: string;
    totalHabits: string;
    averageStreak: string;
    totalDays: string;
    successRate: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    notifications: string;
    premium: string;
    about: string;
    support: string;
  };
  milestones: {
    day1: string;
    day3: string;
    week1: string;
    week2: string;
    month1: string;
    month3: string;
    month6: string;
    year1: string;
  };
}

const translations: Record<string, Translations> = {
  en: {
    app: {
      name: "IQuit",
      tagline: "Break bad habits, build a better you"
    },
    dashboard: {
      title: "My Habits",
      addHabit: "Add New Habit",
      streak: "Current Streak",
      days: "days",
      successRate: "Success Rate",
      motivationalQuote: "Every day you don't give in is a victory",
      checkIn: "Check In",
      upgradeForMore: "Upgrade to Premium for unlimited habits",
      habitsLimit: "Free tier: 2 habits maximum"
    },
    habits: {
      smoking: "Smoking",
      alcohol: "Alcohol",
      gaming: "Gaming",
      porn: "Pornography",
      socialMedia: "Social Media",
      junkFood: "Junk Food",
      nailBiting: "Nail Biting",
      custom: "Custom"
    },
    addHabit: {
      title: "Add New Habit",
      selectCategory: "Select Category",
      habitName: "Habit Name",
      motivation: "Why do you want to quit?",
      motivationPlaceholder: "Enter your motivation...",
      startDate: "Start Date",
      goalDays: "Goal (Days)",
      reminderTime: "Daily Reminder",
      createHabit: "Create Habit"
    },
    statistics: {
      title: "Statistics",
      totalHabits: "Total Habits",
      averageStreak: "Average Streak",
      totalDays: "Total Clean Days",
      successRate: "Overall Success Rate"
    },
    settings: {
      title: "Settings",
      language: "Language",
      theme: "Theme",
      notifications: "Notifications",
      premium: "Upgrade to Premium",
      about: "About IQuit",
      support: "Support"
    },
    milestones: {
      day1: "First Day Clean",
      day3: "3 Days Strong",
      week1: "One Week Milestone",
      week2: "Two Weeks Power",
      month1: "One Month Achievement",
      month3: "Three Months Victory",
      month6: "Half Year Champion",
      year1: "One Year Master"
    }
  },
  tr: {
    app: {
      name: "IQuit",
      tagline: "Kötü alışkanlıkları kır, daha iyi ol"
    },
    dashboard: {
      title: "Alışkanlıklarım",
      addHabit: "Yeni Alışkanlık Ekle",
      streak: "Mevcut Seri",
      days: "gün",
      successRate: "Başarı Oranı",
      motivationalQuote: "Pes etmediğin her gün bir zaferdir",
      checkIn: "Kontrol Et",
      upgradeForMore: "Sınırsız alışkanlık için Premium'a yükseltin",
      habitsLimit: "Ücretsiz: Maksimum 2 alışkanlık"
    },
    habits: {
      smoking: "Sigara",
      alcohol: "Alkol",
      gaming: "Oyun",
      porn: "Pornografi",
      socialMedia: "Sosyal Medya",
      junkFood: "Junk Food",
      nailBiting: "Tırnak Yeme",
      custom: "Özel"
    },
    addHabit: {
      title: "Yeni Alışkanlık Ekle",
      selectCategory: "Kategori Seç",
      habitName: "Alışkanlık Adı",
      motivation: "Neden bırakmak istiyorsun?",
      motivationPlaceholder: "Motivasyonunu gir...",
      startDate: "Başlangıç Tarihi",
      goalDays: "Hedef (Gün)",
      reminderTime: "Günlük Hatırlatma",
      createHabit: "Alışkanlık Oluştur"
    },
    statistics: {
      title: "İstatistikler",
      totalHabits: "Toplam Alışkanlık",
      averageStreak: "Ortalama Seri",
      totalDays: "Toplam Temiz Gün",
      successRate: "Genel Başarı Oranı"
    },
    settings: {
      title: "Ayarlar",
      language: "Dil",
      theme: "Tema",
      notifications: "Bildirimler",
      premium: "Premium'a Yükselt",
      about: "IQuit Hakkında",
      support: "Destek"
    },
    milestones: {
      day1: "İlk Temiz Gün",
      day3: "3 Gün Güçlü",
      week1: "Bir Hafta Başarısı",
      week2: "İki Hafta Gücü",
      month1: "Bir Ay Başarısı",
      month3: "Üç Ay Zaferi",
      month6: "Altı Ay Şampiyonu",
      year1: "Bir Yıl Ustası"
    }
  },
  es: {
    app: {
      name: "IQuit",
      tagline: "Rompe malos hábitos, construye un mejor tú"
    },
    dashboard: {
      title: "Mis Hábitos",
      addHabit: "Agregar Nuevo Hábito",
      streak: "Racha Actual",
      days: "días",
      successRate: "Tasa de Éxito",
      motivationalQuote: "Cada día que no cedes es una victoria",
      checkIn: "Registrarse",
      upgradeForMore: "Actualiza a Premium para hábitos ilimitados",
      habitsLimit: "Nivel gratuito: Máximo 2 hábitos"
    },
    habits: {
      smoking: "Fumar",
      alcohol: "Alcohol",
      gaming: "Juegos",
      porn: "Pornografía",
      socialMedia: "Redes Sociales",
      junkFood: "Comida Chatarra",
      nailBiting: "Morderse las Uñas",
      custom: "Personalizado"
    },
    addHabit: {
      title: "Agregar Nuevo Hábito",
      selectCategory: "Seleccionar Categoría",
      habitName: "Nombre del Hábito",
      motivation: "¿Por qué quieres dejarlo?",
      motivationPlaceholder: "Ingresa tu motivación...",
      startDate: "Fecha de Inicio",
      goalDays: "Meta (Días)",
      reminderTime: "Recordatorio Diario",
      createHabit: "Crear Hábito"
    },
    statistics: {
      title: "Estadísticas",
      totalHabits: "Hábitos Totales",
      averageStreak: "Racha Promedio",
      totalDays: "Días Limpios Totales",
      successRate: "Tasa de Éxito General"
    },
    settings: {
      title: "Configuración",
      language: "Idioma",
      theme: "Tema",
      notifications: "Notificaciones",
      premium: "Actualizar a Premium",
      about: "Acerca de IQuit",
      support: "Soporte"
    },
    milestones: {
      day1: "Primer Día Limpio",
      day3: "3 Días Fuerte",
      week1: "Hito de Una Semana",
      week2: "Poder de Dos Semanas",
      month1: "Logro de Un Mes",
      month3: "Victoria de Tres Meses",
      month6: "Campeón de Medio Año",
      year1: "Maestro de Un Año"
    }
  }
};

export const useTranslation = (language: string = 'en'): Translations => {
  return translations[language] || translations.en;
};

export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];