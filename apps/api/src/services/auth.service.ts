import { LoginRequest, LoginResponse, SignupRequest, SignupResponse, mapUserToLoginResponse } from '../database/models/auth';
import { UserService } from './user.service';
import { generateAccessToken, verifyToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.getUserByEmail(credentials.email);

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isPasswordValid = await comparePassword(credentials.password, user.passwordHash || '');
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    return mapUserToLoginResponse(user, accessToken);
  }

  /**
   * Register a new user
   */
  async signup(signupData: SignupRequest): Promise<SignupResponse> {
    // Check if user already exists
    const existingUser = await this.userService.getUserByEmail(signupData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(signupData.password);

    const newUser = await this.userService.createUser({
      email: signupData.email,
      name: signupData.name,
      phone: signupData.phone,
      passwordHash: hashedPassword,
    });

    // Generate JWT token
    const accessToken = generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      accessToken,
    };
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
    const decoded = verifyToken(token);
    return decoded;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<string> {
    const decoded = verifyToken(refreshToken);
    
    if (!decoded) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
    });

    return newAccessToken;
  }

  /**
   * Logout user
   */
  async logout(_userId: string): Promise<void> {
    // TODO: Implement logout logic (e.g., invalidate tokens, clear sessions)
  }
}

export const authService = new AuthService();
