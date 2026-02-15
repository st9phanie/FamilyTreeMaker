import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login")
    }

    return (
        <section id="" className='text-primary bg-secondary flex flex-col lg:flex-row pt-[40px] w-full h-screen lg:justify-between justify-center lg:px-20 px-10 py-5 lg:items-center z-10 '>
            <div className="bg-slate-300 size-60 dark:opacity-0 dark:lg:opacity-100 md:bg-teal-700  lg:size-100 top-15 right-0 -z-10 absolute rounded-bl-full " />
            <div className="absolute bottom-0 left-0 -z-10 w-20 h-20 bg-slate-300 md:bg-teal-700  rounded-tr-full" />

            <div className="flex flex-col lg:w-[50%] gap-y-6 lg:pr-10 lg:items-start items-center lg:text-start text-center">
                <h1 className="font-semibold  lg:text-[52px] text-4xl  ">Build a family tree</h1>
                <p className="text-xl text-primary/80">Draw your family tree online and add photos and biographical details. Download it as a PDF or a picture completely for free.
                </p>

                <p className="lg:mt-5 text-xl font-medium text-primary ">Create Your Tree Now</p>
                <Button className="w-50 cursor-pointer px-4 py-2 border-none -mt-2 group hidden lg:flex" onClick={goToLogin}>
                    Start building
                    <ArrowRight className="group-hover:translate-x-1 duration-400 -ml-1" />
                </Button>

                <p className="text-primary/60 lg:hidden -mt-2">Only available on desktop :( </p>
                {/* <p className="text-xs text-primary-foreground -mt-4 italic">Free. No credit card required.</p> */}
            </div>
            <div className="lg:w-[50%] lg:mt-0 mt-6 ">
                <img src={`${import.meta.env.BASE_URL}hero.jpg`} alt="" loading="lazy" className="object-cover w-full rounded-2xl lg:h-auto h-70" />
            </div>


        </section>
    )
}

export default Hero