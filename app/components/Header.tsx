"use client";
import Link from "next/link";
import Logo from "./Logo";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import classnames from "classnames";
import { usePathname } from "next/navigation";

export default function Header() {
    const { data: session, status } = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const currentPath = usePathname();

    useEffect(() => {
        if (status === "authenticated") {
            setIsLoggedIn(true);
        }
    }, [status]);

    const links = [
        { label: "Home", href: "/" },
        ...(isLoggedIn
            ? [
                  { label: "Documents", href: "/documents" },
                  { label: "Skapa Dokument", href: "/documents/newDoc" },
                  { label: "Logga ut", href: "/auth/signout" },
              ]
            : [{ label: "Logga in", href: "/auth/signin" }]),
    ];


    return (
        <div className="header flex gap-4 mt-4 text-xl justify-between p-2 border-stone-500 border-b-2">
            <Logo /> 
            {status === "authenticated" ? (
                <h1 className='welcome dark:text-white'>Hej, {session.user?.name}!</h1>
            ) : (
                <h1 className='welcome dark:text-white'>Välkommen till G2 dokument!</h1>
            )}
            <div className="flex gap-4">
                <ul className="flex space-x-5">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            className={classnames({
                                "text-stone-500": link.href === currentPath,
                                "text-stone-700": link.href !== currentPath,
                                "hover:text-stone-800 transition-colors": true,
                            })}
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
}
