import numberToWords from '../utils/numberToWords'


const getPrintableContent = (invoiceData) => {

    const currentDate = new Date().toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    
    
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", options);
  };

    
    const orderDetailsRows = invoiceData.ChiTietPhieuDat.map((item, index) => `
    <tr>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td> <!-- Serial Number -->
    <td style="border: 1px solid #ddd; padding: 8px;">${item.TenDH}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.SoLuong}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.DonGia.toLocaleString()}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.Amount.toLocaleString()}</td>
    </tr>
  `).join('');

    const formattedContent = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
    <img src="/img/dlb-logo-dark.png" alt="Logo" style="height: 80px; width: 80px; margin-right: 20px;">
    <div>
      <h1 style="margin: 0; flex: 1; text-align: center;">HÓA ĐƠN</h1>
      <h2 style="margin: 0; flex: 1; text-align: center;">(INVOICE)</h2>
      <p style="text-align: center;">Ngày ${formatDate(invoiceData.NgayTaoHD)}</p>
    </div>
    <p style="margin: 0;">(Số) No.: ${invoiceData.MaHD}</p>   
  </div>

  <!-- Separator -->
  <hr style="margin-top: 20px; border: 1px solid #ddd;">

  <!-- Seller Information -->
  <table style="margin: auto; width: 100%;">
    <tr>
        <td style="width: 35%; ">Đơn vị bán hàng (Seller):</td>
        <td>DLB WATCH OFFICIAL</td>
    </tr>
    <tr>
        <td style="width: 35%; ">Mã số thuế (Tax Code):</td>
        <td></td>
    </tr>
    <tr>
        <td style="width: 35%; ">Địa chỉ (Address):</td>
        <td>CMT8, P.5, Q.Tân Bình, TP.HCM</td>
    </tr>
    <tr>
        <td style="width: 35%; ">Diện thoại (Tel):</td>
        <td>0832131101</td>
    </tr>
    <tr>
        <td style="width: 35%; ">Email:</td>
        <td>longbao12001@gmail.com</td>
    </tr>
</table>

  <!-- Separator -->
  <hr style="margin-top: 20px; border: 1px solid #ddd;">

  <!-- Buyer Information -->
   <table style="margin: auto; width: 100%;">
    <tr>
        <td style="width: 35%; ">Họ tên người mua hàng (Buyer):</td>
        <td style=" text-align: left;">${invoiceData.HoTen}</td>
    </tr>
    <tr>
        <td style="width: 35%; ">Mã số thuế (Tax code):</td>
        <td style=" text-align: left;">${invoiceData.MaSoThue}</td>
    </tr>
    </table>

  <!-- Separator -->
  <hr style="margin-top: 20px; border: 1px solid #ddd;">

  <!-- Order Details Table -->
  <table style="margin: auto; width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
    <!-- Order Details Table Header -->
    <thead>
      <tr>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">No</th>
      <th style="border: 1px solid #ddd; padding: 8px;text-align: center;">Product Name</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantity</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Unit Price</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Amount</th>
      </tr>
    </thead>
    <!-- Order Details Table Body -->
    <tbody>
      ${orderDetailsRows}
      <tr>
        <td colspan="4" style="text-align: right; border: 1px solid #ddd; padding: 8px;">Tổng tiền thanh toán (Total amount):</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${invoiceData.TongTien.toLocaleString()}</td>
      </tr>
      <tr>
        <td colspan="5" style="text-align: left; border: 1px solid #ddd; padding: 8px;">
        Số tiền viết bằng chữ (Total Amount in Words): <strong>${numberToWords(invoiceData.TongTien)} đồng.</strong>
        </td>
      </tr>
    </tbody>

  </table>

<div style="display: flex;justify-content: space-around; align-items: flex-end; margin-bottom: 20px; margin-top:3%;">
    <strong style="text-align: center; margin: 0;"></strong>
    <div>
      <strong style="text-align: center; margin: 0;">Người bán hàng (Seller)</strong>
      <p style="text-align: center; margin: 0;">${invoiceData.TenNV}</p>
    </div>
    
</div>
`;

    return formattedContent;
};

const printInvoice = (content) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(content);
    printWindow.document.title = "Invoice";
    printWindow.document.close();
    printWindow.print();
};


export {
    getPrintableContent,
    printInvoice
};