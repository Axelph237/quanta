/**
 * UNUSED - I am hoping to replace the independent headers in the pages with this component in the root layout
 * Major issue: it is tightly coupled to the page content (due to page transition animations)
 * and to page metadata (like how to transition a page and what navs it should have).
 *
 * Current Solution: Remove scope coupling to a provider that can pass the animation scope and call to this component,
 * as well to any page that uses transitions to set the ref to its main body.
 */
import { GENTLE_EASE } from "@/app/globals";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";
import NavText from "./NavText";
import Link from "next/link";
import Logo from "./Logo";
import { usePathname, useRouter } from "next/navigation";
import { usePageTransition } from "../providers/PageTransitionProvider";
import { cssvar, csstopx } from "@/lib/styles";

type Route = {
  path: RegExp;
  label: string;
  onLogoClick?: () => void;
  navs?: {
    left: {
      text: string;
      onClick: () => void;
    };
    right: {
      text: string;
      onClick: () => void;
    };
  };
};

const routes: Route[] = [
  {
    path: /^\/$/,
    label: "Home",
    onLogoClick: () => {},
    navs: {
      left: { text: "ABOUT", onClick: () => {} },
      right: { text: "LESSONS", onClick: () => {} },
    },
  },
  { path: /^\/lessons\/?$/, label: "Lessons" },
  { path: /^\/lessons\/[^/]+\/?$/, label: "Lesson Page" },
];

export default function Header() {
  const { pageScope, animatePage } = usePageTransition();
  const router = useRouter();

  /**
   * Logo shift animations
   */
  const [logoShift, setLogoShift] = useState<number>(0);

  useEffect(() => {
    // Update the left shift for the logo component
    const handleResize = () => {
      const logoWidth = document
        .getElementById("logo")!
        .getBoundingClientRect().width;
      setLogoShift(
        -(window.innerWidth * 0.5) +
          Number(csstopx(cssvar("--page-padding", document.body))) +
          logoWidth / 2,
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Scroll animations
   */
  const { scrollY } = useScroll();
  const smoothedScrollY = useSpring(scrollY);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useMotionValueEvent(smoothedScrollY, "change", (latest) => {
    const SCROLL_DEADZONE = 50;
    setScrolled(latest > SCROLL_DEADZONE);
  });

  /**
   * Redirection
   */
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const handleAboutRedirect = () => {
    const about = document.getElementById("about-content");
    if (!about) {
      throw new Error("About section not found");
    }
    window.scrollTo({
      top: about.offsetTop,
      behavior: "smooth",
    });
  };

  const handleLessonsRedirect = async () => {
    setRedirecting(true);
    await animatePage(
      {
        x: "-100%",
        opacity: 0,
      },
      GENTLE_EASE,
    );
    router.push("/lessons");
  };

  /**
   * For fun :)
   */
  const [clickCounter, setClickCounter] = useState<number>(0);
  useEffect(() => {
    if (clickCounter === 10) {
      const sfx = new Audio("/assets/thud_sfx.mp3");
      sfx.play();
    }

    const timer = setTimeout(() => {
      setClickCounter(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [clickCounter]);

  /**
   * Route-based state
   */

  const pathname = usePathname();
  const [isOpen] = useState(false);

  const [page, setPage] = useState<Route>(routes[0]);

  useEffect(() => {
    const route = routes.find((r) => r.path.test(pathname));
    if (route) {
      setPage(route);
    }
  }, [pathname]);

  return (
    <header>
      {/* Left Nav */}
      <div className="absolute inset-0 z-0 bg-linear-to-b from-quanta-surface to-transparent"></div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: scrolled || redirecting ? 0 : 1,
        }}
        transition={GENTLE_EASE}
      >
        <NavText
          id="left-nav"
          text={page.navs?.left.text ?? ""}
          className={`${page.navs?.left ? "" : "opacity-0"}`}
          onClick={page.navs?.left.onClick}
        />
      </motion.span>
      {/* Logo */}
      <Link href="/home">
        <Logo
          id="logo"
          animate={{
            left: scrolled || redirecting || !isOpen ? logoShift : 0,
          }}
          transition={GENTLE_EASE}
          textVisible={!(scrolled || redirecting) || isOpen}
          onClick={page.onLogoClick}
        />
      </Link>
      {/* Right Nav */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: redirecting ? 0 : 1,
        }}
        transition={GENTLE_EASE}
      >
        <NavText
          id="right-nav"
          text={page.navs?.right.text ?? ""}
          className={`${page.navs?.right ? "" : "opacity-0"}`}
          onClick={page.navs?.right.onClick}
        />
      </motion.span>
    </header>
  );
}
