"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Loading...</Button>
  }

  if (session) {
    return (
      <>
        <span className="mr-2">{session.user?.name}</span>
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }
  return (
    <Button onClick={() => signIn()}>Sign in</Button>
  )
}