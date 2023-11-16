"use client";
import Link from "next/link";
import Logo from "./Logo";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import classnames from "classnames";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function Header() {
    const { data: session, status } = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const currentPath = usePathname();
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === "authenticated" && session?.user?.sub) {
                try {
                    const response = await axios.get(
                        `/api/user/${session.user.sub}`
                    );
                    const userData = response.data;
                    setIsLoggedIn(true);
                    setAdmin(userData.role === "ADMIN");
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [status, session]);

    const links = [
        { label: "Hem", href: "/" },
        ...(isLoggedIn
            ? [
                ...(admin
                    ? [{ label: "Skapa användare", href: "/auth/signup" }]
                    : []),
                  { label: "Dokument", href: "/documents" },
                  { label: "Mina dokument", href: "/documents/myDoc" },
                  { label: "Skapa Dokument", href: "/documents/newDoc" },
                  { label: "Logga ut", href: "/auth/signout" },
              ]
            : [{ label: "Logga in", href: "/auth/signin" }]),
    ];

    return (
        <div className="header flex gap-4 mt-4 text-xl justify-around p-2 border-stone-500 border-b-2">
            <Logo />
            {status === "authenticated" ? (
                <h1 className="welcome">Hej, {session.user?.name}!</h1>
            ) : (
                <h1 className="welcome">Välkommen till G2 dokument!</h1>
            )}
            <div className="flex gap-4">
                <ul className="flex space-x-5">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            className={classnames({
                                "text-primary": link.href === currentPath,
                                "text-secondary": link.href !== currentPath,
                                "hover:text-primary transition-colors": true,
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
