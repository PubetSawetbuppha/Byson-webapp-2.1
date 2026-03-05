import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../components/LanguageContext';
import { Card } from '../components/ui/Shared';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Heart, Target, Users } from 'lucide-react';
import about from '../assets/images/about.jpg'

export const About = () => {
  const { lang } = useLanguage();

  return (
    <div className="py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-[#12171D]">
            {lang === 'th' ? 'เรื่องราวของเรา' : 'Our Story'}
          </h1>
        </motion.div>

        {/* Main Story Content with Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto mb-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <Card className="p-8 md:p-12 bg-gradient-to-br from-white to-[#F8FAFC] border-gray-100">
              <div className="space-y-8 text-gray-700 leading-relaxed text-base md:text-lg">
                <p className="text-xl md:text-2xl font-bold text-[#12171D]">
                  Byson มีจุดเริ่มต้นจากการได้พบเกษตรกรท่านหนึ่งที่นำกากเบียร์มาใช้เลี้ยงจิ้งหรีดควบคู่กับอาหารสูตรสำเร็จในท้องตลาด
                </p>
                
                <div className="bg-[#2E7D32]/5 border-l-4 border-[#2E7D32] p-6 rounded-r-xl">
                  <p className="text-[#12171D] font-bold text-lg md:text-xl italic">
                    เราจึงสงสัยว่า
                  </p>
                  <p className="mt-4 text-[#2E7D32] font-bold">
                    "ทำไมเกษตรกรต้องซื้อกากเบียร์เพิ่ม และทำไมอาหารที่ขายอยู่ตามท้องตลาดทั่วไปถึงไม่มีขาย"
                  </p>
                </div>

                <p>
                  จากการสอบถามเกษตรกร พบว่า ผู้เลี้ยงจิ้งหรีดส่วนใหญ่ประสบปัญหาด้านต้นทุนอาหารในการเลี้ยง คิดเป็นประมาณร้อยละ 50 ของต้นทุนทั้งหมด ด้วยเหตุนี้ เราจึงสนใจแนวทางของเกษตรกรที่กล่าวถึงข้างต้นที่นำกากเบียร์มาใช้เลี้ยงจิ้งหรีด
                </p>

                <p>
                  เมื่อศึกษาข้อมูลเพิ่มเติม พบว่ากากเบียร์มีคุณค่าทางโภชนาการสูง โดยเฉพาะโปรตีน อีกทั้งยังมีต้นทุนต่ำ จึงเป็นทางเลือกที่น่าสนใจ เราจึงได้คิดค้นสูตรอาหารที่ใช้กากเบียร์เป็นวัตถุดิบหลัก เพื่อช่วยลดต้นทุนการเลี้ยงของเกษตรกร
                </p>
              </div>
            </Card>

            {/* Image on the Right */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback 
                src={about}
                alt="Cricket farming"
                className="w-full h-full object-cover min-h-[500px]"
              />
            </div>
          </div>
        </motion.div>

        {/* Values Section with Background */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative py-20 overflow-hidden rounded-3xl"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1761454033995-7b3d3a6f17c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm0lMjBhZ3JpY3VsdHVyYWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxODMyNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Farm background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/85" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-[#12171D]">
              {lang === 'th' ? 'ค่านิยมของเรา' : 'Our Values'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="text-[#D32F2F]" size={32} />,
                  title: 'ใส่ใจเกษตรกร',
                  desc: 'เราเข้าใจความท้าทายของเกษตรกร และมุ่งมั่นพัฒนาโซลูชันที่ช่วยลดต้นทุนและเพิ่มประสิทธิภาพ'
                },
                {
                  icon: <Target className="text-[#2E7D32]" size={32} />,
                  title: 'นวัตกรรมที่ใช้งานได้จริง',
                  desc: 'เทคโนโลยีและวิจัยที่เราพัฒนาต้องสามารถนำไปใช้งานได้จริงในฟาร์ม ไม่ใช่แค่ทฤษฎี'
                },
                {
                  icon: <Users className="text-[#C8A951]" size={32} />,
                  title: 'ชุมชนที่เข้มแข็ง',
                  desc: 'สร้างเครือข่ายเกษตรกรที่แข็งแรง แบ่งปันความรู้และประสบการณ์เพื่อความสำเร็จร่วมกัน'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-8 h-full hover:shadow-2xl transition-all duration-500 border-gray-100 bg-white/90 backdrop-blur-sm">
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 bg-[#F5F7FA] rounded-2xl flex items-center justify-center mx-auto">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-black text-[#12171D]">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
