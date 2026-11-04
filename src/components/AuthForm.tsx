
import { useEffect,useState } from "react";
import { supabase } from "../lib/supabase";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName.trim() } },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      isSignUp
        ? "Sign-up request submitted. Check your email if confirmation is required."
        : "Sign-in successful!",
    );
  };

  return (
    <section className="surface mx-auto mt-10 max-w-md p-7 sm:p-9">
      <div className="mb-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9f1e5] font-extrabold text-[#13795b]">₱</span><span className="text-lg font-extrabold text-[#102a2a]">PesaTrack</span></div>
      <p className="eyebrow">Welcome back</p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#102a2a]">
        Welcome to PesaTrack
      </h2>

      <p className="mt-2 text-sm text-[#6a7c7b]">
        Sign in or create an account to manage your finances.
      </p>

      
      {userEmail && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            Signed in as <strong>{userEmail}</strong>
          </p>

          <button
            type="button"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();

              if (error) {
                setMessage(error.message);
              } else {
                setMessage("You have signed out.");
              }
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Sign out
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {isSignUp && (
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              First name
            </label>

            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
              className="w-full rounded-lg border border-[#e4ece9] bg-[#f7faf8] px-3 py-3"
              placeholder="Your first name"
            />
          </div>
        )}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-[#e4ece9] bg-[#f7faf8] px-3 py-3"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-[#e4ece9] bg-[#f7faf8] px-3 py-3"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="primary-button w-full py-3 disabled:opacity-50"
        >
          {loading ? "Please wait..." :isSignUp ? "Create account" : "Sign in"}
        </button>
        {message && (
          <p role="status" className="text-sm text-slate-600">
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage("");
          }}
          className="text-sm font-bold text-[#13795b]"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "New to PesaTrack? Create an account"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;
