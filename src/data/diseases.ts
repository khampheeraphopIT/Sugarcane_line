/* ──────────────────────────────────────────────
   Disease Encyclopedia — Static Knowledge Base
   Sourced from Thai sugarcane pathology research
   ────────────────────────────────────────────── */

import type { DiseaseInfo } from '../types';

export const DISEASES: DiseaseInfo[] = [
  {
    id: 0,
    name: 'Healthy',
    nameThai: 'ปกติ (ไม่พบโรค)',
    pathogen: '-',
    severity: 'none',
    symptoms: [
      'ใบเขียวสดตลอดทั้งใบ',
      'ลำต้นแข็งแรง ไม่มีจุดหรือรอยผิดปกติ',
      'อ้อยเจริญเติบโตตามปกติ',
    ],
    triggerWeather: '-',
    prevention: [
      'ใช้พันธุ์อ้อยที่ทนทานโรค',
      'หมั่นตรวจแปลงสม่ำเสมอ',
      'จัดการน้ำให้เหมาะสม',
      'กำจัดวัชพืชรอบแปลง',
    ],
    treatment: ['-'],
    chemicals: ['-'],
    icon: '🌿',
  },
  {
    id: 1,
    name: 'Red_Rot',
    nameThai: 'โรคเน่าแดง',
    pathogen: 'Colletotrichum falcatum',
    severity: 'high',
    symptoms: [
      'มีจุดแดงหรือชมพูบนลำต้น',
      'เนื้อในลำต้นเปลี่ยนเป็นสีแดง',
      'มีกลิ่นเหม็นเปรี้ยวจากลำต้นที่ถูกตัด',
      'ใบเหี่ยวและแห้งจากยอด',
      'น้ำตาลในลำลดลง',
    ],
    triggerWeather: 'ฝนตกต่อเนื่องมากกว่า 5 วัน + ความชื้นสูง',
    prevention: [
      'ใช้ท่อนพันธุ์ที่ปลอดโรค',
      'ไม่ปลูกซ้ำในพื้นที่เคยเกิดโรค',
      'ระบายน้ำให้ดี ไม่ให้ขังแปลง',
      'แช่ท่อนพันธุ์ในน้ำร้อน 52°C 30 นาที',
    ],
    treatment: [
      'ถอนต้นที่เป็นโรคออกเผาทำลาย',
      'ฉีดพ่นสารป้องกันเชื้อราในพื้นที่ใกล้เคียง',
      'ปรับการระบายน้ำในแปลง',
    ],
    chemicals: [
      'Carbendazim 50% WP (อัตรา 20 กรัม/น้ำ 20 ลิตร)',
      'Thiophanate-methyl',
    ],
    icon: '🔴',
  },
  {
    id: 2,
    name: 'Mosaic',
    nameThai: 'โรคใบด่าง',
    pathogen: 'Sugarcane Mosaic Virus (SCMV)',
    severity: 'medium',
    symptoms: [
      'ใบมีลายด่างเขียวอ่อนสลับเขียวเข้ม',
      'ใบอาจม้วนหรือบิดงอ',
      'ต้นเตี้ยแคระกว่าปกติ',
      'ผลผลิตลดลง 10-30%',
    ],
    triggerWeather: 'แมลงพาหะ (เพลี้ยอ่อน) ระบาดในสภาพอากาศอบอุ่น',
    prevention: [
      'ใช้พันธุ์ต้านทาน',
      'กำจัดเพลี้ยอ่อน (แมลงพาหะ)',
      'ใช้ท่อนพันธุ์จากแม่พันธุ์ปลอดโรค',
      'ถอนต้นที่เป็นโรคทิ้งทันที',
    ],
    treatment: [
      'ไม่มียารักษาโรคไวรัสโดยตรง',
      'กำจัดแมลงพาหะ (เพลี้ยอ่อน)',
      'ถอนทำลายต้นที่เป็นโรค',
    ],
    chemicals: [
      'Imidacloprid (กำจัดเพลี้ยอ่อน)',
      'Thiamethoxam (กำจัดแมลงพาหะ)',
    ],
    icon: '🟢',
  },
  {
    id: 3,
    name: 'Rust',
    nameThai: 'โรคราสนิม',
    pathogen: 'Puccinia melanocephala',
    severity: 'medium',
    symptoms: [
      'มีจุดเล็กๆ สีเหลืองส้มบนใบ',
      'จุดขยายเป็นตุ่มสีน้ำตาลแดง (สนิม)',
      'ใบเริ่มแห้งจากปลายใบ',
      'ลดการสังเคราะห์แสง ผลผลิตลด',
    ],
    triggerWeather: 'ความชื้น > 80% + อุณหภูมิ 25-35°C',
    prevention: [
      'ปลูกพันธุ์ที่ทนทานต่อโรคราสนิม',
      'ไม่ปลูกหนาแน่นเกินไป เพื่อให้อากาศถ่ายเท',
      'กำจัดใบที่เป็นโรคออก',
    ],
    treatment: [
      'ฉีดพ่นสารป้องกันกำจัดเชื้อรา',
      'ตัดใบที่เป็นโรคออกเผาทำลาย',
      'ลดความหนาแน่นของแปลง',
    ],
    chemicals: [
      'Propiconazole 25% EC',
      'Mancozeb 80% WP (อัตรา 40-50 กรัม/น้ำ 20 ลิตร)',
      'Triadimefon',
    ],
    icon: '🟠',
  },
  {
    id: 4,
    name: 'Yellow_Leaf',
    nameThai: 'โรคใบเหลือง',
    pathogen: 'Sugarcane Yellow Leaf Virus (SrYLV)',
    severity: 'medium',
    symptoms: [
      'เส้นกลางใบเปลี่ยนเป็นสีเหลือง',
      'ใบเหลืองลามจากปลายใบ',
      'ต้นอ้อยแคระแกร็น ข้อสั้น',
      'ผลผลิตลดลงอย่างมาก',
    ],
    triggerWeather: 'แมลงพาหะ (เพลี้ยอ่อน) — ไม่ขึ้นกับอากาศโดยตรง',
    prevention: [
      'ใช้พันธุ์ต้านทาน',
      'ใช้ท่อนพันธุ์ปลอดโรค (ผ่านการเพาะเลี้ยงเนื้อเยื่อ)',
      'กำจัดเพลี้ยอ่อนอย่างสม่ำเสมอ',
      'ถอนต้นที่เป็นโรคทิ้ง',
    ],
    treatment: [
      'ไม่มียารักษาโรคไวรัสโดยตรง',
      'ควบคุมแมลงพาหะ',
      'ปรับปรุงพันธุ์อ้อย',
    ],
    chemicals: [
      'Imidacloprid (กำจัดเพลี้ยอ่อน)',
      'Acetamiprid (กำจัดแมลงพาหะ)',
    ],
    icon: '🟡',
  },
  {
    id: 5,
    name: 'Blight',
    nameThai: 'โรคใบไหม้',
    pathogen: 'Helminthosporium sacchari',
    severity: 'medium',
    symptoms: [
      'แผลรูปไข่สีน้ำตาลแดงบนใบ',
      'แผลขยายจนใบไหม้ทั้งใบ',
      'ขอบแผลมีสีเหลือง',
      'ใบแห้งเป็นสีน้ำตาล',
    ],
    triggerWeather: 'อุณหภูมิสูง 30-35°C + ความชื้นสูง > 80%',
    prevention: [
      'ปลูกพันธุ์ทนทาน',
      'รักษาระยะปลูกให้เหมาะสม',
      'กำจัดใบแห้งออกจากแปลง',
      'หมุนเวียนพืช',
    ],
    treatment: [
      'ฉีดพ่นสารป้องกันกำจัดเชื้อรา',
      'ตัดใบที่เป็นโรคออกทำลาย',
      'ปรับปรุงการระบายอากาศในแปลง',
    ],
    chemicals: [
      'Mancozeb 80% WP',
      'Zineb 75% WP',
      'Copper Oxychloride 85% WP',
    ],
    icon: '🔥',
  },
];

/**
 * Lookup a disease by its class name.
 */
export function getDiseaseByName(name: string): DiseaseInfo | undefined {
  return DISEASES.find((d) => d.name === name);
}

/**
 * Lookup a disease by its numeric class id.
 */
export function getDiseaseById(id: number): DiseaseInfo | undefined {
  return DISEASES.find((d) => d.id === id);
}
