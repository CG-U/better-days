import { redirect } from "next/navigation";

// The middleware routes "/" based on the session cookie; this is a fallback.
export default function HomePage() {
  redirect("/login");
}
