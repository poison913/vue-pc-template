const filters = {
    //表格中null字段或空字段的过滤方法
    spaceX(value) {
        if (value === undefined || value === null || value === '' || value === NaN) {
            return "-";
        } else {
            return value;
        }
    },
    //给数值每三位加逗号，如 12345678 转成 12,345,678
    toThousands(num) {
        if (num === undefined || num === null || num === '') {
            return "-";
        } else {
            var num = (num || 0).toString(),
                result = "";
            while (num.length > 3) {
                result = "," + num.slice(-3) + result;
                num = num.slice(0, num.length - 3);
            }
            if (num) {
                result = num + result;
            }
            return result;
        }
    },
    countW(value){
        if (value === undefined || value === null || value === '' || value === NaN) {
            return "-";
        } else {
            return Number((value/10000).toFixed(2));
        }
    }
}
export default filters