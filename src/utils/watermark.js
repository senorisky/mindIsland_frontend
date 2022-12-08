export default {
    //局部水印
    addWaterMark(strArr) {
        let ctx = document.createElement("canvas");
        ctx.width = 250;
        ctx.height = 100;
        ctx.style.display = "none";
        let cans = ctx.getContext("2d");
        cans.rotate((-20 * Math.PI) / 180);
        cans.font = "16px 宋体";
        cans.fillStyle = "#ccc";
        cans.textAlign = "left";
        cans.textBaseline = "Middle";
        cans.fillText(strArr, 0, 100);
        cans.save();
        return ctx.toDataURL();
    }
}