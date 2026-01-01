import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login")
    }

    return (
        <section id="" className='flex flex-col lg:flex-row w-full h-[calc(100vh-120px)]  lg:justify-between px-5 py-10 lg:items-center '>
            <div className="flex flex-col lg:w-[50%] gap-y-6 lg:pr-10 lg:items-start items-center lg:text-start text-center">
                <h1 className="font-semibold  lg:text-5xl text-4xl  text-teal-900  ">Build a family tree</h1>
                <p className="text-xl ">Curious about your heritage? Jumpstart your ancestry search for FREE in the worldwide community family tree. Connect now—we may already have details about your family.
                </p>

                <p className="lg:mt-5 text-xl font-medium text-teal-900 ">Build Your Tree Now</p>
                <Button className="w-50 cursor-pointer hover:bg-teal-900/80 bg-teal-900 px-4 py-2 -mt-2 group rounded-none" onClick={goToLogin}>
                    Start now
                    <ArrowRight className="group-hover:translate-x-1 duration-400 -ml-1" />
                </Button>
                <p className="text-xs text-gray-500 -mt-4 italic">Free. No credit card required.</p>
            </div>
            <div className="lg:w-[50%] lg:mt-0 mt-6 ">
                <img src="/hero.jpg" alt="" className="object-cover w-full rounded-2xl lg:h-auto h-70" />
            </div>


        </section>
    )
}

export default Hero