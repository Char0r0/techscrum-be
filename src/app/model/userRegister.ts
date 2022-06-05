import { Schema, model } from 'mongoose';

export interface UserRigister {
    email: string,
    name: string,
    password: string,
}

const registerSchema = new Schema<UserRigister>({
    email: { type: 'string', required: true},
    name: { type: 'string', required: true},
    password: { type: 'string', required: true}
});

const register = model<UserRigister>('userAccount', registerSchema);
module.exports = register;