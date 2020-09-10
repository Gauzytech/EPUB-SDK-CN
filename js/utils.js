/**
 * JS字符串加密和解密
 * @param    {[string]} [str] [需要加密/解密的字符串（包括中文）]
 * @param    {[string]} [pwd] [密码]
 * @param    {[string]} [type] [类型：E = 加密 、D = 解密]
 * @return   {[string]}
 */
function Secret_Key(str,pwd,type) {
    let b = new Base64(); //需要加载一个Base64.js文件 可以上网自行下载
    if(type === 'E'){   //加密
        str = b.encode(str);//Base64加密
        let prand = "";
        for(let i=0; i<pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        let sPos = Math.floor(prand.length / 5);
        let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        let incr = Math.ceil(pwd.length / 2);
        let modu = Math.pow(2, 31) - 1;
        if(mult < 2) {
            alert("Please choose a more complex or longer password.");
            return null;
        }
        let salt = Math.round(Math.random() * 1000000000) % 100000000;
        prand += salt;
        while(prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        let enc_chr = "";
        let enc_str = "";
        for(let i=0; i<str.length; i++) {
            enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
            if(enc_chr < 16) {
                enc_str += "0" + enc_chr.toString(16);
            } else enc_str += enc_chr.toString(16);
            prand = (mult * prand + incr) % modu;
        }
        salt = salt.toString(16);
        while(salt.length < 8)salt = "0" + salt;
        enc_str += salt;
        return enc_str;
    }
    if(type === 'D'){  //解密
        let prand = "";
        for(let i=0; i<pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        let sPos = Math.floor(prand.length / 5);
        let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        let incr = Math.round(pwd.length / 2);
        let modu = Math.pow(2, 31) - 1;
        let salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while(prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        let enc_chr = "";
        let enc_str = "";
        for(let i=0; i<str.length; i+=2) {
            enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
            enc_str += String.fromCharCode(enc_chr);
            prand = (mult * prand + incr) % modu;
        }
        return b.decode(enc_str);
    }
}