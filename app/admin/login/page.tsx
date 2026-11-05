import { login } from "../actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm items-center px-5">
      <form action={login} className="glass w-full rounded-3xl p-8">
        <h1 className="grad-text text-3xl font-bold">Admin</h1>
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoFocus
          className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none focus:border-neon-blue"
        />
        {error && <p className="mt-3 text-sm text-neon-pink">Wrong password</p>}
        <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-neon-blue to-neon-pink py-3 font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}
