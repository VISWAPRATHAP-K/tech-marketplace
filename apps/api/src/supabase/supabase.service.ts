import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://qbdemyzzabmzzlttbkuw.supabase.co';
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

    try {
      this.client = createClient(supabaseUrl, supabaseKey);
      this.logger.log(`Supabase client initialized with URL: ${supabaseUrl}`);
    } catch (err) {
      this.logger.error('Failed to initialize Supabase client', err);
    }
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
