import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = 'Todo' | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: any) {
    const { can, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

    if (user.role === 'admin') {
      can(Action.Manage, 'all'); // Admin can do everything
    } else {
      // Regular users can only manage their own todos
      can(Action.Create, 'Todo');
      can(Action.Read, 'Todo', { userId: user.userId });
      can(Action.Update, 'Todo', { userId: user.userId });
      can(Action.Delete, 'Todo', { userId: user.userId });
    }

    return build();
  }
} 