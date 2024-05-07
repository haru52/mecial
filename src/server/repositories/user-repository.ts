import type { User, UpdateUser } from '~/entities/user';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  // update(user: UpdateUser): Promise<User>;
  delete(id: string): Promise<void>;
}
