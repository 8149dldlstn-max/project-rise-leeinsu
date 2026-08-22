import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV_KEYS } from '../../constants';

// Supabase Storage 접근용 클라이언트를 한 곳에서만 생성해 전역 제공
@Injectable()
export class SupabaseClientService {
  private readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>(ENV_KEYS.SUPABASE_URL)!;
    const supabaseServiceRoleKey = this.configService.get<string>(
      ENV_KEYS.SUPABASE_SERVICE_ROLE_KEY,
    )!;
    this.client = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
