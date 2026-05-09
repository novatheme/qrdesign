/**
 * VietQR (EMVCo) Generation Utility
 * Following the official NAPAS / VietQR standard.
 */

function formatField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

function calculateCRC(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  crc &= 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generateVietQR(data: {
  bankBin: string;
  accountNumber: string;
  accountName?: string;
  amount?: string;
  description?: string;
}): string {
  const { bankBin, accountNumber, accountName, amount, description } = data;

  // 00: Payload Format Indicator
  let qr = formatField('00', '01');
  
  // 01: Point of Initiation Method (12 = Dynamic, 11 = Static)
  qr += formatField('01', amount ? '12' : '11');

  // 38: Merchant Account Information (Consumer Payment)
  const guid = formatField('00', 'A000000727');
  const service = formatField('00', bankBin) + formatField('01', accountNumber);
  const merchantInfo = guid + formatField('01', service);
  qr += formatField('38', merchantInfo);

  // 53: Transaction Currency (VND = 704)
  qr += formatField('53', '704');

  // 54: Transaction Amount
  if (amount && parseInt(amount) > 0) {
    qr += formatField('54', amount);
  }

  // 58: Country Code
  qr += formatField('58', 'VN');

  // 59: Merchant Name (Account Name)
  if (accountName) {
    qr += formatField('59', accountName.toUpperCase());
  }

  // 62: Additional Data Field (Purpose of Transaction)
  if (description) {
    qr += formatField('62', formatField('08', description));
  }

  // 63: CRC
  qr += '6304';
  const crc = calculateCRC(qr);
  qr += crc;

  return qr;
}
