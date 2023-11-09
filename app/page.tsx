import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className=" text-xl" > Välkommen till G2-Dokumentations sida</h1>
                <Flex gap='2'>
                    <Button>
                        <Link href="/documents">
                            Se alla dokument
                        </Link>
                    </Button>
                    <br />
                    <Button>
                        <Link href="/documents/newDoc">
                            Skapa dokument
                        </Link>
                    </Button>
                </Flex>
        </main>
    );
}
