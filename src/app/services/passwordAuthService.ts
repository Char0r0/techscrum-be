export async function encryption(passwordPlaintext: string, passwordCiphertext: string) {
  const bcrypt = require('bcrypt');
  const encryptedPassword = await bcrypt.compare(passwordPlaintext, passwordCiphertext);
  return encryptedPassword;
}
