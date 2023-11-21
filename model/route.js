import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcrypt';
import User from '@model/UserModel';
import { connectionDb } from '@utils/dataBase';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/error',
  },

  providers: [
    GoogleProvider({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
    }),
    GithubProvider({
      clientId: process.env.GIT_CLIENT_ID,
      clientSecret: process.env.GIT_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Email',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'example@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectionDb();
          const exist = await User.findOne({ email: credentials.email });

          if (exist) {
            const verifyPasssword = await bcrypt.compare(
              credentials.password,
              exist.password
            );
            if (verifyPasssword) {
              return { name: exist.name, email: exist.email, id: exist._id };
            } else {
              console.log('incorrect password');
              return new Error('incorrect password');
            }
          } else {
            return null;
          }
        } catch (error) {
          throw new Error('error here');
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (profile) {
        await connectionDb();
        const exist = await User.findOne({ email: profile.email });
        if (exist) {
          return true;
        } else {
          await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture && profile.picture,
          });
          return true;
        }
      } else {
        return true;
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      try {
        await connectionDb();
        const users = await User.findOne({ email: session.user.email });
        if (users) {
          session.user.id = users._id.toString();
          session.user.name = users.name.toString();
          session.user.token = token;
          return session;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
});
export { handler as GET, handler as POST };
