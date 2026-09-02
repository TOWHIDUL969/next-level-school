import React from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer/page";
import Header from "@/components/Header/page";
import SmoothScroll from "@/components/SmoothScroll/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
        <SmoothScroll/>
        {/* <--Header--> */}
        {/* <div className="max-lg:collapse bg-base-200 lg:mb-48 shadow-sm w-full rounded-md">
          <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
          <label htmlFor="navbar-1-toggle" className="fixed inset-0 hidden max-lg:peer-checked:block"></label>
          <div className="collapse-title navbar">
            <div className="navbar-start">
              <label htmlFor="navbar-1-toggle" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
              </label>
              <Link href={'/'} className="hidden md:block">Next Level School</Link>
              <Link href={'/'}> <Image src={'/logo.png'} alt="logo" height={40} width={40} className="block md:hidden"></Image> </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li><Link href={'/'}>Home</Link></li>
                <li><Link href={'/about'}>About US</Link></li>
                <li>
                  <details>
                    <summary>Services</summary>
                    <ul className="p-2 bg-base-100 w-40 z-1">
                      <li><Link href={'/courses'}>Our Course</Link></li>
                      <li><Link href={'/webcourse'}>Web Course</Link></li>
                      <li><Link href={'/BasicComputerCourse'}>Basic Computer & IT Application Course</Link></li>
                    </ul>
                  </details>
                </li>

                <li><Link href={'/contact'}>Contact</Link></li>
              </ul>
            </div>
            <div className="navbar-end">
              <input type="text" placeholder="Search" className="input w-64 lg:w-auto" />
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1 rounded-full">A</div>
                <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  <li><Link href={'/login'}>Log In</Link></li>
                  <li><Link href={'/register'}>Register</Link></li>
                </ul>
              </div>
            </div>

          </div>

          <div className="collapse-content lg:hidden z-1">
            <ul className="menu">
              <li><Link href={'/'}>Home</Link>
              </li>
              <li><Link href={'/about'}>About US</Link></li>
              <li>
                <button>Services</button>
                <ul className="p-2 bg-base-100 w-40 z-1">
                  <li><Link href={'/courses'}>Our Course</Link></li>
                  <li><Link href={'/webcourse'}>Web Course</Link></li>
                  <li><Link href={'/BasicComputerCourse'}>Basic Computer & IT Application Course</Link></li>
                </ul>
              </li>

              <li><Link href={'/contact'}>Contact</Link></li>
            </ul>
          </div>
        </div> */}

          <Header></Header>
        {/* main */}
        <main>
          
          {children}
        </main>
        {/* Footer */}
        {/* <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
          <aside>
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-current">
              <path
                d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <p>
              ACME Industries Ltd.
              <br />
              Providing reliable tech since 1992
            </p>
          </aside>
          <nav>
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav>
          <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav>
          <nav>
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </nav>
        </footer> */}

        <Footer></Footer>
        

      </div>
    </div>
  );
}