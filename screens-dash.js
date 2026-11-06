/* screens-dash.js · Central Admin (พี่ปาล์ม Master Prompt v1.0 + R4 addendum): one admin, 8 views, 56 Q-IDs that drill into the existing screens.
   PT capability view, the PT's own "งานที่รับ" screen, and the "มาใหม่ · รอตรวจ" strip for the owner's review.
   Every number here is labelled sample data. What can't be measured says so instead of showing 0. */
(function () {
  'use strict';
  const { esc, ui } = SC, I = ui.icon;
  const ST = { ok: ['ปกติ', ''], watch: ['ต้องดู', 'wait'], urgent: ['ต้องทำวันนี้', 'warn'], unknown: ['ยังวัดไม่ได้', 'gray'], policy: ['รอยืนยันนโยบาย', 'gray'] };
  const OPS = 'ทีมปฏิบัติการ', MATCH = 'Matching Admin', BOOK = 'Booking Admin', FIN = 'Finance', PTA = 'ทีม PT', CL = 'Clinical Lead', PKG = 'ทีมคอร์ส';
  /* [Q-ID, the question, sample value, state, owner, existing screen, how it is counted] */
  const Q = {
    D01: [
      ['Q01.01', 'ธุรกิจโตจากลูกค้าใหม่ หรือจากลูกค้าเดิมที่กลับมาใช้บริการ?', 'ใหม่ 38 · เดิม 14', 'ok', OPS, 'a.patients', 'นับคนไม่ซ้ำ จากการเยี่ยมครั้งแรกที่จบแล้ว'],
      ['Q01.02', 'ลูกค้าหลุดออกจาก Funnel ขั้นตอนไหนมากที่สุด?', 'คัดกรอง → จ่าย', 'watch', OPS, 'a.queue', 'เคสที่พักรอทีมคลินิกไม่นับว่าหลุด'],
      ['Q01.03', 'จ่าย Trial แล้วมารับบริการครั้งแรกจริงกี่เปอร์เซ็นต์?', '81%', 'ok', OPS, 'a.appts', 'เคสที่จ่ายแล้วแต่ยังพักตรวจ ไม่นับว่าหลุดหรือจบ'],
      ['Q01.04', 'Trial เปลี่ยนเป็น Package 5/10/20 ได้เท่าไร และแบบไหนมากที่สุด?', '37% · 10 ครั้ง', 'ok', PKG, 'a.payments', 'นับเมื่อเงินผ่านการยืนยัน เปิด QR ไม่นับว่าซื้อ'],
      ['Q01.05', 'รายได้ค่าบริการแพลตฟอร์มเกิดจาก Visit ที่ใช้จริงเท่าไร?', '', 'policy', FIN, 'a.payments', 'รอแหล่งราคาและค่าธรรมเนียมที่ใช้จริง ไม่ใช้ยอดรับเงินแทน'],
      ['Q01.06', 'โซนใดมี Demand สูงแต่ส่งมอบบริการไม่ทัน?', 'ฝั่งธนบุรี', 'watch', MATCH, 'a.match', 'หนึ่งคำขอนับหนึ่งเคส แม้เลือกหลายเวลา'],
      ['Q01.07', 'ตัวเลขที่ลดลงเกิดจากการตลาด การจับคู่ หรือการให้บริการ?', '', 'unknown', OPS, 'a.queue', 'ยังไม่มีข้อมูลแคมเปญ จึงไม่เดาสาเหตุ']
    ],
    D02: [
      ['Q02.01', 'PT สมัครมาแล้วกี่คน ผ่านการตรวจใบอนุญาตกี่คน?', '46 → 38', 'ok', PTA, 'a.license', 'ผ่านเฉพาะเมื่อทีมตรวจใบประกอบแล้ว'],
      ['Q02.02', 'PT ที่ Verified แล้วเปิดพื้นที่และตารางพร้อมรับงานจริงกี่คน?', '21 คน', 'watch', PTA, 'a.pts', 'ต้องมีใบประกอบ พื้นที่ ตาราง และข้อตกลงครบ ไม่ได้แปลว่าผ่านทักษะทุกงาน'],
      ['Q02.03', 'แต่ละโซนมี PT พร้อมรับงานเพียงพอกับคำขอหรือไม่?', 'ขาด 2 โซน', 'watch', MATCH, 'a.pts', 'ใช้พื้นที่ เวลา และเงื่อนไขทางคลินิกร่วมกัน'],
      ['Q02.04', 'Block 3 ชั่วโมงถูกใช้ไปเท่าไร และติดข้อจำกัดใด?', '58%', 'ok', PTA, 'a.pts', '3 ชั่วโมงรับได้สูงสุด 2 นัด แต่ไม่นับเป็นความจุจริงถ้าเวลาไม่พอ'],
      ['Q02.05', 'PT คนใดเปิดตารางแต่ไม่รับ Offer บ่อย?', '3 คน', 'watch', PTA, 'a.pts', 'ไม่นับ Offer ที่ถูกยกเลิก พักตรวจ หรือมีคนอื่นรับก่อน'],
      ['Q02.06', 'วันและช่วงเวลาใดขาดแคลน PT มากที่สุด?', 'จ.–ศ. เย็น', 'watch', MATCH, 'a.pts', 'กดดูรายการเคสในช่วงเวลานั้นได้'],
      ['Q02.07', 'PT ที่หยุดเปิดตารางหรือใบอนุญาตไม่ผ่านควรติดตามอย่างไร?', 'ไม่มีตาราง 9 · ใบไม่ผ่าน 2', 'watch', PTA, 'a.license', 'แยกคิวใบประกอบไม่ผ่านออกจากคิวไม่มีตาราง']
    ],
    D03: [
      ['Q03.01', 'ลูกค้าที่จ่ายเงินแล้วแต่ยังไม่มี PT มีกี่เคส และรอนานเท่าไร?', '5 เคส · นานสุด 48 นาที', 'urgent', MATCH, 'a.match', 'ไม่รวมเคสที่จ่ายแล้วแต่พักรอทีมคลินิก'],
      ['Q03.02', 'คำขอใดกำลังใกล้ครบ 30 นาที และ 90 นาที?', '', 'policy', MATCH, 'a.match', 'รอยืนยันเวลาทำการ และ Simulator ยังไม่มีนาฬิกา 30/90'],
      ['Q03.03', 'PT ได้รับ Offer กี่คน ตอบรับ/ปฏิเสธ/ไม่ตอบกี่คน?', '18 · รับ 9 · ปฏิเสธ 4', 'ok', MATCH, 'a.match', 'ส่งแล้วไม่เท่ากับถึงแล้ว ถ้าไม่มีหลักฐานการส่งถึงให้บอกตรงๆ'],
      ['Q03.04', 'เหตุใดการจับคู่ไม่สำเร็จ: พื้นที่ เวลา หรือไม่มีคนกดรับ?', 'เวลา 6 · ทักษะ 3', 'watch', MATCH, 'a.match', 'PT ที่ถูกตัดออกไม่นับว่าไม่ตอบ'],
      ['Q03.05', 'การกดรับพร้อมกันทำให้มีผู้ได้รับงานมากกว่า 1 คนหรือไม่?', '', 'unknown', MATCH, 'a.match', 'ต้องทดสอบที่ server จริง Simulator พิสูจน์ไม่ได้'],
      ['Q03.06', 'เคสที่ต้องขอเวลาใหม่หรือคืนเงินอยู่ที่ขั้นไหน?', 'ขอเวลาใหม่ 2 · คืนเงิน 1', 'watch', MATCH, 'a.payments', 'แยกสิทธิ์สองเรื่อง ไม่คืนเงินจากการหมดเวลาอัตโนมัติ'],
      ['Q03.07', 'ลูกค้ากลับมาใช้บริการกับ PT เดิมได้ต่อเนื่องหรือไม่?', '91%', 'ok', BOOK, 'a.appts', 'เปลี่ยน PT ต้องมีเหตุผลย้อนดูได้']
    ],
    D04: [
      ['Q04.01', 'วันนี้มีนัดกี่เคส ยืนยันแล้วและยังรอดำเนินการกี่เคส?', '9 · ยืนยัน 7 · พักการดูแล 1', 'urgent', BOOK, 'a.appts', 'นัดที่พักการดูแลยังเห็นอยู่ แต่ห้ามขึ้นว่าพร้อมรักษา'],
      ['Q04.02', 'เคสใดมีความเสี่ยงมาสายหรือเริ่มงานไม่ทัน?', '', 'unknown', BOOK, 'a.appts', 'ไม่มี GPS จึงไม่เดาเวลาถึง'],
      ['Q04.03', 'การยกเลิกมาจากลูกค้าหรือ PT และมีเหตุผลอะไร?', 'คนไข้ 3 · PT 1', 'ok', BOOK, 'a.appts', 'แยกยกเลิกออกจากเลื่อนนัด'],
      ['Q04.04', 'No-show เกิดหลัง PT ถึงหน้างานหรือไม่ และบันทึกหลักฐานครบหรือยัง?', '', 'unknown', BOOK, 'a.appts', 'ไม่มีหลักฐานการถึง ไม่ตัดสิทธิ์หรือคิดค่าปรับอัตโนมัติ'],
      ['Q04.05', 'มี Visit ใดจบแล้วแต่ยังไม่ปิดสถานะหรือรายงาน?', '2 เคส', 'watch', CL, 'a.appts', 'จบการรักษา ส่งรายงาน และปิดงาน เป็นคนละสถานะ'],
      ['Q04.06', 'การแจ้งเตือนก่อนนัดส่งสำเร็จหรือไม่?', '', 'unknown', BOOK, 'a.appts', 'LINE จำลองไม่ใช่หลักฐานการส่งจริง'],
      ['Q04.07', 'นัดครั้งถัดไปของผู้ป่วยรายเดิมถูกจองกับ PT เดิมหรือไม่?', '28 จาก 31', 'ok', BOOK, 'a.appts', 'จองแล้วกับทำเสร็จแล้วเป็นคนละจำนวน']
    ],
    D05: [
      ['Q05.01', 'ยอดชำระที่ยืนยันแล้วตรงกับรายการคำสั่งซื้อหรือไม่?', 'ไม่ตรง 1 รายการ', 'urgent', FIN, 'a.payments', 'สลิปซ้ำหรือ QR เปิดอยู่ ไม่นับเป็นยอดยืนยัน'],
      ['Q05.02', 'Visit ที่ใช้จริงสร้าง Platform Fee เท่าไร?', '', 'policy', FIN, 'a.payments', 'ไม่มีเวอร์ชันค่าธรรมเนียมที่ยืนยัน จึงไม่แสดง 0'],
      ['Q05.03', 'ยอดค้างจ่าย PT เท่าไร และเกิดจากเคสใด?', '', 'policy', FIN, 'a.payments', 'แยกประมาณการ ค้างจ่าย และจ่ายแล้ว เมื่อยืนยันกฎแล้ว'],
      ['Q05.04', 'มีรายการรับเงินซ้ำ หักสิทธิ์ซ้ำ หรือจ่ายซ้ำหรือไม่?', '', 'unknown', FIN, 'a.payments', 'ต้องตรวจจากบันทึกจริงบน Staging'],
      ['Q05.05', 'รายการ Refund อยู่ในขั้นไหน ใครอนุมัติ และจ่ายคืนแล้วหรือยัง?', 'รออนุมัติ 1', 'watch', FIN, 'a.payments', 'อนุมัติแล้วไม่ได้แปลว่าจ่ายคืนแล้ว'],
      ['Q05.06', 'ยอดเงินที่กระทบยอดไม่ได้ค้างกี่วัน?', '1 รายการ · 2 วัน', 'watch', FIN, 'a.payments', 'นับจากวันที่พบ ทุกรายการต้องมีเจ้าของ'],
      ['Q05.07', 'ยอดค่าธรรมเนียมที่ CEO เห็นตรวจย้อนกลับถึง Visit ได้หรือไม่?', '', 'policy', FIN, 'a.payments', 'ย้อนถึง Visit โดยไม่เปิดข้อมูลสุขภาพ']
    ],
    D06: [
      ['Q06.01', 'ลูกค้าซื้อ Trial ซ้ำเกินสิทธิ์ 1 ครั้งหรือไม่?', 'ไม่พบ', 'ok', PKG, 'a.patients', 'จ่ายซ้ำไม่เท่ากับใช้สิทธิ์ซ้ำ'],
      ['Q06.02', 'Package 1/5/10/20 ขายและถูกใช้จริงเท่าไร?', 'ขาย 19 คอร์ส', 'ok', PKG, 'a.payments', 'แยกขายกับใช้ ตามเวอร์ชันสินค้า'],
      ['Q06.03', 'แพ็กเกจที่ซื้อใหม่ก่อนใช้ของเก่าหมด ถูกเรียงใช้ถูกต้องหรือไม่?', '', 'policy', PKG, 'a.payments', 'รอกฎตามสัญญาที่ใช้จริง'],
      ['Q06.04', 'สิทธิ์คงเหลือ แยก Reserved / Used / Available ถูกต้องหรือไม่?', '12 · 74 · 88 ครั้ง', 'ok', PKG, 'a.payments', 'ตัดสิทธิ์ครั้งเดียวเมื่อ PT จบการรักษา'],
      ['Q06.05', 'แพ็กเกจใดใกล้ครบ 365 วัน และเสี่ยงไม่ได้ใช้?', '', 'policy', PKG, 'a.patients', 'ใช้วันหมดอายุตามสัญญาเมื่อยืนยันแล้ว'],
      ['Q06.06', 'ลูกค้าที่จบ Trial หรือ Package แล้วกลับมาซื้อซ้ำกี่คน?', '6 คน', 'ok', PKG, 'a.patients', 'ซื้อซ้ำไม่ปนกับมาใช้บริการซ้ำ'],
      ['Q06.07', 'เมื่อเปลี่ยน PT มีผลต่อราคาและความต่อเนื่องอย่างไร?', '', 'policy', PKG, 'a.appts', 'ยึดราคาตามสัญญา ข้อยกเว้นต้องมีผู้อนุมัติ']
    ],
    D07: [
      ['Q07.01', 'Visit ที่จบแล้วมีรายงานครบกี่เปอร์เซ็นต์?', '94%', 'ok', CL, 'a.appts', 'ร่างไม่นับว่าส่งแล้ว'],
      ['Q07.02', 'รายงานใดเกินกำหนดส่งตามนโยบายที่อนุมัติ?', '2 ฉบับ', 'watch', CL, 'a.appts', 'ภายใน 2 ชั่วโมงและไม่เกิน 22:00 เมื่อยืนยันเวอร์ชันกฎแล้ว'],
      ['Q07.03', 'Goal / SOAP / Family message ครบถ้วนตามแบบฟอร์มหรือไม่?', '96%', 'ok', CL, 'a.appts', 'ความครบไม่ใช่คะแนนคุณภาพการรักษา'],
      ['Q07.04', 'รายงานส่งให้ผู้มีสิทธิ์สำเร็จหรือมีการส่งล้มเหลว?', '', 'unknown', CL, 'a.appts', 'ข้อความถึงญาติไม่ส่ง SOAP ทั้งชุด'],
      ['Q07.05', 'มีการแก้ไขรายงานย้อนหลังหรือไม่ และใครแก้ไข?', '1 ครั้ง', 'ok', CL, 'a.appts', 'เก็บเวอร์ชัน ผู้แก้ และเหตุผล ไม่ทับของเดิม'],
      ['Q07.06', 'Admin และ CEO เข้าถึงข้อมูลสุขภาพเกินสิทธิ์หรือไม่?', '', 'unknown', CL, 'a.queue', 'ต้องมีบัญชีและสิทธิ์จริงก่อนจึงตรวจได้'],
      ['Q07.07', 'เคสใดต้องติดตามความครบถ้วนโดยไม่เปิดเผยรายละเอียดทางคลินิก?', '3 เคส', 'watch', CL, 'a.clinical', 'เปิดงานและเจ้าของงานได้โดยไม่เปิด SOAP ให้ CEO']
    ],
    D08: [
      ['Q08.01', 'วันนี้มีปัญหา Critical กี่เคส และมีใครเป็น Owner?', '2 เคส · มีเจ้าของครบ', 'urgent', OPS, 'a.queue', 'ทุกเคสต้องมีเจ้าของและงานถัดไป'],
      ['Q08.02', 'ปัญหาประเภทใดเกิดซ้ำมากที่สุด?', 'เวลา PT ไม่ตรง', 'watch', OPS, 'a.suspicion', 'การแจ้งเตือนซ้ำไม่นับเป็นเรื่องใหม่'],
      ['Q08.03', 'เคสที่ชำระเงินแล้วแต่ยังจับคู่ไม่ได้ค้างกี่ชั่วโมง?', 'นานสุด 0.8 ชม.', 'watch', MATCH, 'a.match', 'ไม่รวมเคสที่พักรอทีมคลินิก'],
      ['Q08.04', 'ข้อร้องเรียนหรือเหตุการณ์ไม่พึงประสงค์อยู่ในสถานะใด?', '', 'unknown', CL, 'a.queue', 'ยังไม่มีรายการร้องเรียนในระบบ'],
      ['Q08.05', 'ความผิดพลาดเรื่องเงินและ Session มีเคสใดต้องหยุด Automation?', '1 เคส', 'urgent', FIN, 'a.payments', 'หยุดเฉพาะรายการที่ผิด CEO กดแก้บัญชีเองไม่ได้'],
      ['Q08.06', 'การแจ้งเตือนล้มเหลวส่งผลให้เกิด Missed Visit หรือไม่?', '', 'unknown', BOOK, 'a.appts', 'แสดงความสัมพันธ์ ไม่สรุปว่าเป็นสาเหตุ'],
      ['Q08.07', 'เคสใดเกิน SLA และเมื่อปิดแล้วมีหลักฐานการแก้ไขหรือไม่?', '', 'policy', OPS, 'a.queue', 'ยังไม่มีเวอร์ชัน SLA ปิดเคสต้องมีหลักฐาน']
    ]
  };
  const VIEWS = [
    { id: 'D01', icon: 'layout-dashboard', name: 'ภาพรวม', title: 'ภาพรวม CEO', sub: 'ธุรกิจโตจากไหน ลูกค้าหลุดตรงไหน ต้องตามเรื่องอะไรวันนี้', kpi: [['จ่ายแล้วมารับบริการ', '81%', 'ok'], ['เปลี่ยนเป็นคอร์ส', '37%', 'ok'], ['ค่าธรรมเนียมที่เกิดจริง', '', 'policy']], viz: { t: 'เส้นทางลูกค้า 30 วัน', bars: [['คัดกรองแล้ว', 120], ['ผ่านด่านความปลอดภัย', 96], ['จ่ายเงินแล้ว', 64], ['มีนัดแล้ว', 58], ['เยี่ยมครั้งแรกจบ', 52], ['ซื้อคอร์ส', 19]] } },
    { id: 'D02', icon: 'stethoscope', name: 'นักกายภาพ', title: 'นักกายภาพและกำลังรับงาน', sub: 'มีคนพร้อมรับงานจริงกี่คน โซนไหนขาด ใครต้องตาม', kpi: [['พร้อมรับงานจริง', '21 คน', 'watch'], ['โซนที่ขาด', '2 โซน', 'watch'], ['รอพิจารณาทักษะ', '7 งาน', 'watch']], viz: { t: 'จากสมัครจนพร้อมรับงาน', bars: [['สมัคร', 46], ['ใบประกอบผ่าน', 38], ['มีพื้นที่และตาราง', 26], ['ยอมรับข้อตกลง', 21]], foot: 'ตอบ "ทำได้" เองไม่นับเป็นกำลังรับงาน', cta: ['a.caps', 'ดูความสามารถ PT'] } },
    { id: 'D03', icon: 'users-round', name: 'จับคู่', title: 'ศูนย์จับคู่', sub: 'แยกเคสที่พร้อมจับคู่ ออกจากเคสที่ต้องรอทีม', kpi: [['จ่ายแล้ว รอจับคู่', '5 เคส', 'urgent'], ['จ่ายแล้ว พักตรวจคลินิก', '2 เคส', 'watch'], ['รอทักษะ PT', '3 เคส', 'watch'], ['นาฬิกา 30/90', '', 'policy']], live: true, viz: { t: 'เหตุผลที่ยังจับคู่ไม่ได้', bars: [['เวลาไม่ตรง', 6], ['รอทักษะ PT', 3], ['พื้นที่', 2], ['ไม่มีคนกดรับ', 2]] } },
    { id: 'D04', icon: 'calendar-days', name: 'นัดและเยี่ยม', title: 'นัดและการเยี่ยม', sub: 'วันนี้มีอะไร เคสไหนนัดอยู่แต่ยังห้ามเริ่มรักษา', kpi: [['นัดวันนี้', '9 เคส', 'ok'], ['นัดอยู่ · พักการดูแล', '1 เคส', 'urgent'], ['จบแล้วรอรายงาน', '2 เคส', 'watch']], live: true, viz: { t: 'นัดวันนี้', bars: [['ยืนยันแล้ว', 7], ['พักการดูแล', 1], ['รอดำเนินการ', 1]] } },
    { id: 'D05', icon: 'wallet', name: 'การเงิน', title: 'การเงิน', sub: 'เงินเข้าตรงไหม อะไรค้าง ใครต้องจัดการ', kpi: [['รายการยืนยันแล้ว', '83 รายการ', 'ok'], ['กระทบยอดไม่ได้', '1 รายการ', 'urgent'], ['ค่าธรรมเนียมและค้างจ่าย PT', '', 'policy']], note: 'ยังไม่แสดงยอดเงินเป็นบาท เพราะต้องยืนยันแหล่งราคาที่ใช้จริงก่อน', viz: { t: 'สถานะรายการจ่าย', bars: [['ยืนยันแล้ว', 83], ['รอตรวจสลิป', 4], ['ไม่ตรง', 1]] } },
    { id: 'D06', icon: 'package', name: 'คอร์ส', title: 'คอร์สและสิทธิ์คงเหลือ', sub: 'ขายได้เท่าไร ใช้ไปเท่าไร เหลือเท่าไร', kpi: [['คอร์สที่ขาย', '19 คอร์ส', 'ok'], ['ซื้อซ้ำ', '6 คน', 'ok'], ['ใกล้หมดอายุ', '', 'policy']], stack: [['ใช้แล้ว', 74, 'u'], ['กันไว้สำหรับนัด', 12, 'r'], ['พร้อมใช้', 88, 'a']] },
    { id: 'D07', icon: 'file-check-2', name: 'รายงาน', title: 'รายงานคลินิก', sub: 'รายงานครบไหม อะไรค้าง โดย CEO เห็นแค่ภาพรวมกับข้อมูลเคส ไม่เห็นรายละเอียดการรักษา', kpi: [['รายงานครบ', '94%', 'ok'], ['เกินกำหนด', '2 ฉบับ', 'watch'], ['ส่งถึงผู้มีสิทธิ์', '', 'unknown']], viz: { t: 'รายงาน 30 วัน', bars: [['ส่งแล้ว', 49], ['ยังเป็นร่าง', 1], ['เกินกำหนด', 2]] } },
    { id: 'D08', icon: 'siren', name: 'ปัญหา', title: 'ปัญหาและความเสี่ยง', sub: 'เรื่องไหนร้ายแรง ใครรับผิดชอบ และปิดด้วยหลักฐานอะไร', kpi: [['Critical วันนี้', '2 เคส', 'urgent'], ['หยุด Automation', '1 เคส', 'urgent'], ['ร้องเรียน', '', 'unknown']], live: true, viz: { t: 'เรื่องที่เกิดซ้ำ', bars: [['เวลา PT ไม่ตรง', 6], ['ข้อมูลเปลี่ยนหลังจอง', 3], ['สลิปไม่ตรง', 1]] } }
  ];
  const pill = st => `<span class="pill ${ST[st][1]}">${ST[st][0]}</span>`;
  const kpiCard = ([t, val, st]) => `<div class="dc-kpi ${st}"><span>${esc(t)}</span>${val ? `<b>${esc(val)}</b>` : `<b class="none">${ST[st][0]}</b>`}${val && st !== 'ok' ? pill(st) : ''}</div>`;
  const bars = v => { const max = Math.max(...v.bars.map(x => x[1])); return `<section class="dc-card"><h2>${esc(v.t)}</h2><div class="dc-bars">${v.bars.map(([l, n]) => `<div class="dc-bar"><span>${esc(l)}</span><div class="tr"><i style="width:${Math.max(3, n / max * 100)}%"></i></div><b>${n}</b></div>`).join('')}</div>${v.foot ? `<p class="small" style="margin:0">${esc(v.foot)}</p>` : ''}${v.cta ? `<button class="btn ghost" data-go="${v.cta[0]}">${esc(v.cta[1])}${I('chevron-right')}</button>` : ''}</section>`; };
  const stack = rows => { const t = rows.reduce((a, x) => a + x[1], 0); return `<section class="dc-card"><h2>สิทธิ์ทั้งหมด ${t} ครั้ง</h2><div class="dc-stack" role="img" aria-label="${rows.map(x => `${x[0]} ${x[1]}`).join(' ')}">${rows.map(x => `<i class="${x[2]}" style="width:${x[1] / t * 100}%"></i>`).join('')}</div><div class="dc-leg">${rows.map(x => `<span><i class="${x[2]}"></i>${esc(x[0])} <b>${x[1]}</b></span>`).join('')}</div></section>`; };
  /* The one real thing on this page: the case being rehearsed right now, sorted the way Master §9 asks. */
  function liveCase(s) {
    const r = s.request; if (!r) return ['ยังไม่มีเคสในห้องซ้อม', 'gray', 'a.queue'];
    const hold = SC.visitHold && SC.visitHold(s);
    if (r.status === 'CLINICAL_REVIEW') return ['พักตรวจคลินิก · ไม่นับว่ารอจับคู่', 'wait', 'a.clinical'];
    if (r.status === 'ASSESS_HOLD') return ['ประเมินอย่างเดียว · พักจ่ายและพักจับคู่', 'wait', 'a.clinical'];
    if (r.status === 'BOOKED') return hold ? ['นัดอยู่ · พักการดูแล', 'warn', 'a.appts'] : ['มีนัดแล้ว', '', 'a.appts'];
    if (r.status === 'OFFERED') return SC.offerBlock(s) ? ['ส่ง Offer แล้ว · รอทักษะ PT', 'wait', 'a.caps'] : ['ส่ง Offer แล้ว · รอ PT ตอบ', '', 'a.match'];
    if (r.status === 'PAID') return ['จ่ายแล้ว · รอจับคู่', 'warn', 'a.match'];
    if (['PAYMENT_PENDING', 'SLIP_SENT'].includes(r.status)) return ['รอชำระเงิน', 'gray', 'a.payments'];
    return ['กำลังดำเนินการ', 'gray', 'a.queue'];
  }
  const liveStrip = s => { const [t, tone, go] = liveCase(s); return `<section class="dc-live"><div class="grow"><span class="kick">เคสที่กำลังซ้อมตอนนี้</span>${(s.request || {}).ref ? `<b>${esc(s.request.ref)}</b>` : ''}<span class="pill ${tone}">${esc(t)}</span></div><button class="btn ghost" data-go="${go}">เปิดเคส${I('chevron-right')}</button></section>`; };
  const qRow = (d, row) => { const [id, q, val, st, owner, go, how] = row, open = d.q === id; return `<div class="dc-q ${open ? 'open' : ''}"><button class="dc-qh" data-act="dashQ" data-q="${id}" aria-expanded="${open}"><span class="grow"><small>${id}</small><span class="t">${esc(q)}</span></span><span class="v">${val ? `<b>${esc(val)}</b>` : ''}${pill(st)}</span>${I(open ? 'chevron-up' : 'chevron-down')}</button>${open ? `<div class="dc-qb"><dl class="kv aa-kv"><dt>นับอย่างไร</dt><dd>${esc(how)}</dd><dt>ใครดูแล</dt><dd>${esc(owner)}</dd><dt>อัปเดต</dt><dd>ข้อมูลตัวอย่าง · ยังไม่ต่อข้อมูลจริง</dd></dl><button class="btn" data-go="${go}">เปิดหน้าทำงาน${I('chevron-right')}</button></div>` : ''}</div>`; };
  SC.screen('a.dash', {
    role: 'admin',
    render(s) {
      const d = s.dash = s.dash || { v: 'D01', q: null, f: 'all' }, view = VIEWS.find(x => x.id === d.v) || VIEWS[0], rows = Q[view.id];
      const shown = d.f === 'watch' ? rows.filter(r => ['watch', 'urgent'].includes(r[3])) : d.f === 'none' ? rows.filter(r => ['unknown', 'policy'].includes(r[3])) : rows;
      const urgent = VIEWS.flatMap(x => Q[x.id].filter(r => r[3] === 'urgent').map(r => [x, r]));
      const tabs = `<nav class="dc-tabs" aria-label="มุมมอง Dashboard">${VIEWS.map(x => { const n = Q[x.id].filter(r => r[3] === 'urgent').length; return `<button class="${x.id === view.id ? 'on' : ''}" aria-current="${x.id === view.id ? 'page' : 'false'}" data-pick="dash.v" data-value="${x.id}">${I(x.icon)}${x.name}${n ? `<span>${n}</span>` : ''}</button>`; }).join('')}</nav>`;
      const today = view.id === 'D01' ? `<section class="dc-card"><h2>ต้องตามวันนี้</h2>${urgent.map(([x, r]) => `<button class="dc-urgent" data-pick="dash.v" data-value="${x.id}"><span class="tile">${I(x.icon)}</span><span class="grow"><b>${esc(r[2])}</b><small>${esc(x.name)} · ${esc(r[4])}</small></span>${I('chevron-right')}</button>`).join('')}</section>` : '';
      return SC.adminShell(s, 'a.dash', { kick: 'Central Admin', title: view.title, sub: view.sub, right: ui.sample() }, `
        ${tabs}
        <p class="dc-note">${I('info')}<span><b>ข้อมูลตัวอย่างทั้งหน้า</b> ใช้ดูหน้าตาและวิธีอ่าน ยังไม่ใช่ตัวเลขจริง · 30 วันล่าสุด เวลาไทย${view.note ? ` · ${esc(view.note)}` : ''}</span></p>
        <div class="dc-kpis">${view.kpi.map(kpiCard).join('')}</div>
        ${view.live ? liveStrip(s) : ''}
        ${today}
        <div class="dc-two">${view.viz ? bars(view.viz) : ''}${view.stack ? stack(view.stack) : ''}</div>
        <section class="dc-card"><div class="row between wrap"><h2>${rows.length} คำถามของมุมมองนี้</h2><div class="dc-f">${[['all', 'ทั้งหมด'], ['watch', 'ต้องดู'], ['none', 'ยังตอบไม่ได้']].map(([k, t]) => `<button class="${d.f === k ? 'on' : ''}" data-pick="dash.f" data-value="${k}">${t}</button>`).join('')}</div></div>
          <div class="dc-qs">${shown.length ? shown.map(r => qRow(d, r)).join('') : '<p class="small" style="margin:0">ไม่มีคำถามในกลุ่มนี้</p>'}</div></section>`);
    }
  });
  SC.action('dashQ', (s, c) => { const d = s.dash = s.dash || {}; d.q = d.q === c.data.q ? null : c.data.q; });
  /* ---------- PT capability (Master D02/D07, R4 §7): what a PT says is kept apart from what a reviewer decided. ---------- */
  const taskCount = p => { const ids = Object.keys(p.caps || {}), dec = p.capDecisions || {}; return { asked: ids.filter(id => p.caps[id] !== 'no').length, ok: ids.filter(id => (dec[id] || {}).status === 'APPROVED').length, wait: ids.filter(id => (dec[id] || {}).status === 'PENDING' || (!dec[id] && (p.caps[id] === 'ask' || (id[0] === 'S' && p.caps[id] === 'can')))).length, no: ids.filter(id => (dec[id] || {}).status === 'REJECTED').length }; };
  const yes = (on, t) => `<span class="dc-yn ${on ? 'y' : 'n'}">${I(on ? 'check' : 'minus')}${t}</span>`;
  const SAMPLE_CAPS = [['s1', 1, 1, 1, 14, 2, 1], ['s3', 1, 1, 0, 11, 0, 2], ['s4', 1, 0, 1, 16, 3, 0], ['s7', 0, 0, 0, 9, 0, 4]];
  const ptRow = (name, tag, lic, terms, sched, asked, ok, wait, go) => `<div class="dc-pt"><div class="who"><b>${esc(name)}</b>${tag}</div><div class="gates">${yes(lic, 'ใบประกอบ')}${yes(terms, 'ข้อตกลง')}${yes(sched, 'ตาราง')}</div><div class="caps"><span><b>${asked}</b>PT ตอบว่าทำได้หรือขอคุย</span><span class="ok"><b>${ok}</b>ทีมอนุมัติ</span><span class="w"><b>${wait}</b>รอพิจารณา</span></div>${go || ''}</div>`;
  SC.screen('a.caps', {
    role: 'admin',
    render(s) {
      const p = s.pt, me = taskCount(p), hasMe = p.status !== 'NONE', dec = p.capDecisions || {};
      const queue = Object.entries(p.caps || {}).filter(([id, v]) => (dec[id] || {}).status === 'PENDING' || (!dec[id] && (v === 'ask' || (id[0] === 'S' && v === 'can'))));
      const name = hasMe ? SC.me().name : 'PT ในห้องซ้อม';
      return SC.adminShell(s, 'a.caps', { kick: 'ทีม PT', title: 'ความสามารถ PT', sub: 'สิ่งที่ PT ตอบ กับสิ่งที่ทีมอนุมัติ เป็นคนละเรื่อง การตอบเองไม่นับเป็นกำลังรับงาน' }, `
        <p class="dc-note">${I('scale')}<span><b>ตามมติ D1–D3</b> งาน Core (C01–C17) ที่ตอบ "ทำได้" ใช้จับคู่ได้ งาน Specialty และข้อที่เคยขอคุยต้องให้ Clinical Lead 1 คนอนุมัติ · เกณฑ์หลักฐานยังรอ Clinical Leads ตรวจรับ</span></p>
        <div class="dc-kpis"><div class="dc-kpi watch"><span>รอพิจารณา (ห้องซ้อม)</span><b>${queue.length} งาน</b></div><div class="dc-kpi ok"><span>ทีมอนุมัติแล้ว</span><b>${me.ok} งาน</b></div><div class="dc-kpi ok"><span>ไม่อนุมัติ</span><b>${me.no} งาน</b></div></div>
        <section class="dc-card"><div class="row between wrap"><h2>คิวรอพิจารณา</h2><span class="pill wait">${queue.length} งาน</span></div>
          ${queue.length ? queue.map(([id, v]) => `<div class="dc-cq"><span class="tile gold">${I('hourglass')}</span><span class="grow"><b>${esc(SC.CLIN.label(id))}</b><small>${esc(name)} · PT ตอบ: ${v === 'ask' ? 'ขอคุยก่อน' : v === 'can' ? 'ทำได้' : 'ยังไม่ถนัด'}</small></span><button class="btn sm ghost" data-act="capsOpen">พิจารณา</button></div>`).join('') : '<p class="small" style="margin:0">ไม่มีงานรอพิจารณาในห้องซ้อม</p>'}</section>
        <section class="dc-card"><h2>นักกายภาพ</h2><div class="dc-pts">
          ${ptRow(name, '<span class="pill">ห้องซ้อม</span>', p.status === 'VERIFIED', !!p.agreement, !!(p.schedule && p.schedule.sent), me.asked, me.ok, queue.length)}
          ${SAMPLE_CAPS.map(([id, l, t, sc, a, o, w]) => ptRow((SC.SAMPLE_PTS.find(x => x.id === id) || {}).name || id, ui.sample(), !!l, !!t, !!sc, a, o, w)).join('')}
        </div></section>
        <div id="capsDetail">${hasMe && Object.keys(p.caps || {}).length ? SC.capsCard(s) : ''}</div>`);
    }
  });
  SC.action('capsOpen', () => { const n = document.querySelector('#capsDetail'); if (n) n.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  /* The PT's own view: their answer and the team's result, side by side. */
  SC.screen('t.caps', {
    role: 'pt',
    render(s) {
      const p = s.pt, ids = [...new Set(SC.CLIN.services.filter(x => (p.services || []).includes(x.id)).flatMap(x => x.tasks))].filter(id => !SC.CLIN.restricted.includes(id)).sort((a, b) => (a[0] === b[0] ? 0 : a[0] === 'C' ? -1 : 1) || a.localeCompare(b)), dec = p.capDecisions || {};
      const c = taskCount(p), res = id => { const d = dec[id]; if (d) return d.status === 'APPROVED' ? ['ทีมอนุมัติแล้ว', ''] : d.status === 'REJECTED' ? ['ยังไม่อนุมัติ', 'warn'] : ['รอทีมพิจารณา', 'wait']; if (p.caps[id] === 'ask') return ['รอทีมพิจารณา', 'wait']; if (p.caps[id] === 'no') return ['ไม่รับงานนี้', 'gray']; if (id[0] === 'S' && p.caps[id] === 'can') return ['รอทีมดูหลักฐาน', 'wait']; return p.caps[id] ? ['คำตอบของคุณ', 'gray'] : ['ยังไม่ตอบ', 'gray']; };
      const sorted = [...ids].sort((a, b) => (res(a)[1] === 'wait' ? 0 : 1) - (res(b)[1] === 'wait' ? 0 : 1));
      return `<div class="scr">${ui.bar('งานที่รับ')}<div class="body">
        <div class="dc-ptsum"><div><b>${c.ok}</b><span>ทีมอนุมัติ</span></div><div class="w"><b>${c.wait}</b><span>รอพิจารณา</span></div><div><b>${ids.filter(id => p.caps[id] === 'can').length}</b><span>ตอบว่าทำได้</span></div></div>
        <p class="note" style="margin:0">แก้คำตอบได้ตลอด แต่การแก้เองไม่ทำให้งานที่รอพิจารณาผ่าน งานอื่นรับได้ตามปกติ</p>
        ${sorted.length ? sorted.map(id => { const [t, tone] = res(id); return `<div class="card flat dc-tt" data-task="${id}"><div class="row between" style="gap:8px;align-items:flex-start"><b>${esc(SC.CLIN.label(id))}</b><span class="pill ${tone}">${t}</span></div><small>${esc(SC.CLIN.tasks[id])}</small><div class="tt-seg" role="group" aria-label="${esc(SC.CLIN.label(id))}">${[['can', 'ทำได้'], ['no', 'ยังไม่ถนัด'], ['ask', 'ขอคุยก่อน']].map(([v, l]) => `<button aria-pressed="${p.caps[id] === v}" data-act="capPick" data-id="${id}" data-v="${v}">${l}</button>`).join('')}</div>${dec[id] && dec[id].reason ? `<small>เหตุผลจากทีม: ${esc(dec[id].reason)}</small>` : ''}</div>`; }).join('') : ui.empty('list-checks', 'ยังไม่ได้เลือกกลุ่มงาน', 'เลือกกลุ่มงานตอนสร้างโปรไฟล์ก่อน', '')}
        <div class="tt-cap lock card flat"><b>${esc(SC.CLIN.label('S06'))}</b><small>${I('lock')} ยังไม่เปิดรับ ทีมจะติดต่อเอง</small></div>
      </div>${ui.tabs('pt', 't.hub')}</div>`;
    }
  });
  /* ---------- "มาใหม่ · รอตรวจ": what the owner should look at next, on the flow and on the screen itself ---------- */
  const fireAct = SC.fireAct = (name, data) => { const b = document.createElement('button'); b.dataset.act = name; Object.assign(b.dataset, data || {}); (document.querySelector('#dev .scr') || document.body).appendChild(b); b.click(); };
  /* Start a sample BED-04 case at the point a reviewer wants to see. Replaces the rehearsal in progress. */
  function demoCase({ allow = ['C01', 'C11'], pending = [], book = false, pay = true, limits = 'No suction or airway clearance' } = {}) {
    SC.reset(); SC.jump(4); const s = SC.s;
    Object.assign(s.patient, { name: 'คุณทดสอบ', legalName: 'ทดสอบ สมมติ', phone: '0800000000', bookingFor: 'SELF', goals: ['WALK'], goalOther: '', group: 'BED', branch: { lift: 'N1', helpers: 'N1', pneu: 'YES', phlegm: 'HAS', cough: 'WEAK', clear: 'YES' }, health: { q1: 'NO', q3: 'NO', q4: 'NO', q5: 'NO', q6: 'NO' }, bp: { unknown: true }, intakeStep: 8, chosenPt: 'me', address: Object.assign({}, s.patient.address, { district: 'บางนา' }) });
    SC.go('p.intake'); fireAct('submitRequest');
    s.request.preferredPt = 'me';
    const caps = {}; Object.keys(SC.CLIN.en).forEach(id => { if (id !== 'S06') caps[id] = 'can'; }); pending.forEach(id => { caps[id] = 'ask'; });
    Object.assign(s.pt, { services: ['01', '02', '03', '04', '05', '06'], zones: ['บางนา'], status: 'VERIFIED', agreement: true, photoApproved: true, caps, capLog: [], capDecisions: Object.fromEntries(['C14'].concat(pending).map(id => [id, { status: 'PENDING', at: 'ตัวอย่าง' }])) });
    caps.C14 = 'ask'; s.pt.schedule = Object.assign({}, s.pt.schedule, { sent: true });
    if (allow) { Object.assign(s.request.review, { allow, limits, byId: 'palm', reason: 'ตัวอย่างสำหรับตรวจ' }); SC.clinClear(s, SC.line); }
    if (allow && pay) { s.request.slip = 'sample'; SC.autoPay(s, SC.line); }
    if (book) { fireAct('acceptOffer', { offer: s.request.offerId }); }
    return s;
  }
  const ITEMS = [
    { id: 'match-v1', st: 'new', role: 'แอดมิน', t: 'จับคู่ PT หลายคน พร้อมเหตุผล', d: 'คนไข้ 1 ราย กับ PT ตัวอย่าง 10 คน ดูว่าใครผ่าน ใครไม่ผ่าน เพราะอะไร', screen: 'a.match', open() { SC.MATCH.demo(); } },
    { id: 'copy-v1', st: 'new', role: 'พี่ปาล์ม · นัท · บอส', t: 'ตรวจข้อความไทย 52 ข้อ', d: 'อ่านทีละการ์ด กดผ่านหรือขอแก้ แล้วคัดลอกผลส่งกลับ', screen: 'copy', open() { SC.openCopy(); } },
    { id: 'dash-v1', st: 'new', role: 'แอดมิน', t: 'Dashboard 8 มุมมอง', d: 'ดูว่าการจัดหน้าและวิธีอ่านตรงที่พี่ปาล์มขอไหม', screen: 'a.dash', open() { SC.go('a.dash'); } },
    { id: 'caps-admin-v1', st: 'new', role: 'แอดมิน', t: 'ความสามารถ PT', d: 'แยกคำตอบของ PT ออกจากผลอนุมัติ พร้อมคิวรอพิจารณา', screen: 'a.caps', open() { demoCase(); SC.capPick(SC.s, 'C01', 'ask'); SC.go('a.caps'); } },
    { id: 'caps-pt-v1', st: 'new', role: 'นักกายภาพ', t: 'หน้า "งานที่รับ" ของ PT', d: 'PT เห็นคำตอบของตัวเองคู่กับผลจากทีม', screen: 't.caps', open() { demoCase(); SC.capPick(SC.s, 'C01', 'ask'); SC.go('t.caps'); } },
    { id: 'ack-v1', st: 'new', role: 'นักกายภาพ', t: 'ขอบเขตงานและการรับทราบ', d: 'CLIN-ACK-01 ดูงานที่อนุมัติ ข้อจำกัด และต้องกดรับทราบก่อนเริ่ม', screen: 't.visit', open() { demoCase({ book: true }); SC.go('t.visit', { n: 1 }); } },
    { id: 'd6-hold-v1', st: 'new', role: 'คนไข้', t: 'ประเมินอย่างเดียว: พักจ่าย', d: 'มติ D6 ยังไม่เปิดจ่ายและไม่ส่ง Offer ทีมติดต่อกลับ', screen: 'p.result', open() { demoCase({ allow: ['C01'], limits: 'Assessment only; no S05 Airway Clearance or S06 Airway Suction' }); SC.go('p.result'); } },
    { id: 'r4-offer-v1', st: 'check', role: 'นักกายภาพ', t: 'Offer ที่ยังรับไม่ได้', d: 'FIX-R4-03 ไม่นับใน "ต้องตอบ" และบอกเหตุผลก่อนกด', screen: 't.work', open() { demoCase(); SC.capPick(SC.s, 'C01', 'ask'); SC.go('t.work'); } },
    { id: 'profile-v2', st: 'check', role: 'คนไข้', t: 'โปรไฟล์ PT แบบใหม่', d: 'รูปปก แถบตัวเลข และแท็บตามรายการล่าสุด', screen: 'p.pt', open() { SC.s.patient.viewPt = 's1'; SC.s.patient.ptTab = 'work'; SC.go('p.pt'); } }
  ];
  SC.REVIEW_ITEMS = ITEMS;
  const KEY = 'sc-reviewed-v1';
  const readDone = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const writeDone = x => { try { localStorage.setItem(KEY, JSON.stringify(x)); } catch (e) { /* the strip still works for this visit */ } };
  let done = readDone();
  SC.isNewScreen = id => ITEMS.some(x => x.screen === id && !done.includes(x.id));
  const stLabel = { new: 'มาใหม่', check: 'รอตรวจ' };
  function paint(s, v) {
    const left = ITEMS.filter(x => !done.includes(x.id)), box = document.getElementById('rvbox');
    if (box) box.innerHTML = `<div class="rv-head"><span class="rv-mark">${I('sparkles')}</span><div class="grow"><b>มาใหม่ · รอตรวจ</b><small>${left.length ? `เหลือ ${left.length} เรื่องให้บอสดู · ป้ายเดียวกันนี้อยู่บนผังโฟลว์ด้านล่าง` : 'ตรวจครบแล้ว'}</small></div></div>
      <div class="rv-list">${ITEMS.map(x => { const ok = done.includes(x.id); return `<article class="rv-card is-${x.st} ${ok ? 'done' : ''}" data-rv-card="${x.id}"><div class="row between"><span class="rv-tag ${ok ? 'is-ok' : 'is-' + x.st}">${ok ? 'ตรวจแล้ว' : stLabel[x.st]}</span><small>${esc(x.role)}</small></div><b>${esc(x.t)}</b><p>${esc(x.d)}</p><div class="rv-acts"><button class="btn sm" data-rv-open="${x.id}">เปิดดู${I('arrow-right')}</button><button class="btn sm ghost" data-rv-done="${x.id}">${ok ? 'เอาป้ายกลับ' : 'ตรวจแล้ว'}</button></div></article>`; }).join('')}</div><p class="rv-foot">บางเรื่องเปิดพร้อมเคสตัวอย่าง จึงเริ่มห้องซ้อมใหม่</p>`;
    document.querySelectorAll('#flowsvg [data-rv-screen]').forEach(g => { const it = ITEMS.find(x => x.screen === g.dataset.rvScreen && !done.includes(x.id)); g.style.display = it ? '' : 'none'; if (it) { g.setAttribute('class', `rv-chip is-${it.st}`); g.querySelector('text').textContent = stLabel[it.st]; } });
    const note = document.getElementById('rvnote'), at = v.at[v.role], cur = ITEMS.find(x => x.screen === at && !done.includes(x.id));
    if (note) note.innerHTML = cur ? `<div class="rv-note is-${cur.st}"><span class="rv-tag is-${cur.st}">${stLabel[cur.st]}</span><span class="grow">${esc(cur.d)}</span><button class="btn sm ghost" data-rv-done="${cur.id}">ตรวจแล้ว</button></div>` : '';
  }
  SC.onShell(paint);
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-rv-open]'), k = e.target.closest('[data-rv-done]');
    if (o) { const it = ITEMS.find(x => x.id === o.dataset.rvOpen); if (it) { it.open(); SC.render(); const d = document.getElementById('dev'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
    if (k) { const id = k.dataset.rvDone; done = done.includes(id) ? done.filter(x => x !== id) : [...done, id]; writeDone(done); paint(SC.s, SC.v); SC.render(); }
  });
})();
