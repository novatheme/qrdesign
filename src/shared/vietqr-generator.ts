import { crc16ccitt } from 'crc';

/**
 * VietQR / EMVCo Specification Implementation
 */
export class VietQRService {
  private static formatField(tag: string, value: string): string {
    const length = value.length.toString().padStart(2, '0');
    return `${tag}${length}${value}`;
  }

  private static calculateCRC(content: string): string {
    const crc = crc16ccitt(content, 0xFFFF);
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  public static generatePayload(data: {
    bankBin: string;
    accountNumber: string;
    amount?: string;
    description?: string;
    isDynamic?: boolean;
  }): string {
    let qr = "";

    // 00: Payload Format Indicator
    qr += this.formatField('00', '01');

    // 01: Point of Initiation Method (11: Static, 12: Dynamic)
    qr += this.formatField('01', data.isDynamic ? '12' : '11');

    // 38: Merchant Account Information
    const GUID = this.formatField('00', 'A000000727');
    const service = this.formatField('00', data.bankBin) + this.formatField('01', data.accountNumber);
    const merchantInfo = GUID + this.formatField('01', service) + this.formatField('02', 'QRIBFTTA');
    qr += this.formatField('38', merchantInfo);

    // 53: Transaction Currency (VND = 704)
    qr += this.formatField('53', '704');

    // 54: Transaction Amount
    if (data.amount) {
      qr += this.formatField('54', data.amount);
    }

    // 58: Country Code
    qr += this.formatField('58', 'VN');

    // 62: Additional Data Field (Message/Description)
    if (data.description) {
      const normalizedDesc = data.description
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toUpperCase()
        .substring(0, 25);
      qr += this.formatField('62', this.formatField('08', normalizedDesc));
    }

    // 63: CRC (must be at the end)
    qr += '6304';
    const finalCRC = this.calculateCRC(qr);
    qr += finalCRC;

    return qr;
  }

  /**
   * Generates a standard VietQR deep link for mobile banking apps
   */
  public static generateDeepLink(data: {
    bankBin: string;
    accountNumber: string;
    amount?: string;
    description?: string;
  }): string {
    const baseUrl = `https://qr.vietqr.io/v2/`;
    const amountStr = data.amount ? `&amount=${data.amount}` : "";
    const descStr = data.description ? `&addInfo=${encodeURIComponent(data.description)}` : "";
    
    return `${baseUrl}${data.bankBin}/${data.accountNumber}?q=2${amountStr}${descStr}`;
  }
}
