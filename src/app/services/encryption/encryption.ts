export default async function encryption(plainText: string){
    const bcrypt = require('bcrypt');
    const salt = bcrypt.genSaltSync(10);

    return await bcrypt.hash(plainText, salt);
}