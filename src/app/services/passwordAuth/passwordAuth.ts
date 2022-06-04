export default async function encryption(passwordPlaintext: string, passwordCiphertext: string){
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(passwordPlaintext, passwordCiphertext);
}