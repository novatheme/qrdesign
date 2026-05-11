import QRCode from 'qrcode';

export class QRImageService {
  /**
   * Generates a Base64 encoded string of the QR code image
   */
  public static async toDataURL(payload: string): Promise<string> {
    try {
      return await QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 500,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('QR Generator Error:', err);
      throw new Error('Could not generate QR image');
    }
  }

  /**
   * Generates a Buffer of the QR code image (PNG)
   */
  public static async toBuffer(payload: string): Promise<Buffer> {
    try {
      return await QRCode.toBuffer(payload, {
        type: 'png',
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 1000,
      });
    } catch (err) {
      console.error('QR Generator Error:', err);
      throw new Error('Could not generate QR buffer');
    }
  }
}
