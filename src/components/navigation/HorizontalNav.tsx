import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  UserCircle,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function HorizontalNav() {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Envíos",
      icon: Package,
      href: "/shipments",
      active: pathname === "/shipments",
    },
    {
      label: "Perfil",
      icon: UserCircle,
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  const NavItems = ({
    mobile = false,
    onItemClick,
  }: {
    mobile?: boolean;
    onItemClick?: () => void;
  }) =>
    routes.map((route) => {
      if (mobile) {
        return (
          <Link
            key={route.href}
            to={route.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent/50",
              route.active && "bg-accent text-accent-foreground"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        );
      }

      return (
        <NavigationMenuItem key={route.href}>
          <Link to={route.href}>
            <NavigationMenuLink
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent/50",
                route.active && "bg-accent text-accent-foreground"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      );
    });

  return (
    <div className="border-b bg-background">
      <div className="mx-auto px-6 max-w-[1600px]">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Shipment Logistics</span>
          </Link>

          <div className="flex items-center gap-6">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-4">
                <NavItems />
              </NavigationMenuList>
            </NavigationMenu>

            <div className="hidden md:block w-px h-6 bg-border" />

            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.first_name} {user?.last_name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6">
                  <div className="flex flex-col gap-2">
                    <NavItems mobile onItemClick={() => setIsOpen(false)} />
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 rounded-md px-2 py-1 font-medium">
                        <UserCircle className="h-4 w-4" />
                        {user?.first_name} {user?.last_name}
                      </div>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-2"
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
