import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(undefined);

export const translations = {
  // Navigation
  home: { TH: 'หน้าแรก', EN: 'Home' },
  about: { TH: 'เกี่ยวกับเรา', EN: 'About' },
  product: { TH: 'สินค้า', EN: 'Product' },
  program: { TH: 'โปรแกรมคำนวณ', EN: 'Program' },
  openProgram: { TH: 'เปิดโปรแกรมคำนวณ', EN: 'Open Feed Program' },
  
  // Program Options
  calculateFormula: { TH: 'คำนวณสูตรอาหาร', EN: 'Calculate Formula' },
  analyzeFormula: { TH: 'วิเคราะห์สูตรอาหาร', EN: 'Analyze Formula' },
  rawMaterials: { TH: 'วัตถุดิบ', EN: 'Raw Materials' },
  animals: { TH: 'สัตว์', EN: 'Animals' },

  // Hero
  heroTitle: { TH: 'เพิ่มประสิทธิภาพการเลี้ยงจิ้งหรีดด้วยเทคโนโลยี', EN: 'Optimize Cricket Farming with Technology' },
  heroSub: { TH: 'โซลูชันการจัดการอาหารจิ้งหรีดที่แม่นยำที่สุด เพื่อผลผลิตที่ยั่งยืนและต้นทุนที่ต่ำลง', EN: 'The most precise cricket feed management solution for sustainable yields and lower costs.' },
  
  // Education
  brewerTitle: { TH: 'กากเบียร์: ขุมทรัพย์โปรตีน', EN: 'Brewer Grain: The Protein Treasure' },
  brewerDesc: { TH: 'การใช้กากเบียร์ช่วยลดต้นทุนค่าอาหารและเพิ่มคุณค่าทางโภชนาการให้กับจิ้งหรีดของคุณ', EN: 'Using brewer grain helps reduce feed costs and enhances the nutritional value for your crickets.' },
  
  // Dashboard
  calculator: { TH: 'เครื่องคำนวณสูตรอาหาร', EN: 'Feed Calculator' },
  analyzer: { TH: 'วิเคราะห์คุณค่าทางอาหาร', EN: 'Nutrition Analyzer' },
  runCalc: { TH: 'เริ่มคำนวณ', EN: 'Run Calculation' },
  analyzeFeed: { TH: 'วิเคราะห์อาหาร', EN: 'Analyze Feed' },
  
  // Product
  productTitle: { TH: 'กากเบียร์คุณภาพสูง', EN: 'High-Quality Brewer Grain' },
  productDesc: { TH: 'ผ่านกระบวนการคัดสรรและแปรรูปที่ได้มาตรฐาน เพื่อจิ้งหรีดที่แข็งแรง', EN: 'Standardized selection and processing for healthy crickets.' },

  // About
  aboutTitle: { TH: 'ก้าวไกลสู่อนาคตเกษตรกรรมจิ้งหรีด', EN: 'Leading the Future of Cricket Farming' },
  aboutStory: { TH: 'Byson ก่อตั้งขึ้นเพื่อรวมเกษตรกรรมแบบดั้งเดิมเข้ากับเทคโนโลยีสมัยใหม่', EN: 'Byson was founded to integrate traditional farming with modern technology.' },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('TH');

  const t = (key) => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
