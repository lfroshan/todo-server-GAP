import bcrypt from "bcrypt";

import { UserRegisterPayload } from "../../zod.domain/user/userRegister.domain";

/**
 * Hashes the user's password and returns the updated user data.
 *
 * @param {UserRegisterPayload} userPayload - The user's registration data containing the plain text password.
 * @returns {Promise<UserRegisterPayload>} A promise that resolves to the user data object with the hashed password.
 *
 * @example
 * const userPayload = {
 *   username: "john_doe",
 *   email: "john@example.com",
 *   password: "password123",
 *   confirmPassword: "password123",
 * };
 *
 * prepareUserData(userPayload).then((hashedUserData) => {
 *   console.log(hashedUserData);
 *   // Output: { username: "john_doe", email: "john@example.com", password: "<hashed_password>", confirmPassword: "password123" }
 * });
 */
export async function prepareUserData(userPayload: UserRegisterPayload): Promise<UserRegisterPayload> {
  const hashedPassword = await bcrypt.hash(userPayload.password, 10);

  // replace the hashed password with the actual password.
  const userData = { ...userPayload, password: hashedPassword };

  return userData;
};
