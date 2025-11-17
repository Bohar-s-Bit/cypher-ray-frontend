import React, { useState } from 'react';
import toast from 'react-hot-toast';

const LoginForm = ({ onSubmit, loading = false }) => {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      rememberMe: formData.get('rememberMe') === 'on'
    };
    onSubmit(data);
  };

  const handleAccessRequestSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('accessEmail'),
      name: formData.get('accessName'),
      organizationName: formData.get('accessOrganization'),
      message: formData.get('accessMessage')
    };
    
    // Show success message for now
    toast.success('Access request submitted! Admin will review your request.');
    
    // Reset form
    e.target.reset();
    
    // TODO: Integrate with backend API when endpoint is ready
    console.log('Access request data:', data);
  };

  return (
    <div className="relative bg-white rounded-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden w-[1024px] max-w-[95vw] min-h-[600px]">
      {/* Sign Up / Access Request Form */}
      <div 
        className={`absolute top-0 left-0 h-full transition-all duration-[600ms] ease-in-out
          md:w-1/2
          w-full
          ${isActive 
            ? 'md:translate-x-full md:opacity-100 md:z-[5] md:animate-[move_0.6s] translate-x-0 opacity-100 z-[5]' 
            : 'md:opacity-0 md:z-[1] opacity-0 z-[1] pointer-events-none'
          }`}
      >
        <form 
          onSubmit={handleAccessRequestSubmit}
          className="bg-white flex items-center justify-center flex-col px-8 md:px-14 h-full py-10"
        >
          <h1 className="text-neutral-900 text-2xl md:text-3xl font-bold mb-4 md:mb-6">Request Access</h1>
          <span className="text-xs md:text-sm text-neutral-600 mb-4 md:mb-6 text-center">Fill in your details to request platform access</span>
          
          <input 
            type="text" 
            name="accessName"
            placeholder="Full Name" 
            required
            className="bg-neutral-100 border border-neutral-200 my-2 md:my-2.5 px-5 py-3 md:py-3.5 text-sm md:text-base rounded-lg w-full outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all text-neutral-900 placeholder:text-neutral-500"
          />
          
          <input 
            type="email" 
            name="accessEmail"
            placeholder="Email" 
            required
            className="bg-neutral-100 border border-neutral-200 my-2 md:my-2.5 px-5 py-3 md:py-3.5 text-sm md:text-base rounded-lg w-full outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all text-neutral-900 placeholder:text-neutral-500"
          />
          
          <input 
            type="text" 
            name="accessOrganization"
            placeholder="Organization Name" 
            required
            className="bg-neutral-100 border border-neutral-200 my-2 md:my-2.5 px-5 py-3 md:py-3.5 text-sm md:text-base rounded-lg w-full outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all text-neutral-900 placeholder:text-neutral-500"
          />
          
          <textarea 
            name="accessMessage"
            placeholder="Why do you need access to this platform?"
            required
            rows="3"
            className="bg-neutral-100 border border-neutral-200 my-2 md:my-2.5 px-5 py-3 md:py-3.5 text-sm md:text-base rounded-lg w-full outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all resize-none text-neutral-900 placeholder:text-neutral-500"
          />
          
          <button 
            type="submit"
            className="bg-purple-600 text-white text-xs md:text-sm px-10 md:px-14 py-3 md:py-3.5 border border-transparent rounded-lg font-semibold tracking-wide uppercase mt-3 md:mt-4 cursor-pointer hover:bg-purple-700 active:bg-purple-800 transition-all shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 w-full md:w-auto"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Sign In Form */}
      <div 
        className={`absolute top-0 left-0 h-full transition-all duration-[600ms] ease-in-out
          md:w-1/2 md:z-[2]
          w-full z-[2]
          ${isActive 
            ? 'md:translate-x-full translate-x-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' 
            : 'translate-x-0 opacity-100 pointer-events-auto'
          }`}
      >
        <form 
          onSubmit={handleSignInSubmit}
          className="bg-white flex items-center justify-center flex-col px-8 md:px-14 h-full py-10"
        >
          <h1 className="text-neutral-900 text-2xl md:text-3xl font-bold mb-4 md:mb-6">Sign In</h1>
          <span className="text-xs md:text-sm text-neutral-600 mb-4 md:mb-6">Use your email and password</span>
          
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            required
            className="bg-neutral-100 border border-neutral-200 my-2 md:my-2.5 px-5 py-3 md:py-3.5 text-sm md:text-base rounded-lg w-full outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all text-neutral-900 placeholder:text-neutral-500"
          />
          
          <div className="relative w-full my-2 md:my-2.5">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password" 
              required
              className="bg-neutral-100 border border-neutral-200 px-5 py-3 md:py-3.5 pr-12 text-sm md:text-base rounded-lg w-full outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all text-neutral-900 placeholder:text-neutral-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-purple-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between w-full mt-4 md:mt-5 mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="rememberMe"
                id="rememberMe"
                className="cursor-pointer w-4 h-4 accent-purple-600"
              />
              <label htmlFor="rememberMe" className="text-neutral-700 text-sm md:text-base cursor-pointer">
                Remember me
              </label>
            </div>
            <span className="text-sm md:text-base text-purple-600 cursor-pointer hover:text-purple-700 hover:underline transition-colors">
              Forgot password?
            </span>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white text-xs md:text-sm px-10 md:px-14 py-3 md:py-3.5 border border-transparent rounded-lg font-semibold tracking-wide uppercase mt-3 md:mt-4 cursor-pointer hover:bg-purple-700 active:bg-purple-800 transition-all shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600 disabled:shadow-none w-full md:w-auto"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>

      {/* Toggle Container - Hidden on mobile, visible on md+ */}
      <div 
        className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[600ms] ease-in-out z-[1000] ${
          isActive 
            ? '-translate-x-full rounded-r-[150px_100px_0_0]' 
            : 'rounded-l-[150px_0_0_100px]'
        }`}
      >
        <div 
          className={`bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 h-full text-white relative -left-full w-[200%] transition-all duration-[600ms] ease-in-out ${
            isActive ? 'translate-x-1/2' : 'translate-x-0'
          }`}
        >
          {/* Toggle Left Panel */}
          <div 
            className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-10 text-center top-0 transition-all duration-[600ms] ease-in-out ${
              isActive ? 'translate-x-0' : '-translate-x-[200%]'
            }`}
          >
            <h1 className="text-white text-3xl font-bold mb-6">Welcome Back!</h1>
            <p className="text-base leading-6 tracking-wide my-6 text-purple-50">
              Enter your credentials to access all platform features
            </p>
            <button 
              onClick={() => setIsActive(false)}
              className="bg-transparent border-2 border-white text-white text-sm px-12 py-3 rounded-lg font-semibold tracking-wide uppercase mt-4 cursor-pointer hover:bg-white hover:text-purple-600 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </div>

          {/* Toggle Right Panel */}
          <div 
            className={`absolute right-0 w-1/2 h-full flex items-center justify-center flex-col px-10 text-center top-0 transition-all duration-[600ms] ease-in-out ${
              isActive ? 'translate-x-[200%]' : 'translate-x-0'
            }`}
          >
            <h1 className="text-white text-3xl font-bold mb-6">Hello, Explorer!</h1>
            <p className="text-base leading-6 tracking-wide my-6 text-purple-50">
              Don't have access? Request access to use all platform features
            </p>
            <button 
              onClick={() => setIsActive(true)}
              className="bg-transparent border-2 border-white text-white text-sm px-12 py-3 rounded-lg font-semibold tracking-wide uppercase mt-4 cursor-pointer hover:bg-white hover:text-purple-600 transition-all shadow-lg hover:shadow-xl"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Buttons - Visible only on mobile */}
      <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-[1001] px-6">
        <button
          onClick={() => setIsActive(false)}
          className={`px-8 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
            !isActive
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white text-purple-600 border-2 border-purple-600'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsActive(true)}
          className={`px-8 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
            isActive
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white text-purple-600 border-2 border-purple-600'
          }`}
        >
          Request Access
        </button>
      </div>

      <style jsx>{`
        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
