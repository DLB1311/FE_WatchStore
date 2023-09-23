const numberToWords = (number) => {
    const ones = [
        "", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười"
    ];
    const suffixes = ["", "nghìn", "triệu", "tỷ"];

    const convertGroup = (group) => {
        const [hundred, ten, unit] = group;

        let result = "";

        if (hundred !== 0) {
            result += ones[hundred] + " trăm ";
        }

        if (ten === 1) {
            result += "mười ";
        } else if (ten > 1) {
            result += ones[ten] + " mươi ";
        }

        if (unit !== 0) {
            if (ten === 0 && hundred !== 0) {
                result += "lẻ ";
            }
            if (ten !== 1 || unit > 1) {
                result += ones[unit] + " ";
            }
        }

        return result;
    };

    const groups = [];
    while (number !== 0) {
        groups.push(number % 1000);
        number = Math.floor(number / 1000);
    }

    if (groups.length === 0) {
        return "không";
    }

    const result = groups
        .map((group, index) => {
            if (group !== 0) {
                return convertGroup([
                    Math.floor(group / 100),
                    Math.floor((group % 100) / 10),
                    group % 10
                ]) + suffixes[index];
            }
            return null;
        })
        .filter(group => group !== null)
        .reverse()
        .join(" ");

    return result.trim();
};

export default numberToWords;