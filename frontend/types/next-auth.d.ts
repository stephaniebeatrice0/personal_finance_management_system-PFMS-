import 'next-auth';
import 'next-auth/jwt';

// Carry the Laravel (Sanctum) token through Auth.js's user -> JWT -> session pipeline
declare module 'next-auth' {
  interface User {
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}
