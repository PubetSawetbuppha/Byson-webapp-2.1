import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/Shared';
import { useLanguage } from '../components/LanguageContext';
import hero from '../assets/images/hero.jpg'
import brewergrain from '../assets/images/brewergrain.jpg'
import cricket from '../assets/images/cricket.png'
import program from '../assets/images/program.png'

export const Home = ({ setView }) => {
  const { lang } = useLanguage();

  const articles = [
    {
      id: 1,
      title: 'กากเบียร์',
      content: 'วัตถุดิบจากข้าวมอลต์หรือบาเลย์ เป็นกากอาหารได้จากการคั้นน้ำแป้งและน้ำตาลออกมา มีคุณค่าทางอาหารสูงเป็นแหล่งโปรตีนที่ดีสำหรับใช้ในการปศุสัตว์ วัตถุดิบนี้มีโปรตีนประมาณ 5% ในสภาพสด และเมื่อผ่านการทำให้แห้งจะมีปริมาณโปรตีนเพิ่มขึ้นสูงถึง 27% ด้วยคุณสมบัติที่มีโปรตีนสูงและหาได้จากธรรมชาติ วัตถุดิบดังกล่าว จึงสามารถนำมาพัฒนาเป็นอาหารสำหรับเลี้ยงจิ้งหรีด ช่วยลดการพึ่งพาอาหารสำเร็จรูป ส่งผลให้สามารถลดต้นทุนค่าอาหาร และช่วยให้เกษตรกรประหยัดค่าใช้จ่ายในการเลี้ยงมากขึ้น',
      image: brewergrain,
      imagePosition: 'right',
      bgImage: 'https://images.unsplash.com/photo-1721577756352-54505d771f0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwYWdyaWN1bHR1cmUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MTgzMjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      title: 'จิ้งหรีด',
      content: '"จิ้งหรีด" ได้กลายมาเป็นแมลงเศรษฐกิจ หนึ่งในแหล่งอาหารทางเลือกที่ได้รับความสนใจอย่างมากทั้งในด้านโภชนาการ ความยั่งยืนในการผลิตและโอกาสทางเศรษฐกิจ\n\nคุณค่าทางโภชนาการที่โดดเด่น จิ้งหรีด เป็นแหล่งโปรตีนชั้นยอด เมื่อเทียบในรูปแบบน้ำหนักแห้ง ปริมาณโปรตีนมักอยู่ในช่วงประมาณ 60–70% ซึ่งใกล้เคียงหรือบางครั้งสูงกว่าโปรตีนจากเนื้อสัตว์ทั่วไปอย่างเนื้อวัวหรือเนื้อไก่ นอกจากนี้ โปรตีนจากจิ้งหรีดยังมีกรดอะมิโนจำเป็นครบถ้วน ทำให้โปรตีนมีคุณภาพสูงและสามารถย่อยดูดซึมได้ดี ด้วยคุณค่าทางโภชนาการที่สูง การย่อยง่าย และความยั่งยืนในการผลิต จิ้งหรีดจึงถือเป็นอีกทางเลือกหนึ่งที่น่าสนใจในการเลี้ยงเป็นแมลงเศรษฐกิจ',
      image: cricket,
      imagePosition: 'left',
      bgImage: 'https://images.unsplash.com/photo-1600022396826-1f9018e336b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwZmFybSUyMGluc2VjdCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc3MTgzMjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      title: 'โปรแกรมคำนวณ',
      content: 'ซอฟต์แวร์นี้ถูกพัฒนาโดย Byson มีวัตถุประสงค์เพื่อช่วยเกษตรกร ในการคำนวณหาสัดส่วนวัตถุดิบที่เหมาะสมสำหรับการผลิตอาหารจิ้งหรีดตามเป้าหมายที่กำหนด ไม่ว่าจะเป็นการเพิ่มอัตราการเจริญเติบโต ลดต้นทุนค่าอาหาร หรือหาสูตรที่ทำให้น้ำหนักตัวเพิ่มขึ้น ปรับระดับโปรตีนและพลังงานให้เหมาะสมกับช่วงวัยของจิ้งหรีด\n\nระบบถูกออกแบบให้ใช้งานง่าย สามารถกรอกข้อมูลวัตถุดิบที่มีอยู่ เช่น กากเบียร์ รำละเอียด ปลาป่น หรือวัตถุดิบอื่น ๆ พร้อมระบุคุณค่าทางโภชนาการและราคาต่อหน่วย',
      image: program,
      imagePosition: 'right',
      bgImage: 'https://images.unsplash.com/photo-1761454033995-7b3d3a6f17c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm0lMjBhZ3JpY3VsdHVyYWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxODMyNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section with Parallax Background */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <ImageWithFallback 
            src={hero}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#12171D]/60" />
        </motion.div>
        
        {/* Hero Content with Fade-in Animation */}
        <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
          >
            ฟาร์มไบซัน
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto"
          >
            ฟาร์มเลี้ยงจิ้งหรีดและจำหน่ายกากเบียร์คุณภาพ
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button 
              className="h-16 px-10 rounded-full text-lg font-black bg-[#2E7D32] hover:bg-[#1B5E20] shadow-2xl shadow-[#2E7D32]/40"
              onClick={() => setView('program')}
            >
              โปรแกรมคำนวณ
            </Button>
            <Button 
              className="h-16 px-10 rounded-full text-lg font-black bg-white text-[#12171D] hover:bg-gray-100"
              onClick={() => setView('product')}
            >
              รายการสินค้า
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Articles Section with Background Images */}
      <section className="space-y-0">
        {articles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="relative py-20 overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <ImageWithFallback 
                src={article.bgImage}
                alt={`${article.title} background`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/90" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                article.imagePosition === 'left' ? 'lg:grid-flow-dense' : ''
              }`}>
                {/* Text Content */}
                <div className={`space-y-6 ${article.imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
                  <h2 className="text-3xl md:text-4xl font-black text-[#12171D]">
                    {article.title}
                  </h2>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {article.content}
                  </p>
                </div>

                {/* Image */}
                <div className={`${article.imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                    <ImageWithFallback 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12171D]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
