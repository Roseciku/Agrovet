import {useRef, useState} from 'react'
import HeroSection from '../components/HeroSection'
import MainPage from '../components/MainPage'
import Navbar from '../components/Navbar'
import FooterSection from '../components/FooterSection'
function HomePage() {

const linksRef = useRef(null);
const [isActive, setIsActive] = useState(false);

const scrollToSection = () => {
  setIsActive(true); //highlight
  linksRef.current?.scrollIntoView({behavior: "smooth"})

  //remove highlight after 2 seconds
setTimeout(()=>{
  setIsActive(false)
}, 2000)

}


  return (
    <div>
    < Navbar onLinkClick={scrollToSection} />
    <HeroSection />
    <MainPage linksRef={linksRef} isActive={isActive}/>
    <FooterSection linksRef={linksRef} isActive={isActive}/>

    </div>
  )
}

export default HomePage
