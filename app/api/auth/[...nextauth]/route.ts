import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import TwitterProvider from 'next-auth/providers/twitter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/adapters/mongodbAdapter';
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

const handler = NextAuth({
  //   pages: {
  //     signIn: '/auth/signin',
  //     signOut: '/auth/signout',
  //     error: '/auth/error', // Error code passed in query string as ?error=
  //     verifyRequest: '/auth/verify-request', // (used for check email message)
  //     newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  //   },
  session: { strategy: 'jwt' },

  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_APP_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: 'smtp://neyoo2078@gmail.com:quavrmcusmjljvcq@smtp.gmail.com:587',
      from: process.env.EMAIL_FROM,
      maxAge: 2 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      baseUrl = '/onboarding';
      return baseUrl;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile }) {
      return token;
    },
  },
});

export { handler as GET, handler as POST };
