import fs from 'fs';
import path from 'path';
import os from 'os';
import { Patient } from '../models/Patient.js';
import { HealthRecord } from '../models/HealthRecord.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Appointment } from '../models/Appointment.js';
import { Announcement } from '../models/Announcement.js';
import { Faq } from '../models/Faq.js';
import archiver from 'archiver';

export async function snapshotBackup(req, res) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ua-backup-'));
  const collections = {
    patients: await Patient.find().lean(),
    healthRecords: await HealthRecord.find().lean(),
    inventory: await InventoryItem.find().lean(),
    appointments: await Appointment.find().lean(),
    announcements: await Announcement.find().lean(),
    faqs: await Faq.find().lean()
  };

  for (const [name, data] of Object.entries(collections)) {
    fs.writeFileSync(path.join(tmpDir, `${name}.json`), JSON.stringify(data, null, 2));
  }

  const zipPath = path.join(tmpDir, 'ua_backup.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(output);
  archive.directory(tmpDir, false);
  await archive.finalize();

  output.on('close', () => {
    res.download(zipPath, 'ua_backup.zip', () => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
  });
}
