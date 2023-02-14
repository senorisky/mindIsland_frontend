import CryptoJS from 'crypto-js'

// 需要和后端一致
const KEY = CryptoJS.enc.Utf8.parse('AUDVYWO123124iYz');
const IV = CryptoJS.enc.Utf8.parse('RIVFWi1234124biu');

export default {

    /**
     * 加密
     * @param {*} word
     */
    pencode(word) {
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, KEY, {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },
}

