import { redirect } from "next/navigation";
import HRShell from "@/components/hr/HRShell";
import { createClient } from "@/lib/supabase";

export default async function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_subscribed")
    .eq("id", authUser.id)
    .single();

  if (!profile?.is_subscribed) {
    redirect("/subscribe");
  }

  const email = authUser?.email ?? "";
  const metadataName = authUser?.user_metadata?.full_name;
  const name =
    typeof metadataName === "string" && metadataName.trim()
      ? metadataName
      : email.split("@")[0] || "HR Recruiter";

  return <HRShell user={{ name, email }}>{children}</HRShell>;
}