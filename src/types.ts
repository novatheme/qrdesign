export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  support: number;
  isTransfer: number;
  swift_code: string;
}

export interface QRData {
  bankBin: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  description: string;
}

export interface QRStyle {
  dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  dotsColor: string;
  backgroundColor: string;
  cornersSquareType: 'dot' | 'square' | 'extra-rounded';
  cornersSquareColor: string;
  cornersDotType: 'dot' | 'square';
  cornersDotColor: string;
  image?: string;
  backgroundImage?: string;
}

export interface ApiResponse<T> {
  code: string;
  desc: string;
  data: T;
}
