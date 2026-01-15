import { Button } from "@/components/ui/button";
import { signupuser } from "@/lib/functions";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async () => {
    setError(null);

    if (!email || !password || !password2) {
      setError("All fields are required.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const data = await signupuser({ email, password });

      if (data?.status === "success") {
        navigate("/login");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup failed", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="h-screen flex flex-row w-full ">
      <div className="h-full w-200 bg-teal-950 px-4 flex flex-col text-white justify-between">
        <div className="h-[60px] flex items-center">
          <Link to="/"><p className='md:text-2xl text-xl font-medium '>ORIGIN</p></Link>
        </div>

        <div className="w-90 text-center gap-y-10 mx-auto flex flex-col items-center justify-center h-full">
          <h3 className="text-4xl font-semibold">Welcome Back!</h3>
          <p className="text-wrap ">If you already have an account, you can proceed by signing in.</p>
          <Button className="w-full capitalize rounded-none border border-white border-b-2 bg-transparent hover:bg-teal-800" size="lg"
          onClick={goToLogin}>Sign In</Button>
        </div>
      </div>

      <div className=" justify-center items-center flex flex-col gap-3 h-full w-full bg-white text-teal-900">

        <h1 className="text-4xl my-10 font-semibold ">Create Account</h1>
        <input
          type="email"
          placeholder="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-2 w-90 bg-gray-100"
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border w-90 px-2 py-2 bg-gray-100"
        />

        <input
          type="password"
          placeholder="repeat password"
          value={password2}
          required
          onChange={(e) => setPassword2(e.target.value)}
          className="border w-90 px-2 py-2 bg-gray-100"
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button className="rounded-none w-90 py-5 hover:bg-teal-800/90 mt-2 " onClick={signup} disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </Button>

      </div>
    </div>
  );
};

export default SignUp;
