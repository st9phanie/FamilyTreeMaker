import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login")
    }

    return (
        <section id="" className='flex flex-col lg:flex-row w-full h-screen lg:justify-between px-20 py-5 lg:items-center z-10 '>
            <div className="bg-teal-800 size-100 top-15 right-0 -z-10 absolute rounded-bl-full" />
            <div className="absolute top-[90%] left-0 -z-10 w-20 h-20 bg-teal-800 rounded-tr-full" />

            <div className="flex flex-col lg:w-[50%] gap-y-6 lg:pr-10 lg:items-start items-center lg:text-start text-center">
                <h1 className="font-semibold  lg:text-[52px] text-4xl  text-teal-900  ">Build a family tree</h1>
                <p className="text-xl ">Draw your family tree online and share it with relatives. Add photos and biographical details. Print the family tree or download to own computer for free.
                </p>

                <p className="lg:mt-5 text-xl font-medium text-teal-950 ">Build Your Tree Now</p>
                <Button className="w-50 cursor-pointer px-4 py-2 -mt-2 group" onClick={goToLogin}>
                    Start now
                    <ArrowRight className="group-hover:translate-x-1 duration-400 -ml-1" />
                </Button>
                {/* <p className="text-xs text-gray-500 -mt-4 italic">Free. No credit card required.</p> */}
            </div>
            <div className="lg:w-[50%] lg:mt-0 mt-6 ">
                <img src="/hero.jpg" alt="" className="object-cover w-full rounded-2xl lg:h-auto h-70" />
            </div>


        </section>
    )
}

export default Hero