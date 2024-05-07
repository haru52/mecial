import type { User, UpdateUser } from '~/entities/user';
import { db as prismaDb } from '~/server/db';
import type { UserRepository } from '~/server/repositories/user-repository';

export class PrismaUserRepository implements UserRepository {
  #db = prismaDb;

  // UserRepository(db: typeof prismaDb) {
  //   this.#db = db;
  // }

  findById(id: string): Promise<User | null> {
    return this.#db.user.findFirst({
      where: { id },
    });
  }
  findAll(): Promise<User[]> {
    return this.#db.user.findMany();
  }
  // update(user: UpdateUser): Promise<User> {
  //   return this.#db.user.update({
  //     data: user,
  //     where: { id: user.id },
  //   });
  // }
  async delete(id: string): Promise<void> {
    await this.#db.user.delete({
      where: { id },
    });
  }
}
