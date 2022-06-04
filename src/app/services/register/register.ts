import { UserRigister } from "../../model/userRegister"
import encryption from '../encryption/encryption'

const users = Array<UserRigister>({
    email: 'abc@gmail.com',
    name: "Kuro",
    password: '123456',
},{
    email: 'def@gmail.com',
    name: "Kuro2",
    password: '123456',
});

export const emailCheck = (email: string) => {
    const index = users.findIndex(user => user.email === email);
    if(index >= 0) return false;
    return true;
}

export const register = async (email: string, name: string, password: string) =>{
    const user: UserRigister = { email, name, password: await encryption(password) };
    const index = users.findIndex(user => user.email === email);
    if(index >= 0) return false;
    users.push(user)
    return true;
}