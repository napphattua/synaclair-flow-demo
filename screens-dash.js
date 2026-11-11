/* screens-dash.js · Central Admin (พี่ปาล์ม Master Prompt v1.0 + R4 addendum): one admin, 8 views, 56 Q-IDs that drill into the existing screens.
   PT capability view, the PT's own "งานที่รับ" screen, and the "มาใหม่ · รอตรวจ" strip for the owner's review.
   Every number here is labelled sample data. What can't be measured says so instead of showing 0. */
(function () {
  'use strict';
  const { esc, ui } = SC, I = ui.icon;
  const ST = { ok: ['ปกติ', ''], watch: ['ต้องดู', 'wait'], urgent: ['ต้องทำวันนี้', 'warn'], unknown: ['ยังวัดไม่ได้', 'gray'], policy: ['รอยืนยันนโยบาย', 'gray'] };
  const OPS = 'ทีมปฏิบัติการ', MATCH = 'ทีมจับคู่', BOOK = 'ทีมนัด', FIN = 'การเงิน', PTA = 'ทีม PT', CL = 'Clinical Lead', PKG = 'ทีมคอร์ส';
  /* [Q-ID, the question, sample value, state, owner, existing screen, how it is counted] */
  const Q = {
    D01: [
      ['Q01.01', 'ธุรกิจโตจากลูกค้าใหม่ หรือจากลูกค้าเดิมที่กลับมาใช้บริการ?', 'ใหม่ 38 · เดิม 14', 'ok', OPS, 'a.patients', 'นับคนไม่ซ้ำ จากการเยี่ยมครั้งแรกที่จบแล้ว'],
      ['Q01.02', 'ลูกค้าหยุดกลางทางที่ขั้นไหนมากที่สุด?', 'คัดกรอง → จ่าย', 'watch', OPS, 'a.queue', 'เคสที่พักรอทีมคลินิกไม่นับว่าหลุด'],
      ['Q01.03', 'จ่ายค่าครั้งแรก (ClairMatch) แล้ว มารับบริการจริงกี่ %?', '81%', 'ok', OPS, 'a.appts', 'เคสที่จ่ายแล้วแต่ยังพักตรวจ ไม่นับว่าหลุดหรือจบ'],
      ['Q01.04', 'เปลี่ยนเป็นคอร์ส 5 / 10 / 15 ครั้ง ได้เท่าไร แบบไหนมากที่สุด?', '37% · 10 ครั้ง', 'ok', PKG, 'a.payments', 'นับเมื่อเงินผ่านการยืนยัน เปิด QR ไม่นับว่าซื้อ'],
      ['Q01.05', 'ค่าธรรมเนียมแพลตฟอร์มจากครั้งที่ไปดูแลจริงเท่าไร?', '', 'unknown', FIN, 'a.payments', 'ใช้ฐาน Price List v1.0: ClairMatch 10% · จ่ายรายครั้ง 12% · คอร์ส 16/14/10% · ยังไม่มีข้อมูลจริงให้นับ'],
      ['Q01.06', 'โซนไหนคนขอมาก แต่ส่งนักกายภาพไม่ทัน?', 'ฝั่งธนบุรี', 'watch', MATCH, 'a.match', 'หนึ่งคำขอนับหนึ่งเคส แม้เลือกหลายเวลา'],
      ['Q01.07', 'ตัวเลขที่ลดลงเกิดจากการตลาด การจับคู่ หรือการให้บริการ?', '', 'unknown', OPS, 'a.queue', 'ยังไม่มีข้อมูลแคมเปญ จึงไม่เดาสาเหตุ']
    ],
    D02: [
      ['Q02.01', 'PT สมัครมาแล้วกี่คน ผ่านการตรวจใบประกอบวิชาชีพกี่คน?', '46 → 38', 'ok', PTA, 'a.license', 'ผ่านเฉพาะเมื่อทีมตรวจใบประกอบแล้ว'],
      ['Q02.02', 'PT ที่ตรวจใบประกอบผ่านแล้ว และเปิดเขตกับตารางพร้อมรับงานจริง กี่คน?', '21 คน', 'watch', PTA, 'a.pts', 'ต้องมีใบประกอบ พื้นที่ ตาราง และข้อตกลงครบ ไม่ได้แปลว่าผ่านทักษะทุกงาน'],
      ['Q02.03', 'แต่ละโซนมี PT พร้อมรับงานเพียงพอกับคำขอหรือไม่?', 'ขาด 2 โซน', 'watch', MATCH, 'a.pts', 'ใช้พื้นที่ เวลา และเงื่อนไขทางคลินิกร่วมกัน'],
      ['Q02.04', 'ช่วงเวลาว่าง 3 ชั่วโมงถูกใช้ไปเท่าไร และติดข้อจำกัดอะไร?', '58%', 'ok', PTA, 'a.pts', '3 ชั่วโมงรับได้สูงสุด 2 นัด แต่ไม่นับเป็นความจุจริงถ้าเวลาไม่พอ'],
      ['Q02.05', 'PT คนไหนเปิดตารางแต่ไม่รับงานที่เสนอบ่อย?', '3 คน', 'watch', PTA, 'a.pts', 'ไม่นับ Offer ที่ถูกยกเลิก พักตรวจ หรือมีคนอื่นรับก่อน'],
      ['Q02.06', 'วันและช่วงเวลาใดขาดแคลน PT มากที่สุด?', 'จ.–ศ. เย็น', 'watch', MATCH, 'a.pts', 'กดดูรายการเคสในช่วงเวลานั้นได้'],
      ['Q02.07', 'PT ที่หยุดเปิดตารางหรือใบประกอบไม่ผ่าน ควรติดตามอย่างไร?', 'ไม่มีตาราง 9 · ใบไม่ผ่าน 2', 'watch', PTA, 'a.license', 'แยกคิวใบประกอบไม่ผ่านออกจากคิวไม่มีตาราง']
    ],
    D03: [
      ['Q03.01', 'ลูกค้าที่จ่ายเงินแล้วแต่ยังไม่มี PT มีกี่เคส และรอนานเท่าไร?', 'รอ PT 5 เคส · นานสุด 48 นาที', 'urgent', MATCH, 'a.match', 'ไม่รวมเคสที่จ่ายแล้วแต่พักรอทีมคลินิก'],
      ['Q03.02', 'คำขอไหนค้นหาครบ 3 เวลา × ทุกโซนแล้ว และไหนใกล้ครบ 24 ชม. ที่ต้องแจ้งคนไข้?', '', 'policy', MATCH, 'a.match', 'จุดเริ่มนับ 24 ชม. และกำหนดปิดงานของทีมยังรอตัดสิน'],
      ['Q03.03', 'PT ได้รับงานที่เสนอกี่คน ตอบรับ / ปฏิเสธ / ไม่ตอบ กี่คน?', '18 · รับ 9 · ปฏิเสธ 4', 'ok', MATCH, 'a.match', 'ส่งแล้วไม่เท่ากับถึงแล้ว ถ้าไม่มีหลักฐานการส่งถึงให้บอกตรงๆ'],
      ['Q03.04', 'เหตุใดการจับคู่ไม่สำเร็จ: พื้นที่ เวลา หรือไม่มีคนกดรับ?', 'เวลา 6 · ทักษะ 3', 'watch', MATCH, 'a.match', 'PT ที่ถูกตัดออกไม่นับว่าไม่ตอบ'],
      ['Q03.05', 'การกดรับพร้อมกันทำให้มีผู้ได้รับงานมากกว่า 1 คนหรือไม่?', '', 'unknown', MATCH, 'a.match', 'ต้องทดสอบที่ server จริง Simulator พิสูจน์ไม่ได้'],
      ['Q03.06', 'เคสที่ต้องขอเวลาใหม่หรือคืนเงินอยู่ที่ขั้นไหน?', 'ขอเวลาใหม่ 2 · คืนเงิน 1', 'watch', MATCH, 'a.payments', 'แยกสิทธิ์สองเรื่อง ไม่คืนเงินจากการหมดเวลาอัตโนมัติ'],
      ['Q03.07', 'ลูกค้ากลับมาใช้บริการกับ PT เดิมได้ต่อเนื่องหรือไม่?', '91%', 'ok', BOOK, 'a.appts', 'เปลี่ยน PT ต้องมีเหตุผลย้อนดูได้']
    ],
    D04: [
      ['Q04.01', 'วันนี้มีนัดกี่เคส ยืนยันแล้วและยังรอดำเนินการกี่เคส?', 'นัดวันนี้ 9 · ยืนยัน 7 · พักการดูแล 1', 'urgent', BOOK, 'a.appts', 'นัดที่พักการดูแลยังเห็นอยู่ แต่ห้ามขึ้นว่าพร้อมรักษา'],
      ['Q04.02', 'เคสใดมีความเสี่ยงมาสายหรือเริ่มงานไม่ทัน?', '', 'unknown', BOOK, 'a.appts', 'ไม่มี GPS จึงไม่เดาเวลาถึง'],
      ['Q04.03', 'การยกเลิกมาจากลูกค้าหรือ PT และมีเหตุผลอะไร?', 'คนไข้ 3 · PT 1', 'ok', BOOK, 'a.appts', 'แยกยกเลิกออกจากเลื่อนนัด'],
      ['Q04.04', 'No-show เกิดหลัง PT ถึงหน้างานหรือไม่ และบันทึกหลักฐานครบหรือยัง?', '', 'unknown', BOOK, 'a.appts', 'ไม่มีหลักฐานการถึง ไม่ตัดสิทธิ์หรือคิดค่าปรับอัตโนมัติ'],
      ['Q04.05', 'นัดไหนจบแล้วแต่ยังไม่ปิดสถานะหรือรายงาน?', '2 เคส', 'watch', CL, 'a.appts', 'จบการรักษา ส่งรายงาน และปิดงาน เป็นคนละสถานะ'],
      ['Q04.06', 'การแจ้งเตือนก่อนนัดส่งสำเร็จหรือไม่?', '', 'unknown', BOOK, 'a.appts', 'LINE จำลองไม่ใช่หลักฐานการส่งจริง'],
      ['Q04.07', 'นัดครั้งถัดไปของผู้ป่วยรายเดิมถูกจองกับ PT เดิมหรือไม่?', '28 จาก 31', 'ok', BOOK, 'a.appts', 'จองแล้วกับทำเสร็จแล้วเป็นคนละจำนวน']
    ],
    D05: [
      ['Q05.01', 'ยอดชำระที่ยืนยันแล้วตรงกับรายการคำสั่งซื้อหรือไม่?', 'สลิปยอดไม่ตรง 1 รายการ', 'urgent', FIN, 'a.payments', 'สลิปซ้ำหรือ QR เปิดอยู่ ไม่นับเป็นยอดยืนยัน'],
      ['Q05.02', 'ครั้งที่ไปดูแลจริงสร้างค่าธรรมเนียมแพลตฟอร์มเท่าไร?', '', 'unknown', FIN, 'a.payments', 'ใช้ฐาน Price List v1.0: ClairMatch 10% · จ่ายรายครั้ง 12% · คอร์ส 16/14/10% · ยังไม่มีข้อมูลจริง จึงไม่แสดง 0'],
      ['Q05.03', 'ยอดค้างจ่าย PT เท่าไร และเกิดจากเคสใด?', '', 'policy', FIN, 'a.payments', 'แยกประมาณการ ค้างจ่าย และจ่ายแล้ว เมื่อยืนยันกฎแล้ว'],
      ['Q05.04', 'มีรายการรับเงินซ้ำ หักสิทธิ์ซ้ำ หรือจ่ายซ้ำหรือไม่?', '', 'unknown', FIN, 'a.payments', 'ต้องตรวจจากบันทึกจริงบน Staging'],
      ['Q05.05', 'คำขอคืนเงินอยู่ขั้นไหน ใครขอ ใครอนุมัติ ใครโอน และกระทบยอดแล้วหรือยัง?', 'รออนุมัติ 1', 'watch', 'พี่ปาล์ม (CEO) อนุมัติ', 'a.refunds', 'อนุมัติแล้วไม่ได้แปลว่าโอนแล้ว · ผู้ขอ ผู้อนุมัติ ผู้โอน ต้องเป็นคนละคน'],
      ['Q05.06', 'ยอดเงินที่กระทบยอดไม่ได้ค้างกี่วัน?', '1 รายการ · 2 วัน', 'watch', FIN, 'a.payments', 'นับจากวันที่พบ ทุกรายการต้องมีเจ้าของ'],
      ['Q05.07', 'ค่าธรรมเนียมที่ CEO เห็น ย้อนกลับไปถึงนัดแต่ละครั้งได้ไหม?', '', 'policy', FIN, 'a.payments', 'ย้อนถึงนัดโดยไม่เปิดข้อมูลสุขภาพ']
    ],
    D06: [
      ['Q06.01', 'ลูกค้าซื้อ ClairMatch ซ้ำเกินสิทธิ์ 1 ครั้งไหม?', 'ไม่พบ', 'ok', PKG, 'a.patients', 'จ่ายซ้ำไม่เท่ากับใช้สิทธิ์ซ้ำ'],
      ['Q06.02', 'จ่ายรายครั้ง และคอร์ส 5/10/15 ขายและถูกใช้จริงเท่าไร?', 'ขาย 19 คอร์ส', 'ok', PKG, 'a.payments', 'แยกขายกับใช้ ตามเวอร์ชันสินค้า'],
      ['Q06.03', 'แพ็กเกจที่ซื้อใหม่ก่อนใช้ของเก่าหมด ถูกเรียงใช้ถูกต้องหรือไม่?', '', 'policy', PKG, 'a.payments', 'รอกฎตามสัญญาที่ใช้จริง'],
      ['Q06.04', 'สิทธิ์คงเหลือ แยก กันไว้ / ใช้แล้ว / พร้อมใช้ ถูกต้องไหม?', '12 · 74 · 88 ครั้ง', 'ok', PKG, 'a.payments', 'ตัดสิทธิ์ครั้งเดียวเมื่อ PT จบการรักษา'],
      ['Q06.05', 'คอร์สไหนใกล้ครบ 365 วัน และเสี่ยงไม่ได้ใช้?', '', 'unknown', PKG, 'a.payments', 'นับ 365 วันจากวันที่ทีมยืนยันยอดโอน (บอส 7 พ.ย.) · ยังไม่มีข้อมูลจริง'],
      ['Q06.06', 'ลูกค้าที่จบครั้งแรกหรือคอร์สแล้ว กลับมาซื้อซ้ำกี่คน?', '6 คน', 'ok', PKG, 'a.patients', 'ซื้อซ้ำไม่ปนกับมาใช้บริการซ้ำ'],
      ['Q06.07', 'เมื่อเปลี่ยน PT มีผลต่อราคาและความต่อเนื่องอย่างไร?', '', 'policy', PKG, 'a.appts', 'ยึดราคาตามสัญญา ข้อยกเว้นต้องมีผู้อนุมัติ']
    ],
    D07: [
      ['Q07.01', 'นัดที่จบแล้วมีรายงานครบกี่ %?', '94%', 'ok', CL, 'a.appts', 'ร่างไม่นับว่าส่งแล้ว'],
      ['Q07.02', 'รายงานใดเกินกำหนดส่งตามนโยบายที่อนุมัติ?', '2 ฉบับ', 'watch', CL, 'a.appts', 'ภายใน 2 ชั่วโมงและไม่เกิน 22:00 เมื่อยืนยันเวอร์ชันกฎแล้ว'],
      ['Q07.03', 'Goal / SOAP / Family message ครบถ้วนตามแบบฟอร์มหรือไม่?', '96%', 'ok', CL, 'a.appts', 'ความครบไม่ใช่คะแนนคุณภาพการรักษา'],
      ['Q07.04', 'รายงานส่งให้ผู้มีสิทธิ์สำเร็จหรือมีการส่งล้มเหลว?', '', 'unknown', CL, 'a.appts', 'ข้อความถึงญาติไม่ส่ง SOAP ทั้งชุด'],
      ['Q07.05', 'มีการแก้ไขรายงานย้อนหลังหรือไม่ และใครแก้ไข?', '1 ครั้ง', 'ok', CL, 'a.appts', 'เก็บเวอร์ชัน ผู้แก้ และเหตุผล ไม่ทับของเดิม'],
      ['Q07.06', 'Admin และ CEO เข้าถึงข้อมูลสุขภาพเกินสิทธิ์หรือไม่?', '', 'unknown', CL, 'a.queue', 'ต้องมีบัญชีและสิทธิ์จริงก่อนจึงตรวจได้'],
      ['Q07.07', 'เคสใดต้องติดตามความครบถ้วนโดยไม่เปิดเผยรายละเอียดทางคลินิก?', '3 เคส', 'watch', CL, 'a.clinical', 'เปิดงานและเจ้าของงานได้โดยไม่เปิด SOAP ให้ CEO']
    ],
    D08: [
      ['Q08.01', 'วันนี้มีปัญหาร้ายแรงกี่เคส และมีเจ้าของครบไหม?', 'ปัญหาร้ายแรง 2 เคส · มีเจ้าของครบ', 'urgent', OPS, 'a.queue', 'ทุกเคสต้องมีเจ้าของและงานถัดไป'],
      ['Q08.02', 'ปัญหาประเภทใดเกิดซ้ำมากที่สุด?', 'เวลา PT ไม่ตรง', 'watch', OPS, 'a.suspicion', 'การแจ้งเตือนซ้ำไม่นับเป็นเรื่องใหม่'],
      ['Q08.03', 'เคสที่ชำระเงินแล้วแต่ยังจับคู่ไม่ได้ค้างกี่ชั่วโมง?', 'นานสุด 0.8 ชม.', 'watch', MATCH, 'a.match', 'ไม่รวมเคสที่พักรอทีมคลินิก'],
      ['Q08.04', 'ข้อร้องเรียนหรือเหตุการณ์ไม่พึงประสงค์อยู่ในสถานะใด?', '', 'unknown', CL, 'a.queue', 'ยังไม่มีรายการร้องเรียนในระบบ'],
      ['Q08.05', 'ความผิดพลาดเรื่องเงินและสิทธิ์ มีเคสไหนต้องหยุดระบบอัตโนมัติ?', 'หยุดอัตโนมัติ 1 เคส', 'urgent', FIN, 'a.payments', 'หยุดเฉพาะรายการที่ผิด CEO กดแก้บัญชีเองไม่ได้'],
      ['Q08.06', 'การแจ้งเตือนล้มเหลวทำให้พลาดนัดไหม?', '', 'unknown', BOOK, 'a.appts', 'แสดงความสัมพันธ์ ไม่สรุปว่าเป็นสาเหตุ'],
      ['Q08.07', 'เคสไหนเกินกำหนดเวลาที่ตกลงไว้ และปิดแล้วมีหลักฐานการแก้ไขไหม?', '', 'policy', OPS, 'a.queue', 'ยังไม่มีเวอร์ชัน SLA ปิดเคสต้องมีหลักฐาน']
    ]
  };
  const VIEWS = [
    { id: 'D01', icon: 'layout-dashboard', name: 'ภาพรวม', title: 'ภาพรวม CEO', sub: 'ธุรกิจโตจากไหน ลูกค้าหลุดตรงไหน ต้องตามเรื่องอะไรวันนี้', kpi: [['จ่ายแล้วมารับบริการ', '81%', 'ok'], ['เปลี่ยนเป็นคอร์ส', '37%', 'ok'], ['ค่าธรรมเนียมที่เกิดจริง', '', 'policy']], viz: { t: 'เส้นทางลูกค้า 30 วัน', bars: [['คัดกรองแล้ว', 120], ['ผ่านด่านความปลอดภัย', 96], ['จ่ายเงินแล้ว', 64], ['มีนัดแล้ว', 58], ['เยี่ยมครั้งแรกจบ', 52], ['ซื้อคอร์ส', 19]] } },
    { id: 'D02', icon: 'stethoscope', name: 'นักกายภาพ', title: 'นักกายภาพและกำลังรับงาน', sub: 'มีคนพร้อมรับงานจริงกี่คน โซนไหนขาด ใครต้องตาม', kpi: [['พร้อมรับงานจริง', '21 คน', 'watch'], ['โซนที่ขาด', '2 โซน', 'watch'], ['รอพิจารณาทักษะ', '7 งาน', 'watch']], viz: { t: 'จากสมัครจนพร้อมรับงาน', bars: [['สมัคร', 46], ['ใบประกอบผ่าน', 38], ['มีพื้นที่และตาราง', 26], ['ยอมรับข้อตกลง', 21]], foot: 'ตอบ "ทำได้" เองไม่นับเป็นกำลังรับงาน', cta: ['a.caps', 'ดูความสามารถ PT'] } },
    { id: 'D03', icon: 'users-round', name: 'จับคู่', title: 'ศูนย์จับคู่', sub: 'แยกเคสที่พร้อมจับคู่ ออกจากเคสที่ต้องรอทีม', kpi: [['จ่ายแล้ว รอจับคู่', '5 เคส', 'urgent'], ['จ่ายแล้ว พักตรวจคลินิก', '2 เคส', 'watch'], ['รอทักษะ PT', '3 เคส', 'watch'], ['กำหนดแจ้งคนไข้ 24 ชม.', '', 'policy']], live: true, viz: { t: 'เหตุผลที่ยังจับคู่ไม่ได้', bars: [['เวลาไม่ตรง', 6], ['รอทักษะ PT', 3], ['พื้นที่', 2], ['ไม่มีคนกดรับ', 2]] } },
    { id: 'D04', icon: 'calendar-days', name: 'นัดและเยี่ยม', title: 'นัดและการเยี่ยม', sub: 'วันนี้มีอะไร เคสไหนนัดอยู่แต่ยังห้ามเริ่มรักษา', kpi: [['นัดวันนี้', '9 เคส', 'ok'], ['นัดอยู่ · พักการดูแล', '1 เคส', 'urgent'], ['จบแล้วรอรายงาน', '2 เคส', 'watch']], live: true, viz: { t: 'นัดวันนี้', bars: [['ยืนยันแล้ว', 7], ['พักการดูแล', 1], ['รอดำเนินการ', 1]] } },
    { id: 'D05', icon: 'wallet', name: 'การเงิน', title: 'การเงิน', sub: 'เงินเข้าตรงไหม อะไรค้าง ใครต้องจัดการ', kpi: [['รายการยืนยันแล้ว', '83 รายการ', 'ok'], ['กระทบยอดไม่ได้', '1 รายการ', 'urgent'], ['ค่าธรรมเนียมและค้างจ่าย PT', '', 'unknown']], note: 'ค่าธรรมเนียมใช้ฐาน Price List v1.0 · ยังไม่แสดงยอดรวมเป็นบาทเพราะยังไม่มีข้อมูลจริง', viz: { t: 'สถานะรายการจ่าย', bars: [['ยืนยันแล้ว', 83], ['รอตรวจสลิป', 4], ['ไม่ตรง', 1]] } },
    { id: 'D06', icon: 'package', name: 'คอร์ส', title: 'คอร์สและสิทธิ์คงเหลือ', sub: 'ขายได้เท่าไร ใช้ไปเท่าไร เหลือเท่าไร', kpi: [['คอร์สที่ขาย', '19 คอร์ส', 'ok'], ['ซื้อซ้ำ', '6 คน', 'ok'], ['ใกล้ครบ 365 วัน', '', 'unknown']], stack: [['ใช้แล้ว', 74, 'u'], ['กันไว้สำหรับนัด', 12, 'r'], ['พร้อมใช้', 88, 'a']] },
    { id: 'D07', icon: 'file-check-2', name: 'รายงาน', title: 'รายงานคลินิก', sub: 'รายงานครบไหม อะไรค้าง โดย CEO เห็นแค่ภาพรวมกับข้อมูลเคส ไม่เห็นรายละเอียดการรักษา', kpi: [['รายงานครบ', '94%', 'ok'], ['เกินกำหนด', '2 ฉบับ', 'watch'], ['ส่งถึงผู้มีสิทธิ์', '', 'unknown']], viz: { t: 'รายงาน 30 วัน', bars: [['ส่งแล้ว', 49], ['ยังเป็นร่าง', 1], ['เกินกำหนด', 2]] } },
    { id: 'D08', icon: 'siren', name: 'ปัญหา', title: 'ปัญหาและความเสี่ยง', sub: 'เรื่องไหนร้ายแรง ใครรับผิดชอบ และปิดด้วยหลักฐานอะไร', kpi: [['ปัญหาร้ายแรงวันนี้', '2 เคส', 'urgent'], ['หยุดระบบอัตโนมัติ', '1 เคส', 'urgent'], ['ร้องเรียน', '', 'unknown']], live: true, viz: { t: 'เรื่องที่เกิดซ้ำ', bars: [['เวลา PT ไม่ตรง', 6], ['ข้อมูลเปลี่ยนหลังจอง', 3], ['สลิปไม่ตรง', 1]] } }
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
      return SC.adminShell(s, 'a.dash', { title: view.title, sub: view.sub, right: ui.sample() }, `
        ${tabs}
        <p class="dc-note">${I('info')}<span><b>ข้อมูลตัวอย่างทั้งหน้า</b> ใช้ดูหน้าตาและวิธีอ่าน ยังไม่ใช่ตัวเลขจริง · 30 วันล่าสุด เวลาไทย${view.note ? ` · ${esc(view.note)}` : ''}</span></p>
        <p class="dc-note" data-live-link>${I('arrow-right-left')}<span>ตัวเลขของเคสที่ซ้อมอยู่ (เงินเข้า คืนเงิน นัดวันนี้ ความปลอดภัย ค้างจ่าย PT) อยู่ที่หน้าแรกแอดมิน</span><button class="btn sm ghost" data-go="a.queue">เปิดหน้าแรกแอดมิน</button></p>
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
        <p class="dc-note">${I('scale')}<span>งานพื้นฐาน (C01–C17) ที่ PT ตอบว่าทำได้ ใช้จับคู่ได้เลย · งานเฉพาะทาง (S) หรือข้อที่ตอบว่า "ยังไม่มั่นใจ" ต้องให้ Clinical Lead อนุมัติ 1 คน · เกณฑ์หลักฐานยังรอ Clinical Lead ตรวจรับ</span></p>
        <div class="dc-kpis"><div class="dc-kpi watch"><span>รอพิจารณา (ห้องซ้อม)</span><b>${queue.length} งาน</b></div><div class="dc-kpi ok"><span>ทีมอนุมัติแล้ว</span><b>${me.ok} งาน</b></div><div class="dc-kpi ok"><span>ไม่อนุมัติ</span><b>${me.no} งาน</b></div></div>
        <section class="dc-card"><div class="row between wrap"><h2>คิวรอพิจารณา</h2><span class="pill wait">${queue.length} งาน</span></div>
          ${queue.length ? queue.map(([id, v]) => `<div class="dc-cq"><span class="tile gold">${I('hourglass')}</span><span class="grow">${SC.CLIN.row(id, { code: true })}<small>${esc(name)} · PT ตอบ: ${v === 'ask' ? 'ทำได้ แต่ยังไม่มั่นใจ' : v === 'can' ? 'ทำได้' : 'ยังทำไม่ได้'}${(((p.capReqs || []).find(r => r.id === id && r.status === 'PENDING')) || {}).reason ? ` · ขอแก้: ${esc(p.capReqs.find(r => r.id === id && r.status === 'PENDING').reason)}` : ''}</small></span><button class="btn sm ghost" data-act="capsOpen">พิจารณา</button></div>`).join('') : '<p class="small" style="margin:0">ไม่มีงานรอพิจารณาในห้องซ้อม</p>'}</section>
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
    /* Boss 11 Nov: a summary, not a form. Changing an answer goes through "ขอแก้งานที่รับ" with a reason and, to raise an answer, evidence for the team. */
    render(s) {
      const p = s.pt, ids = capIds(p), dec = p.capDecisions || {}, reqs = p.capReqs || [], open = reqs.filter(r => r.status === 'PENDING');
      const res = id => { const d = dec[id]; if (open.some(r => r.id === id)) return ['รอทีมดูคำขอแก้', 'wait', 'hourglass']; if (d) return d.status === 'APPROVED' ? ['ส่งงานนี้ให้คุณได้', '', 'check'] : d.status === 'REJECTED' ? ['ยังไม่ส่งงานนี้ให้', 'warn', 'x'] : ['รอทีมดู', 'wait', 'hourglass']; const c = p.caps[id]; if (c === 'no') return ['ไม่ส่งงานนี้ให้', 'gray', 'minus']; if (c === 'ask') return ['รอทีมดู', 'wait', 'hourglass']; if (id[0] === 'S' && c === 'can') return ['รอทีมดู', 'wait', 'hourglass']; if (c === 'can') return ['ส่งงานนี้ให้คุณได้', '', 'check']; return ['ยังไม่ได้ตอบ', 'gray', 'minus']; };
      const go = ids.filter(id => res(id)[1] === ''), wait = ids.filter(id => res(id)[1] === 'wait'), off = ids.filter(id => ['gray', 'warn'].includes(res(id)[1]));
      const row = id => { const [t, tone, ic] = res(id); return `<li class="dc-tt" data-task="${id}">${SC.CLIN.row(id, { tail: `<span class="pill ${tone}">${I(ic)}${t}</span>` })}</li>`; };
      const sec = (title, list, openIt) => list.length ? `<details class="card flat dc-done"${openIt ? ' open' : ''}><summary class="sec-h">${title} (${list.length})</summary><ul class="tk-list">${list.map(row).join('')}</ul></details>` : '';
      return `<div class="scr">${ui.bar('งานที่รับ')}<div class="body">
        <div class="dc-ptsum"><div><b>${go.length}</b><span>ส่งงานให้ได้</span></div><div class="w"><b>${wait.length}</b><span>รอทีมดู</span></div><div><b>${off.length}</b><span>ยังไม่ส่งให้</span></div></div>
        ${!ids.length ? ui.empty('list-checks', 'ยังไม่ได้เลือกกลุ่มงาน', 'เลือกกลุ่มงานตอนสร้างโปรไฟล์ก่อน', '') : `
        ${open.length ? `<div class="note" data-cap-req-open>${I('hourglass')} คำขอแก้ ${open.length} เรื่อง รอทีมดู · ทีมตอบกลับใน LINE · ระหว่างนี้งานอื่นรับได้ตามปกติ</div>` : ''}
        ${sec('รอทีมดู', wait, true)}${sec('ส่งงานให้คุณได้', go, !wait.length)}${sec('ยังไม่ส่งให้', off, false)}
        <div class="tt-cap lock card flat">${SC.CLIN.row('S06')}<small>${I('lock')} ยังไม่เปิดรับ ทีมจะติดต่อเอง</small></div>
        <button class="btn" style="width:100%" data-act="capReqOpen">${I('pencil')}ขอแก้งานที่รับ</button>
        <p class="small" style="margin:0">แก้เองไม่ได้ ต้องบอกเหตุผล ถ้าขอเพิ่มสิ่งที่ทำได้ ต้องแนบหลักฐานให้ทีมดู · ถ้าขอลด มีผลทันที</p>
        ${reqs.length ? `<details class="small"><summary>ประวัติคำขอแก้ ${reqs.length} เรื่อง</summary>${reqs.slice().reverse().map(r => `<p style="margin:4px 0">${esc(r.at)} · ${esc(SC.CLIN.th(r.id))} · ${esc(CAPW[r.from] || '—')} → ${esc(CAPW[r.to])} · ${r.status === 'PENDING' ? 'รอทีมดู' : r.status === 'APPLIED' ? 'มีผลแล้ว' : r.status === 'APPROVED' ? 'ทีมอนุมัติ' : 'ทีมไม่อนุมัติ'}</p>`).join('')}</details>` : ''}`}
      </div>${ui.tabs('pt', 't.hub')}</div>`;
    }
  });
  const CAPW = { can: 'ทำได้', ask: 'ทำได้ แต่ยังไม่มั่นใจ', no: 'ยังทำไม่ได้' }, RANK = { no: 0, ask: 1, can: 2 };
  const capIds = p => [...new Set(SC.CLIN.services.filter(x => (p.services || []).includes(x.id)).flatMap(x => x.tasks))].filter(id => !SC.CLIN.restricted.includes(id)).sort((a, b) => (a[0] === b[0] ? 0 : a[0] === 'C' ? -1 : 1) || a.localeCompare(b));
  const isRaise = (from, to) => (RANK[to] ?? 0) > (RANK[from] ?? -1);
  function reqSheet(s, ids) {
    const p = s.pt, d = p.capDraft = p.capDraft || {}, from = d.id ? p.caps[d.id] : '', raise = d.id && d.to && isRaise(from, d.to);
    return `<div class="stack" data-cap-sheet>
      <b class="h3">${I('pencil')}ขอแก้งานที่รับ</b>
      <label class="field"><span>1 · งานไหน</span><select class="in" data-bind="pt.capDraft.id"><option value="">เลือกงาน</option>${ids.map(id => `<option value="${id}" ${d.id === id ? 'selected' : ''}>${esc(SC.CLIN.th(id))} · ${esc(SC.CLIN.en[id])}</option>`).join('')}</select></label>
      ${d.id ? `<div class="small">ตอนนี้: <b>${esc(CAPW[from] || 'ยังไม่ได้ตอบ')}</b></div>
      <div class="field"><span>2 · เปลี่ยนเป็น</span><div class="chips">${['can', 'ask', 'no'].filter(v => v !== from).map(v => `<button class="chip ${d.to === v ? 'on' : ''}" data-pick="pt.capDraft.to" data-value="${v}">${CAPW[v]}</button>`).join('')}</div></div>` : ''}
      ${d.to ? `<label class="field"><span>3 · ทำไมถึงขอแก้</span><textarea class="in" style="min-height:64px" maxlength="200" data-bind="pt.capDraft.reason" placeholder="${raise ? 'เช่น ผ่านอบรมเรื่องนี้แล้ว / ดูแลเคสแบบนี้มา 2 ปีที่โรงพยาบาล' : 'เช่น ช่วงนี้ไม่ได้ทำงานนี้ ขอไม่รับไปก่อน'}">${esc(d.reason || '')}</textarea></label>
      ${raise ? `<div class="field"><span>4 · แนบหลักฐานให้ทีมดู</span>${d.file ? `<span class="pill">${I('check')}แนบ${d.file === 'sample' ? 'ไฟล์ตัวอย่าง' : String(d.file).startsWith('data:application/pdf') ? 'ไฟล์ PDF' : 'รูปภาพ'}แล้ว</span>` : `<div class="grid2"><label class="btn sm ghost tt-file" style="width:100%">${I('upload')}แนบไฟล์<input type="file" accept="image/*,application/pdf" data-file="pt.capDraft.file" aria-label="แนบหลักฐาน"></label><button class="btn sm ghost" style="width:100%" data-pick="pt.capDraft.file" data-value="sample">ไฟล์ตัวอย่าง</button></div>`}<small class="small">เช่น ใบอบรม ใบรับรองการทำงาน</small></div><p class="small" style="margin:0">ทีมดูแล้วตอบใน LINE · ระหว่างรอ ระบบยังใช้คำตอบเดิม</p>` : '<p class="small" style="margin:0">ขอลด มีผลทันที ระบบจะไม่ส่งงานแบบนี้ให้คุณ (ไม่ต้องแนบหลักฐาน)</p>'}` : ''}
      <div class="row"><button class="btn ghost" data-act="capReqClose">ยกเลิก</button><button class="btn" data-act="capReqSend" ${d.id && d.to ? '' : 'disabled'}>${raise ? 'ส่งให้ทีมดู' : 'ยืนยัน'}</button></div>
    </div>`;
  }
  SC.action('capReqOpen', (s, ctx) => { s.pt.capDraft = {}; ctx.sheet(st => reqSheet(st, capIds(st.pt))); });
  SC.action('capReqClose', (s, ctx) => { s.pt.capDraft = {}; ctx.close(); });
  SC.action('capReqSend', (s, ctx) => {
    const p = s.pt, d = p.capDraft || {}, id = d.id, to = d.to, from = (p.caps || {})[id] || '', why = (d.reason || '').trim(), ev = d.file ? (d.file === 'sample' ? 'ไฟล์ตัวอย่าง' : 'ไฟล์แนบ') : '';
    if (!id || !to) return; if (!why) { ctx.toast('บอกเหตุผลก่อน'); return; }
    const raise = isRaise(from, to); if (raise && !ev) { ctx.toast('ขอเพิ่มสิ่งที่ทำได้ ต้องแนบหลักฐานให้ทีมดู'); return; }
    const at = SC.stamp ? SC.stamp(5) : SC.TODAY, req = { id, from, to, reason: why, evidence: ev, file: d.file || '', at, status: raise ? 'PENDING' : 'APPLIED' };
    (p.capReqs = p.capReqs || []).push(req);
    if (!raise) { p.caps[id] = to; const dd = (p.capDecisions || {})[id]; if (dd && dd.status === 'APPROVED') dd.status = to === 'no' ? 'REJECTED' : 'PENDING'; (p.capLog = p.capLog || []).push({ kind: 'declare', id, from, to, at, note: `ขอลด · ${why}` }); ctx.toast(`ลดแล้ว · ระบบไม่ส่งงาน "${SC.CLIN.th(id)}" ให้คุณ`); }
    else { const dec = p.capDecisions = p.capDecisions || {}; if (!dec[id] || dec[id].status !== 'PENDING') dec[id] = Object.assign({}, dec[id] || {}, { status: 'PENDING', at, req: true }); (p.capLog = p.capLog || []).push({ kind: 'declare', id, from, to, at, note: `ขอแก้ · ${why} · หลักฐาน: ${ev}` });
      ctx.line('admin', { key: 'note', title: 'PT ขอแก้งานที่รับ รอทีมดู', lines: [`${p.displayName || 'PT'} ขอเปลี่ยน "${SC.CLIN.th(id)}" (${SC.CLIN.en[id]})`, `จาก ${CAPW[from] || 'ยังไม่ได้ตอบ'} เป็น ${CAPW[to]}`, `เหตุผล: ${why}`, `หลักฐาน: ${ev}`, 'ใครมีสิทธิ์ Clinical Lead ก็ตัดสินได้'], go: 'a.caps', button: 'ดูคำขอ' });
      ctx.toast('ส่งคำขอให้ทีมแล้ว ทีมตอบใน LINE'); }
    p.capDraft = {}; ctx.close();
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
    if (allow) { Object.assign(s.request.review, { allow, limits, byId: 'palm', reason: 'ตัวอย่างสำหรับตรวจ', limited: true, limitedWhy: 'ตัวอย่าง: Lead จำกัดขอบเขตเฉพาะงานที่ติ๊ก (เงื่อนไข Limited Scope รอตัดสิน)' }); SC.clinClear(s, SC.line); }
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
    { id: 'profile-v2', st: 'check', role: 'คนไข้', t: 'โปรไฟล์ PT แบบใหม่', d: 'รูปปก แถบตัวเลข และแท็บตามรายการล่าสุด', screen: 'p.pt', open() { SC.s.patient.viewPt = 's1'; SC.s.patient.ptTab = 'about'; SC.go('p.pt'); } }
  ];
  SC.REVIEW_ITEMS = ITEMS;
  const KEY = 'sc-reviewed-v1';
  const readDone = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const writeDone = x => { try { localStorage.setItem(KEY, JSON.stringify(x)); } catch (e) { /* the strip still works for this visit */ } };
  let done = readDone();
  /* A05: the "ใหม่" mark goes once the screen has been opened. */
  let seen = (() => { try { return JSON.parse(localStorage.getItem('sc-seen-v1') || '[]'); } catch (e) { return []; } })();
  SC.isNewScreen = id => !seen.includes(id) && ITEMS.some(x => x.screen === id && !done.includes(x.id));
  let rvOpen = false;
  const stLabel = { new: 'มาใหม่', check: 'รอตรวจ' };
  function paint(s, v) {
    const at0 = v.at[v.role]; if (at0 && !seen.includes(at0) && ITEMS.some(x => x.screen === at0)) { seen = [...seen, at0]; try { localStorage.setItem('sc-seen-v1', JSON.stringify(seen)); } catch (e) { /* ok */ } }
    const left = ITEMS.filter(x => !done.includes(x.id)), box = document.getElementById('rvbox');
    /* S01: folded to one line by default so the screen under review stays near the top. */
    if (box) box.innerHTML = `<div class="rv-head"><span class="rv-mark">${I('sparkles')}</span><div class="grow"><b>มาใหม่ · รอตรวจ ${left.length} เรื่อง</b>${rvOpen ? `<small>${left.length ? 'ป้ายเดียวกันนี้อยู่บนผังโฟลว์' : 'ตรวจครบแล้ว'}</small>` : ''}</div><button class="btn sm ghost" data-rv-toggle aria-expanded="${rvOpen}">${rvOpen ? 'ซ่อน' : 'ดูรายการ'}</button></div>
      ${rvOpen ? `<div class="rv-list">${ITEMS.map(x => { const ok = done.includes(x.id); return `<article class="rv-card is-${x.st} ${ok ? 'done' : ''}" data-rv-card="${x.id}"><div class="row between"><span class="rv-tag ${ok ? 'is-ok' : 'is-' + x.st}">${ok ? 'ตรวจแล้ว' : stLabel[x.st]}</span><small>${esc(x.role)}</small></div><b>${esc(x.t)}</b><p>${esc(x.d)}</p><div class="rv-acts"><button class="btn sm" data-rv-open="${x.id}">เปิดดู${I('arrow-right')}</button><button class="btn sm ghost" data-rv-done="${x.id}">${ok ? 'เอาป้ายกลับ' : 'ตรวจแล้ว'}</button></div></article>`; }).join('')}</div><p class="rv-foot">บางเรื่องเปิดพร้อมเคสตัวอย่าง จึงเริ่มห้องซ้อมใหม่</p>` : ''}`;
    document.querySelectorAll('#flowsvg [data-rv-screen]').forEach(g => { const it = ITEMS.find(x => x.screen === g.dataset.rvScreen && !done.includes(x.id)); g.style.display = it ? '' : 'none'; if (it) { g.setAttribute('class', `rv-chip is-${it.st}`); g.querySelector('text').textContent = stLabel[it.st]; } });
    const note = document.getElementById('rvnote'), at = v.at[v.role], cur = ITEMS.find(x => x.screen === at && !done.includes(x.id));
    if (note) note.innerHTML = cur ? `<div class="rv-note is-${cur.st}"><span class="rv-tag is-${cur.st}">${stLabel[cur.st]}</span><span class="grow">${esc(cur.d)}</span><button class="btn sm ghost" data-rv-done="${cur.id}">ตรวจแล้ว</button></div>` : '';
  }
  SC.onShell(paint);
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-rv-open]'), k = e.target.closest('[data-rv-done]');
    if (e.target.closest('[data-rv-toggle]')) { rvOpen = !rvOpen; paint(SC.s, SC.v); if (window.lucide) window.lucide.createIcons(); return; }
    if (o) { const it = ITEMS.find(x => x.id === o.dataset.rvOpen); if (it) { it.open(); SC.render(); const d = document.getElementById('dev'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
    if (k) { const id = k.dataset.rvDone; done = done.includes(id) ? done.filter(x => x !== id) : [...done, id]; writeDone(done); paint(SC.s, SC.v); SC.render(); }
  });
})();
