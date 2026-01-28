import Footer from '@/components/index-page/Footer'
import Hero from '@/components/index-page/Hero'
import Navbar from '@/components/index-page/Navbar'

const Index = () => {
  return (
    <div className='w-full bg-white flex flex-col '>
        <Navbar />
        <Hero />
        <Footer />
    </div>
  )
}

export default Index