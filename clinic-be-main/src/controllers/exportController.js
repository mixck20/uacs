import { createObjectCsvStringifier } from 'csv-writer';
import { Patient } from '../models/Patient.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Appointment } from '../models/Appointment.js';

async function toCSV(rows, header) {
  const csvStringifier = createObjectCsvStringifier({ header });
  const headerLine = csvStringifier.getHeaderString();
  const body = csvStringifier.stringifyRecords(rows);
  return headerLine + body;
}

export async function exportData(req, res) {
  const { type } = req.params;
  let rows = [], header = [];
  if (type === 'patients') {
    const data = await Patient.find().lean();
    rows = data.map(d => ({
      schoolId: d.schoolId, fullName: d.fullName, sex: d.sex,
      birthDate: d.birthDate?.toISOString()?.slice(0,10), contactNumber: d.contactNumber || '',
      bloodType: d.bloodType || ''
    }));
    header = [
      { id: 'schoolId', title: 'School ID' },
      { id: 'fullName', title: 'Full Name' },
      { id: 'sex', title: 'Sex' },
      { id: 'birthDate', title: 'Birth Date' },
      { id: 'contactNumber', title: 'Contact' },
      { id: 'bloodType', title: 'Blood Type' }
    ];
  } else if (type === 'inventory') {
    const data = await InventoryItem.find().lean();
    rows = data.map(d => ({
      name: d.name, description: d.description || '', quantity: d.quantity, unit: d.unit,
      reorderLevel: d.reorderLevel, expiryDate: d.expiryDate ? d.expiryDate.toISOString().slice(0,10) : ''
    }));
    header = [
      { id: 'name', title: 'Name' },
      { id: 'description', title: 'Description' },
      { id: 'quantity', title: 'Quantity' },
      { id: 'unit', title: 'Unit' },
      { id: 'reorderLevel', title: 'Reorder Level' },
      { id: 'expiryDate', title: 'Expiry Date' }
    ];
  } else if (type === 'appointments') {
    const data = await Appointment.find().populate('requester','email').lean();
    rows = data.map(d => ({
      requester: d.requester?.email || '',
      concern: d.concern,
      preferredDate: d.preferredDate ? d.preferredDate.toISOString().slice(0,10) : '',
      status: d.status,
      createdAt: d.createdAt?.toISOString()
    }));
    header = [
      { id: 'requester', title: 'Requester' },
      { id: 'concern', title: 'Concern' },
      { id: 'preferredDate', title: 'Preferred Date' },
      { id: 'status', title: 'Status' },
      { id: 'createdAt', title: 'Created At' }
    ];
  } else {
    return res.status(400).json({ message: 'Invalid export type' });
  }
  const csv = await toCSV(rows, header);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${type}.csv`);
  res.send(csv);
}
