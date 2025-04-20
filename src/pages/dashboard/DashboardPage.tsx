import { useAuthStore } from "@/stores/auth.store";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  console.log(user);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Hola, {user?.first_name} {user?.last_name}
      </h1>
    </div>
  );
}
