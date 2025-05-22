"use client"

import {useState } from "react"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SettingsModal } from "../modals/settings-modal"
import type { UserProfile } from "../pages/student-dashboard"

interface AccountMenuProps {
  userProfile: UserProfile
  onUpdateProfile: (profile: UserProfile) => void
  onLogout: () => void
}

export function AccountMenu({ userProfile, onUpdateProfile, onLogout }: AccountMenuProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  } 
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback>{getInitials(userProfile.firstName, userProfile.lastName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
            onClick={() => onLogout()} 
            className="bg-red-500 text-white font-bold hover:bg-red-600"
            >
            <span>Logout</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        userProfile={userProfile}
        onUpdateProfile={onUpdateProfile}
      />
    </>
  )
}
