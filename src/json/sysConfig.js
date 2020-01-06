export function sysConfig() {
    const evn = 0;//0代表开发环境，1是正式环境,2是测试环境
    let baseUrl = "";
    let chartMapUrl = "";
    let cookiePath="";
    if (evn === 0) {
        baseUrl = "";
        chartMapUrl = "http://serv.dcxxsoft.xyz:52006/";
        cookiePath="48334";
    } else if (evn === 1) {
        baseUrl = "";
        chartMapUrl = "http://serv.dcxxsoft.xyz:52006/";
        cookiePath="48005";
    } else if (evn === 2) {
        baseUrl = "http://10.33.150.190:8221/";
        chartMapUrl = "http://serv.dcxxsoft.xyz:52006/";
        cookiePath="8222";
    }
    return {
        "QRImgAndroid": baseUrl + "View/App/Images/android-html.jpg",
        "QRIMGIos": baseUrl + "View/App/Images/ios-html.jpg",
        "ServiceUrl": baseUrl,
        "chartMapServiceUrl": chartMapUrl,
        "cookiePath":cookiePath
    }
}