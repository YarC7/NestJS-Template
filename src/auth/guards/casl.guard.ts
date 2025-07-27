import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, Action } from '../casl/ability.factory';
import { AbilityFactory } from '../casl/ability.factory';

export interface RequiredRule {
  action: Action;
  subject: any;
}

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.get<RequiredRule[]>('casl', context.getHandler());
    if (!rules) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ability = this.abilityFactory.createForUser(user);

    return rules.every((rule) => ability.can(rule.action, rule.subject));
  }
} 