const bcrypt = require("bcrypt");

export async function validatePassword(inputPassword: string, currentPassword: string) {
  try {
    const isPasswordValid = await bcrypt.compare(inputPassword, currentPassword);
    if (!isPasswordValid) {
      throw new Error("password not found");
    }
  } catch (error) {
    console.log(error);
  }
}
