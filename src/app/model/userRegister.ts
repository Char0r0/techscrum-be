import { Schema, model } from 'mongoose';

export interface UserRegister {
    email: string,
    name: string,
    password: string,
}

const registerSchema = new Schema<UserRegister>({
    email: { type: 'string', required: true},
    name: { type: 'string', required: true},
    password: { type: 'string', required: true}
});

const register = model<UserRegister>('userAccount', registerSchema);
module.exports = register;