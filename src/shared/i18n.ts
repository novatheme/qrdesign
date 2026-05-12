export type Language = 'vi' | 'en' | 'zh' | 'ko' | 'ja';

export const translations = {
  vi: {
    title: "VietQR Generator",
    description: "Ứng dụng tạo mã QR thanh toán ngân hàng chuẩn VietQR (EMVCo), hỗ trợ tất cả ngân hàng Việt Nam.",
    paymentInfo: "Thông tin thanh toán",
    chooseBank: "Chọn Ngân hàng",
    bankPlaceholder: "Chọn ngân hàng của bạn...",
    searchBank: "Tìm tên ngân hàng, mã, BIN...",
    accountNumber: "Số tài khoản",
    accountNumberPlaceholder: "Nhập số tài khoản",
    accountName: "Tên tài khoản (Tùy chọn)",
    accountNamePlaceholder: "VD: NGUYEN VAN A",
    amount: "Số tiền thanh toán",
    amountPlaceholder: "Nhập số tiền",
    memo: "Nội dung chuyển khoản",
    descriptionPlaceholder: "VD: Thanh toan hoa don",
    preview: "Xem trước mã QR",
    previewInstruction: "Nhập thông tin ngân hàng và STK để tạo mã QR",
    download: "Tải mã QR",
    copy: "Sao chép mã",
    copied: "Đã sao chép!",
    features: {
      standard: {
        title: "Chuẩn VietQR",
        desc: "Tuân thủ tiêu chuẩn EMVCo quốc tế và Napas Việt Nam."
      },
      allBanks: {
        title: "Tất cả Ngân hàng",
        desc: "Hỗ trợ 50+ ngân hàng tại Việt Nam: VCB, TCB, MB, v.v."
      },
      share: {
        title: "Dễ dàng chia sẻ",
        desc: "Tải ảnh QR sắc nét hoặc chia sẻ link thanh toán nhanh."
      }
    },
    footerDesc: "Dịch vụ tạo mã QR thanh toán miễn phí, an toàn và chính xác cho mọi cá nhân và doanh nghiệp tại Việt Nam.",
    warning: "* Lưu ý: Hãy kiểm tra kỹ thông tin ngân hàng và số tài khoản trước khi thực hiện giao dịch.",
    loading: "Đang tải danh sách ngân hàng...",
    noBank: "Không tìm thấy ngân hàng nào.",
    login: "Đăng nhập",
    docs: "Tài liệu API",
    about: "Về VietQR",
    financialStandard: "Tiêu chuẩn tài chính",
    design: {
      customize: "Tùy chỉnh thiết kế",
      templates: "Mẫu thiết kế",
      shapes: "Hình dạng",
      colors: "Màu sắc",
      logo: "Logo",
      background: "Hình nền",
      uploadLogo: "Tải Logo lên",
      uploadBg: "Tải hình nền lên",
      dotsType: "Kiểu thân QR",
      cornersSquareType: "Khung góc",
      cornersDotType: "Nhân góc",
      colorsForeground: "Màu QR",
      colorsBackground: "Màu nền",
      eyeFrameColor: "Màu khung góc",
      eyeBallColor: "Màu nhân góc"
    }
  },
  en: {
    title: "VietQR Generator",
    description: "Create standard VietQR (EMVCo) payment QR codes, supporting all Vietnamese banks.",
    paymentInfo: "Payment Information",
    chooseBank: "Select Bank",
    bankPlaceholder: "Select your bank...",
    searchBank: "Search bank name, code, BIN...",
    accountNumber: "Account Number",
    accountNumberPlaceholder: "Enter account number",
    accountName: "Account Name (Optional)",
    accountNamePlaceholder: "e.g. NGUYEN VAN A",
    amount: "Transfer Amount",
    amountPlaceholder: "Enter amount",
    memo: "Transfer Description",
    descriptionPlaceholder: "e.g. Invoice payment",
    preview: "QR Preview",
    previewInstruction: "Enter bank info and account number to generate QR",
    download: "Download QR",
    copy: "Copy String",
    copied: "Copied!",
    features: {
      standard: {
        title: "VietQR Standard",
        desc: "Complies with international EMVCo and Napas Vietnam standards."
      },
      allBanks: {
        title: "All Banks",
        desc: "Supports 50+ banks: VCB, TCB, MB, etc."
      },
      share: {
        title: "Easy Sharing",
        desc: "Download high-quality QR images or share payment links."
      }
    },
    footerDesc: "Free, secure, and accurate QR payment service for individuals and businesses in Vietnam.",
    warning: "* Note: Please double-check bank info and account number before making transactions.",
    loading: "Loading banks...",
    noBank: "No banks found.",
    login: "Login",
    docs: "API Docs",
    about: "About VietQR",
    financialStandard: "Financial Standard",
    design: {
      customize: "Customize Design",
      templates: "Templates",
      shapes: "Shapes",
      colors: "Colors",
      logo: "Logo",
      background: "Background",
      uploadLogo: "Upload Logo",
      uploadBg: "Upload Background",
      dotsType: "Body Shape",
      cornersSquareType: "Eye Frame",
      cornersDotType: "Eye Ball",
      colorsForeground: "Foreground Color",
      colorsBackground: "Background Color",
      eyeFrameColor: "Eye Frame Color",
      eyeBallColor: "Eye Ball Color"
    }
  },
  zh: {
    title: "VietQR 生成器",
    description: "创建标准的 VietQR (EMVCo) 付款二维码，支持所有越南银行。",
    paymentInfo: "付款信息",
    chooseBank: "选择银行",
    bankPlaceholder: "选择您的银行...",
    searchBank: "搜索银行名称、代码、BIN...",
    accountNumber: "账号",
    accountNumberPlaceholder: "输入账号",
    accountName: "账户名 (可选)",
    accountNamePlaceholder: "例如：NGUYEN VAN A",
    amount: "转账金额",
    amountPlaceholder: "输入金额",
    memo: "转账备注",
    descriptionPlaceholder: "例如：支付账单",
    preview: "二维码预览",
    previewInstruction: "输入银行信息和账号以生成二维码",
    download: "下载二维码",
    copy: "复制字符串",
    copied: "已复制！",
    features: {
      standard: {
        title: "VietQR 标准",
        desc: "符合国际 EMVCo 和越南 Napas 标准。"
      },
      allBanks: {
        title: "支持所有银行",
        desc: "支持 50 多家银行：VCB、TCB、MB 等。"
      },
      share: {
        title: "轻松分享",
        desc: "下载高质量二维码图片或分享付款链接。"
      }
    },
    footerDesc: "为越南的个人和企业提供免费、安全、准确的二维码支付服务。",
    warning: "* 注意：交易前请仔细检查银行信息和账号。",
    loading: "正在加载银行...",
    noBank: "未找到银行。",
    login: "登录",
    docs: "API 文档",
    about: "关于 VietQR",
    financialStandard: "金融标准",
    design: {
      customize: "自定义设计",
      templates: "设计模板",
      shapes: "形状",
      colors: "颜色",
      logo: "图标",
      background: "背景",
      uploadLogo: "上传图标",
      uploadBg: "上传背景",
      dotsType: "主体形状",
      cornersSquareType: "边框形状",
      cornersDotType: "内点形状",
      colorsForeground: "二维码颜色",
      colorsBackground: "背景颜色",
      eyeFrameColor: "边框颜色",
      eyeBallColor: "内点颜色"
    }
  },
  ko: {
    title: "VietQR 생성기",
    description: "모든 베트남 은행을 지원하는 표준 VietQR(EMVCo) 결제 QR 코드를 생성합니다.",
    paymentInfo: "결제 정보",
    chooseBank: "은행 선택",
    bankPlaceholder: "은행을 선택하세요...",
    searchBank: "은행 이름, 코드, BIN 검색...",
    accountNumber: "계좌 번호",
    accountNumberPlaceholder: "계좌 번호를 입력하세요",
    accountName: "예금주명 (선택 사항)",
    accountNamePlaceholder: "예: NGUYEN VAN A",
    amount: "이체 금액",
    amountPlaceholder: "금액을 입력하세요",
    memo: "이체 내용",
    descriptionPlaceholder: "예: 청구서 결제",
    preview: "QR 미리보기",
    previewInstruction: "QR을 생성하려면 은행 정보와 계좌 번호를 입력하세요",
    download: "QR 다운로드",
    copy: "문자열 복사",
    copied: "복사됨!",
    features: {
      standard: {
        title: "VietQR 표준",
        desc: "국제 EMVCo 및 베트남 Napas 표준을 준수합니다."
      },
      allBanks: {
        title: "모든 은행 지원",
        desc: "VCB, TCB, MB 등 50개 이상의 은행을 지원합니다."
      },
      share: {
        title: "간편한 공유",
        desc: "고품질 QR 이미지를 다운로드하거나 결제 링크를 공유하세요."
      }
    },
    footerDesc: "베트남의 개인과 기업을 위한 무료이고 안전하며 정확한 QR 결제 서비스입니다.",
    warning: "* 참고: 거래 전 은행 정보와 계좌 번호를 다시 한번 확인하시기 바랍니다.",
    loading: "은행 목록을 불러오는 중...",
    noBank: "검색된 은행이 없습니다.",
    login: "로그인",
    docs: "API 문서",
    about: "VietQR 소개",
    financialStandard: "금융 표준",
    design: {
      customize: "디자인 맞춤 설정",
      templates: "템플릿",
      shapes: "모양",
      colors: "색상",
      logo: "로고",
      background: "배경",
      uploadLogo: "로고 업로드",
      uploadBg: "배경 업로드",
      dotsType: "본체 모양",
      cornersSquareType: "코너 프레임",
      cornersDotType: "코너 도트",
      colorsForeground: "QR 색상",
      colorsBackground: "배경 색상",
      eyeFrameColor: "코너 프레임 색상",
      eyeBallColor: "코너 도트 색상"
    }
  },
  ja: {
    title: "VietQR ジェネレーター",
    description: "ベトナムのすべての銀行をサポートする標準の VietQR (EMVCo) 決済 QR コードを作成します。",
    paymentInfo: "お支払い情報",
    chooseBank: "銀行を選択",
    bankPlaceholder: "銀行を選択してください...",
    searchBank: "銀行名、コード、BIN で検索...",
    accountNumber: "口座番号",
    accountNumberPlaceholder: "口座番号を入力してください",
    accountName: "受取人名 (任意)",
    accountNamePlaceholder: "例: NGUYEN VAN A",
    amount: "送金金額",
    amountPlaceholder: "金額を入力してください",
    memo: "送金内容",
    descriptionPlaceholder: "例: 請求書の支払い",
    preview: "QR プレビュー",
    previewInstruction: "銀行情報と口座番号を入力して QR を生成します",
    download: "QR をダウンロード",
    copy: "文字列をコピー",
    copied: "コピーしました！",
    features: {
      standard: {
        title: "VietQR 標準",
        desc: "国際的な EMVCo および Napas Vietnam 規格に準拠しています。"
      },
      allBanks: {
        title: "すべての銀行",
        desc: "VCB、TCB、MB など 50 以上の銀行をサポートしています。"
      },
      share: {
        title: "簡単共有",
        desc: "高品質な QR 画像をダウンロードしたり、支払いリンクを共有したりできます。"
      }
    },
    footerDesc: "ベトナムの個人および企業向けの、無料で安全かつ正確な QR 決済サービスです。",
    warning: "* 注意：取引を行う前に、銀行情報と口座番号を再確認してください。",
    loading: "銀行を読み込み中...",
    noBank: "銀行が見つかりません。",
    login: "ログイン",
    docs: "API ドキュメント",
    about: "VietQR について",
    financialStandard: "金融標準",
    design: {
      customize: "デザインをカスタマイズ",
      templates: "テンプレート",
      shapes: "形状",
      colors: "色",
      logo: "ロゴ",
      background: "背景",
      uploadLogo: "ロゴをアップロード",
      uploadBg: "背景をアップロード",
      dotsType: "ボディ形状",
      cornersSquareType: "コーナーフレーム",
      cornersDotType: "コーナードット",
      colorsForeground: "QRカラー",
      colorsBackground: "背景色",
      eyeFrameColor: "フレームの色",
      eyeBallColor: "ドットの色"
    }
  }
};
