import { SetMetadata } from '@nestjs/common';
import { Action } from '../casl/ability.factory';

export const CASL_METADATA_KEY = 'casl';

export interface CaslRule {
  action: Action;
  subject: any;
}

export const Casl = (...rules: CaslRule[]) => SetMetadata(CASL_METADATA_KEY, rules); 