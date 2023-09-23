const getOrderStatusText = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "Unpaid";
      case 1:
        return "Progressing";
      case 2:
        return "Shipping";
      case 3:
        return "Completed";
      case 4:
        return "Arborted";
      default:
        return "Unknown";
    }
  };
  
  export default getOrderStatusText;