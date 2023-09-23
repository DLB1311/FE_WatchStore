import numberToWords from '../utils/numberToWords'

const getPrintableContent = (revenueReports,fromdate,todate,staff) => {

    const currentDate = new Date().toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const totalTongTien = revenueReports.reduce((sum, item) => sum + item.TongTien, 0);

    const revenueRows = revenueReports.map((item, index) => `
    <tr>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td> <!-- Serial Number -->
    <td style="border: 1px solid #ddd; padding: 8px;">${item.Ngay}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.TongDon}</td>
    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.TongTien.toLocaleString()}</td>
    </tr>
  `).join('');

    const formattedContent = `
    <style>
    /* CSS for page breaks */
    @media print {
      .header-revenue, .footer-revenue {
        page-break-inside: avoid;
      }

      .header-revenue {
        page-break-before: always;
      }

      .footer-revenue {
        page-break-after: always;
      }

    }
  </style>
    <div class="header-revenue">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <img src="/img/dlb-logo-dark.png" alt="Logo" style="height: 80px; width: 80px; margin-right: 20px;">
    </div>
        <h1 style="margin: 0; flex: 1; text-align: center;">BÁO CÁO DOANH THU THEO NGÀY</h1>
        <h2 style="margin: 0; flex: 1; text-align: center;">(DAILY REVENUE)</h2>
        <p style="text-align: center;">Từ ngày  ${fromdate} -  Đến ngày ${todate}</p>
    </div>  



  <!-- Order Details Table -->
  <div class="body-revenue">
   <table style="margin: auto; width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
      <!-- Order Details Table Header -->
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">No</th>
          <th style="border: 1px solid #ddd; padding: 8px;text-align: center;">Date</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Total order</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Total</th>
        </tr>
      </thead>
      <!-- Order Details Table Body -->
      <tbody>
        ${revenueRows}
        <tr>
          <td colspan="3" style="border: 1px solid #ddd; text-align: right; padding: 8px; font-weight: bold;">Total:</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${totalTongTien.toLocaleString()}</td>
        </tr>
        <tr>
        <td colspan="5" style="text-align: left; border: 1px solid #ddd; padding: 8px;">
        Số tiền viết bằng chữ (Total Amount in Words): <strong>${numberToWords(totalTongTien)} đồng.</strong>
        </td>
      </tr>
      </tbody>
    </table>
    </div>  

    <div class="footer-revenue">
    <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
      <div style="text-align: center;width: 66.66%;">
        <strong style="">Ngày ${currentDate}</strong>
        <p style="">NGƯỜI LẬP PHIẾU</p>
        <p style="">${staff.Ho + ' ' + staff.Ten}</p>
      </div>
    </div>
    </div>
`;

    return formattedContent;
};

const printRevenue = (content) => {
    const printWindow = window.open("", "_blank");
    
    printWindow.document.write(content);
    printWindow.document.title = "Revenue";
    printWindow.document.close();
    printWindow.print();
};


export {
    getPrintableContent,
    printRevenue
};