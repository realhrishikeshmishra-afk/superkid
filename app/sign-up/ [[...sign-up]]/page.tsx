import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-light-bg">
      <div className="relative group">
         <div className="absolute inset-0 bg-primary/10 rounded-[40px] blur-3xl group-hover:bg-primary/20 transition-all duration-1000"></div>
         <SignUp 
           appearance={{
             elements: {
               formButtonPrimary: 'btn btn-primary rounded-full px-8 h-12 flex items-center justify-center font-bold tracking-widest italic',
               card: 'border border-pink-50 shadow-2xl rounded-[32px] overflow-hidden',
               headerTitle: 'text-2xl font-black text-dark italic',
               headerSubtitle: 'text-dark/40 font-bold'
             }
           }}
           routing="path" 
           path="/sign-up" 
         />
      </div>
    </div>
  );
}
