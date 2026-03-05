// import React from 'react';
// import { useLanguage } from './LanguageContext';
// import { Facebook, Music2 as TikTok, MessageCircle } from 'lucide-react';

// export const Footer = ({ setView }) => {
//   const { lang } = useLanguage();

//   return (
//     <footer className="bg-[#12171D] text-white py-16 text-left">
//       <div className="container mx-auto px-6">
//         {/* Main Footer Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
//           {/* Contact Us */}
//           <div className="col-span-1">
//             <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
//             <div className="space-y-3 text-white/70 text-sm">
//               <p>
//                 <span className="font-semibold text-white">ที่อยู่:</span><br/>
//                 302 หมู่ 15 อ.เมือง ต.บ้านค้อ<br/>
//                 จ.ขอนแก่น 40000
//               </p>
//               <p>
//                 <span className="font-semibold text-white">Email:</span><br/>
//                 byson.official123@gmail.com
//               </p>
//               <p>
//                 <span className="font-semibold text-white">Phone:</span><br/>
//                 098-8186202
//               </p>
//               <p>
//                 <span className="font-semibold text-white">เวลาทำการ:</span><br/>
//                 24 ชั่วโมง
//               </p>
//               <div className="pt-4">
//                 <p className="font-semibold text-white mb-3">Social Media:</p>
//                 <div className="flex gap-4">
//                   <a 
//                     href="https://www.facebook.com/profile.php?id=61585809387917" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 bg-white/10 hover:bg-[#2E7D32] rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <Facebook size={20} />
//                   </a>
//                   <a 
//                     href="https://www.tiktok.com/@byson.officials?_r=1&_t=ZS-93neMzNsCLk" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 bg-white/10 hover:bg-[#2E7D32] rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <TikTok size={20} />
//                   </a>
//                   <a 
//                     href="https://lin.ee/JDXuh9RU" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 bg-white/10 hover:bg-[#2E7D32] rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <MessageCircle size={20} />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* About Us */}
//           <div className="col-span-1">
//             <h4 className="font-bold mb-6 text-lg">About Us</h4>
//             <ul className="space-y-3 text-white/70 text-sm">
//               <li>
//                 <button 
//                   onClick={() => {
//                     setView('about');
//                     window.scrollTo({ top: 0, behavior: 'smooth' });
//                   }}
//                   className="hover:text-white transition-colors cursor-pointer text-left"
//                 >
//                   {lang === 'th' ? 'เกี่ยวกับเรา' : 'About Us'}
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Platform */}
//           <div className="col-span-1">
//             <h4 className="font-bold mb-6 text-lg">Platform</h4>
//             <ul className="space-y-3 text-white/70 text-sm">
//               <li>
//                 <button 
//                   onClick={() => {
//                     setView('program');
//                     window.scrollTo({ top: 0, behavior: 'smooth' });
//                   }}
//                   className="hover:text-white transition-colors cursor-pointer text-left"
//                 >
//                   {lang === 'th' ? 'โปรแกรมคำนวณอาหาร' : 'Feed Calculator'}
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => {
//                     setView('program');
//                     window.scrollTo({ top: 0, behavior: 'smooth' });
//                   }}
//                   className="hover:text-white transition-colors cursor-pointer text-left"
//                 >
//                   {lang === 'th' ? 'วิเคราะห์คุณค่าทางโภชนาการ' : 'Nutrition Analyzer'}
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Store */}
//           <div className="col-span-1">
//             <h4 className="font-bold mb-6 text-lg">Store</h4>
//             <ul className="space-y-3 text-white/70 text-sm">
//               <li>
//                 <a 
//                   href="https://th.shp.ee/tySTa7B" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="hover:text-white transition-colors"
//                 >
//                   Shopee
//                 </a>
//               </li>
//               <li>
//                 <a 
//                   href="https://s.lazada.co.th/s.ZYE15f" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="hover:text-white transition-colors"
//                 >
//                   Lazada
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Copyright */}
//         <div className="pt-8 border-t border-white/10 text-white/30 text-sm text-center">
//           © 2026 BYSON All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };