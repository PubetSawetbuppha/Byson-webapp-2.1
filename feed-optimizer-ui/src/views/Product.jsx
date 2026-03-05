import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Card, Button } from '../components/ui/Shared';
import { useLanguage } from '../components/LanguageContext';
import { ShoppingCart } from 'lucide-react';
import brewer_product from '../assets/images/brewergrain_product.jpg'
import freeze_product from '../assets/images/freeze_product.jpg'
import fried_product from '../assets/images/fried_product.jpg'
import dried_product from '../assets/images/dried_product.jpg'
import mix_product from '../assets/images/mix_product.jpg'

const cricketProducts = [
  {
    id: 1,
    name_th: 'จิ้งหรีดแช่แช็ง',
    name_en: 'Cricket Freeze',
    description_th: 'คงความสดและคุณค่าทางอาหาร เหมาะสำหรับนำไปปรุงอาหารหรือแปรรูปต่อ',
    description_en: 'Maintains freshness and nutritional value, suitable for cooking or further processing.',
    image: freeze_product,
    price: '510 ฿/กก.'
  },
  {
    id: 2,
    name_th: 'จิ้งหรีดอบแห้ง',
    name_en: 'Dried Crickets',
    description_th: 'โปรตีนสูง ไขมันดีจากธรรมชาติ ใช้เป็นอาหารเสริมหรือสัตว์เลี้ยงกินแมลง',
    description_en: 'High protein, natural healthy fats, used as supplements or for insect-eating pets.',
    image: dried_product,
    price: '75 ฿/กระปุก'
  },
  {
    id: 3,
    name_th: 'จิ้งหรีดทอดสมุนไพร',
    name_en: 'Fried Crickets with Herbs',
    description_th: 'จิ้งหรีดทอดกรอบสมุนไพรหอมกรุ่น พร้อมรับประทาน รสชาติกลมกล่อม',
    description_en: 'Crispy fried crickets with aromatic herbs, ready to eat, well-balanced flavor.',
    image: fried_product,
    price: '159 ฿/ถุง'
  },
  {
    id: 4,
    name_th: 'จิ้งหรีดทอดเขย่าผง',
    name_en: 'Cricket Shaker Powder',
    description_th: 'จิ้งหรีดทอดกรอบ เขย่าผงปรุงรสหลากหลายรสชาติ เหมาะสำหรับของทานเล่น',
    description_en: 'Crispy fried crickets shaken with seasoning powder in various flavors, perfect for snacking.',
    image: mix_product,
    price: '69 ฿/ถุง'
  }
];

export const Product = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-0 pb-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-black text-[#12171D]">
          สินค้าของเรา
        </h1>
      </div>

      {/* Brewer Grain Section - Text Left, Image Right */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-[#12171D]">
              กากเบียร์
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              กากเบียร์บดแห้งคุณภาพสูง ผ่านกระบวนการลดความชื้นและบดละเอียด เหมาะสำหรับใช้เป็นวัตถุดิบเสริมโปรตีนในสูตรอาหารสัตว์ เช่น จิ้งหรีด ไก่ เป็ด ปลา และสัตว์เศรษฐกิจอื่น ๆ{' '}
              <a
                href="https://lin.ee/JDXuh9RU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E7D32] font-bold hover:text-[#1B5E20] underline transition-colors"
              >
                ติดต่อสอบถาม
              </a>
            </p>
          </div>

          {/* Image - Right Side (50% width) */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <ImageWithFallback
              src={brewer_product}
              alt="Brewer Grain"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Cricket Products Section - 2x2 Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-[#12171D]">
            {lang === 'th' ? 'ผลิตภัณฑ์จิ้งหรีด' : 'Cricket Products'}
          </h2>
          <p className="text-gray-500">
            {lang === 'th'
              ? 'ผลิตภัณฑ์จิ้งหรีดคุณภาพสูงในรูปแบบต่าง ๆ พร้อมสำหรับทุกความต้องการ'
              : 'High-quality cricket products in various forms, ready for all your needs.'}
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cricketProducts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-0 overflow-hidden flex flex-col h-full border-gray-100 group hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 bg-white flex items-center justify-center p-4">
                  <ImageWithFallback
                    src={p.image}
                    alt={p.name_en}
                    className="max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#12171D]">
                      {lang === 'th' ? p.name_th : p.name_en}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {lang === 'th' ? p.description_th : p.description_en}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-[#2E7D32]">{p.price}</span>
                    <a
                      href="https://lin.ee/JDXuh9RU"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="rounded-full flex items-center gap-2 px-6">
                        <ShoppingCart size={18} />
                        {lang === 'th' ? 'สั่งซื้อ' : 'Order'}
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
