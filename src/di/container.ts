import UserRepository from "../repository/user/UserRepository";
import TodoRepository from "../repository/todo/TodoRepository";
import ProfileRepository from "../repository/profile/ProfileRepository";
import UserTokenRepository from "../repository/userToken/UserTokenRepository";

/**
 * Dependency Injection container for services in the application.
 * 
 * Note: 
 * 1. Register any service class suitable for DI.
 * 2. Use type to resolve the DI.
 */
class DIContainer {
  private services = new Map<Function, any>();

  register<T>(ServiceType: new (...args: any[]) => T, instance: T): void {
    this.services.set(ServiceType, instance);
  }

  resolve<T>(ServiceType: new (...args: any[]) => T): T {
    const instance = this.services.get(ServiceType);

    if (!instance) {
      throw new Error(`Service of type ${ServiceType.name} not found`);
    }

    return instance;
  }
}

// Global DI container object to be used throughout the application.
const container = new DIContainer();

/**
 * Initializes the Dependency Injection container.
 * 
 * Note:
 * 1. Register all the services here.
 * 2. Use during the start of the application.
 */
export const initializeDIContainer = () => {
  container.register<UserRepository>(UserRepository, new UserRepository);
  container.register<UserTokenRepository>(UserTokenRepository, new UserTokenRepository);
  container.register<ProfileRepository>(ProfileRepository, new ProfileRepository);
  container.register<TodoRepository>(TodoRepository, new TodoRepository);
}

export { container };
