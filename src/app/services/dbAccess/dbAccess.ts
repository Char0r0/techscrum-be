import { UserRigister } from "../../model/userRegister"

const users = Array<UserRigister>({
    email: 'abc@gmail.com',
    password: '123456',
},{
    email: 'def@gmail.com',
    password: '123456',
});

export const emailCheck = (email: string) => {
    const index = users.findIndex(user => user.email === email);
    if(index >= 0) return false;
    return true;
}

export const register = (email: string, password: string) =>{
    const user: UserRigister = { email, password };
    const index = users.findIndex(user => user.email === email);
    if(index >= 0) return false;
    users.push(user)
    return true;
}