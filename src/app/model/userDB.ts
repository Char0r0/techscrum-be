<<<<<<< HEAD
export interface user {
  email: string;
  password: string;
}
export const users = Array<user>(
  {
    email: "abc@gmail.com",

    password: "123456",
  },
  {
    email: "def@gmail.com",

    password: "123456",
  },
  {
    email: "regan@gmail.com",

    password: "123",
  }
);
||||||| 3f8c3d0
=======
interface user {
    id: number;
    fullName: string;
    Abbreviation: string;
    userName:string;
    personalFile: string;

}
export default user;
>>>>>>> 1c4704633775525f99b46412335d5d300e15ee62
