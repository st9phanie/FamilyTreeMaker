import { Button } from "@/components/ui/button";
import { resendConfirmation } from "@/lib/functions";
import { supabase } from "@/lib/supabase"; // Import your supabase client
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const navigate = useNavigate();



  const login = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data?.session) {
        navigate("/family");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const resend = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    setResending(true);
    setError(null);
    setInfo(null);

    try {
      const data = await resendConfirmation(email);

      if (data?.status === "success") {
        setInfo("Confirmation email sent. Check your inbox.");
      } else {
        setError(data?.message || "Failed to resend confirmation");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to resend confirmation");
    } finally {
      setResending(false);
    }
  };


  const goToSignup = () => {
    navigate("/signup")
  }
  return (
    <div className="h-screen flex flex-row w-full ">
      <div className="hidden h-full w-200 bg-slate-950 px-4 sm:flex flex-col text-white justify-between">
        <div className="h-[60px] flex items-center">
          <Link to="/"><p className='md:text-2xl text-xl font-medium '>ORIGIN</p></Link>
        </div>

        <div className="w-90 text-center gap-y-10 mx-auto flex flex-col items-center justify-center h-full">
          <h3 className="text-4xl font-semibold">Hello!</h3>
          <p className="text-wrap ">Start creating your family tree for free by signing up today. </p>
          <Button className="w-full capitalize py-5 bg-slate-700 hover:bg-slate-800 text-white border-none"
            onClick={goToSignup}>Sign up</Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 h-full w-full bg-teal-800 text-slate-950">
        <h1 className="text-4xl my-10 font-semibold text-white">Log in</h1>

        <input
          type="email"
          placeholder="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg dark:autofill:shadow-[inset_0_0_0px_1000px_#314158] bg-white px-2 py-2 w-[360px] border-sidebar-border "
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border px-2 dark:autofill:shadow-[inset_0_0_0px_1000px_#314158]  rounded-lg bg-white py-2 w-[360px]  border-sidebar-border"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-slate-950">{info}</p>}

        {error === "Email not confirmed. Please confirm your email." && (
          <button
            onClick={resend}
            disabled={resending}
            className="text-sm hover:font-medium"
          >
            {resending ? "Sending..." : "Resend confirmation email"}
          </button>
        )}

        <Button
          className=" w-[360px] py-5 text-white bg-slate-950 hover:bg-slate-900 border-none"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
