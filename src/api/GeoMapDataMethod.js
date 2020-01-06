export function mapDataMethod(mapArray) {
    let FinalMapData = { "type": "FeatureCollection", "features": [] };
    for (let obj of mapArray) {
        let mapItem = { "type": "Feature" };
        mapItem.properties = { "name": obj.ADMIN_DIV_NAME, "ID_0": 33, "ID_1": Number(obj.ADCD), "ISO": "zhejiang" };
        mapItem.geometry = eval('(' + obj.COORDINATES + ')');
        FinalMapData.features.push(mapItem);
    }
    return FinalMapData;
}