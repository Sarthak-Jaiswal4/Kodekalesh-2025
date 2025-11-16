'use client'
import React, { useEffect, useState, useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Delete, Share, Trash, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useParams, useRouter } from 'next/navigation'
import { SidebarGroupContent, SidebarTrigger } from "@/components/ui/sidebar";
import ErrorDialogue from './ErrorDialogue'
import axios from 'axios'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react';
import { Pdfs } from './Pdfs'

interface props {
  className?: string
}

function Header({ className }: props) {
  const chatid = useParams()
  const router = useRouter()
  const { data: session, status } = useSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteChat, setDeleteChat] = useState(false)

  const handleDeleteChat = async () => {
    try {
      const response = await axios.post('/api/deletechat', {
        chatid: chatid.id
      })
      if (response.status === 200) {
        router.push('/')
      }
    } catch (error) {
      console.log('Error in deleting chat', error)
    }
  }

  useEffect(() => {
    if (deleteChat) {
      handleDeleteChat()
    }
  }, [deleteChat])

  // Memoize the authentication status to prevent unnecessary re-renders
  const isAuthenticated = useMemo(() => status === "authenticated", [status])
  const isChatPage = useMemo(() => typeof(chatid.id) === 'string', [chatid.id])

  return (
    <>
      <div className={`w-full h-[65px] md:h-[55px] px-1 md:px-4 flex flex-row items-center py-4 md:backdrop-blur-md backdrop-blur-sm ${className}`}>
          <div className='flex justify-between items-center w-full h-full'>
            <div className='flex items-center rounded-xl px-2 py-1'>
              <SidebarGroupContent className="sm:hidden flex sticky top-2 left-0 z-10 h-full w-full py-2 inset-2">
                <SidebarTrigger />
              </SidebarGroupContent>
              {
                isChatPage &&
                <div className='flex gap-4'>
                  <h1
                    className='text-xl md:text-2xl cursor-pointer bg-[#E27D60] bg-clip-text text-transparent font-extrabold'
                    onClick={() => router.push('/')}
                  >
                    JuriSight
                  </h1>
                  <Pdfs className={' '} />
                </div>
              }
            </div>
            <div className='flex gap-3 items-center'>
              {isChatPage && isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className=' rounded-3xl border-0 cursor-pointer' variant="ghost">More</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full py-2 dark rounded-2xl dark flex flex-col justify-center items-center bg-[#252525] shadow-2xl/30 border-0">
                    <DropdownMenuItem className='pb-2 flex hover:bg-red-600 cursor-pointer' onClick={() => setShowDeleteDialog(true)}>
                      <Trash2 className='text-red-400 size-5' />
                      <h1 className='text-red-400 px-1'>
                        Delete
                      </h1>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'>
                      <Share className='text-[#F4F1ED] size-5' />
                      <h1 className='text-[#F4F1ED] px-1'>
                        Share
                      </h1>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {isAuthenticated ? (
                <div className='hidden'>
                  <Button onClick={() => signOut()} className='px-3 py-3 rounded-3xl cursor border-0' variant='ghost'>Sign Out</Button>
                </div>
              ) : (
                <div>
                  <Button onClick={() => router.push('/login')} className='px-3 py-3 rounded-3xl cursor bg-[#303030] border-0 cursor-pointer' variant='outline'>Sign in</Button>
                </div>
              )}
            </div>
              <a
                href="https://github.com/Sarthak-Jaiswal4/Kodekalesh-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2"
                title="View on GitHub"
              >
                <Button
                  variant="ghost"
                  className="px-2 py-2 rounded-3xl cursor-pointer border-0 flex items-center gap-2"
                >
                  <svg
                    height="20"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.2 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.03.08-2.14 0 0 .67-.21 2.2.82A7.65 7.65 0 018 4.89c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.94.08 2.14.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.94.29.25.54.73.54 1.48 0 1.06-.01 1.91-.01 2.17 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                  GitHub
                </Button>
              </a>
          </div>
        
      </div>
      {showDeleteDialog && (
        <ErrorDialogue
          title='Delete'
          desc='Are you sure you want to permanently delete the current chat? This action cannot be undone and all messages in this conversation will be lost.'
          type='delete'
          window={setShowDeleteDialog}
          action={setDeleteChat}
        />
      )}
    </>
  )
}

export default Header