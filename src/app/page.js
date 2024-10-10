'use client'
import Image from "next/image";
import banner from "../../public/assets/images/banner.png"
import logo from "../../public/assets/images/iste-logo.svg"
import { useRouter } from "next/navigation";
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Home() {
  const router=useRouter();

  return (
    <div className="min-h-screen justify-center bg-gray-100">
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center gap-2">
            <div>
              <Image src={logo} width={60}/>
            </div>
            <div>ISTE VNRVJIET</div>
          </div>
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:text-gray-400">Home</a></li>
            <li><a href="/flutter-bootcamp/seats" className="hover:text-gray-400">Register Now</a></li>
          </ul>
        </div>
      </nav>


      <div className="w-full flex justify-center mt-6">
        <Image
          src={banner}
          alt="Banner Image"
          width={800}
        />
      </div>

      <div className="mt-8 text-center mb-10">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Platform</h1>
        <a
          href="/flutter-bootcamp/seats"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
        >
          Register Here
        </a>
      </div>

      <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <p className="text-sm mb-4 md:mb-0">© 2024 MyWebsite. All rights reserved.</p>

        {/* Right Section: Social Links */}
        <div className="flex space-x-6">
          <a
            href="https://www.instagram.com/iste_vnrvjiet/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaInstagram className="text-2xl" />
          </a>
          <a
            href="https://www.linkedin.com/company/iste-vnrvjiet/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
    </div>
  );
}
