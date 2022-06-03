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
