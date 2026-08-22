import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    console.log('Supabase URL:', environment.supabaseUrl);

    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }}
    );

    this.supabase.auth.getSession().then(({ data, error }) => {
      console.log('Current Supabase session:', data.session);
      console.log('Session error:', error);
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}