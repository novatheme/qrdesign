export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
}

export const SUPPORTED_BANKS: Bank[] = [
  { id: 1, bin: "970436", code: "VCB", name: "Vietcombank", shortName: "Vietcombank", logo: "https://api.vietqr.io/img/VCB.png" },
  { id: 2, bin: "970415", code: "ICB", name: "VietinBank", shortName: "VietinBank", logo: "https://api.vietqr.io/img/ICB.png" },
  { id: 3, bin: "970418", code: "BIDV", name: "BIDV", shortName: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
  { id: 4, bin: "970405", code: "VBA", name: "Agribank", shortName: "Agribank", logo: "https://api.vietqr.io/img/VBA.png" },
  { id: 5, bin: "970422", code: "MB", name: "MBBank", shortName: "MBBank", logo: "https://api.vietqr.io/img/MB.png" },
  { id: 6, bin: "970423", code: "TPB", name: "TPBank", shortName: "TPBank", logo: "https://api.vietqr.io/img/TPB.png" },
  { id: 7, bin: "970403", code: "STB", name: "Sacombank", shortName: "Sacombank", logo: "https://api.vietqr.io/img/STB.png" },
  { id: 8, bin: "970407", code: "TCB", name: "Techcombank", shortName: "Techcombank", logo: "https://api.vietqr.io/img/TCB.png" },
  { id: 9, bin: "970416", code: "ACB", name: "ACB", shortName: "ACB", logo: "https://api.vietqr.io/img/ACB.png" },
  { id: 10, bin: "970432", code: "VPB", name: "VPBank", shortName: "VPBank", logo: "https://api.vietqr.io/img/VPB.png" },
];

export class BankService {
  static getAllBanks() {
    return SUPPORTED_BANKS;
  }

  static getBankByBin(bin: string) {
    return SUPPORTED_BANKS.find(b => b.bin === bin);
  }

  static getBankByCode(code: string) {
    return SUPPORTED_BANKS.find(b => b.code.toUpperCase() === code.toUpperCase());
  }
}
