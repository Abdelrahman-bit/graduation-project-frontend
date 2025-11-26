import Image from 'next/image';
import SignupForm from '../../../components/auth/SignupForm/SignupForm';
import { MotionImageRight } from '@/app/components/Motion/Motion';

const SignUp = () => {
   return (
      <main className="flex h-[88vh]">
         <div className="w-[45%] flex justify-center items-center bg-secondary">
            <MotionImageRight>
               <Image
                  src={'/login/register.png'}
                  alt="register Image"
                  width={500}
                  height={500}
               />
            </MotionImageRight>
         </div>
         <div className="w-1/2 flex justify-center items-center bg-white">
            <SignupForm />
         </div>
      </main>
   );
};

export default SignUp;
