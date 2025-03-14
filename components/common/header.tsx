import Link from "next/link";

export default function Header() {
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      <div>
        <Link href="/">Saramsa</Link>
      </div>
      <div>
        <Link href="/#pricing">Pricing</Link>
      </div>
      <div>
        <Link href="/sign-in">Sign In</Link>
      </div>
    </nav>
  );
}
