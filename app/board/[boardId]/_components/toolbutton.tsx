'use client'

import { LucideIcon } from 'lucide-react'
import { Hint } from '@/components/Hint'
import { Button } from '@/components/ui/button'

interface ToolButtonProps {
    lebel: string
    icon: LucideIcon
    onClick: () => void
    isActive?: boolean
    isDisabled?: boolean
}   

export const ToolButton = ({
    lebel,
    icon: Icon,
    onClick,
    isActive,
    isDisabled
}: ToolButtonProps) => {
  return (
    <Hint lebel={lebel} side='right' sideOffset={14}>
        <Button
            variant={isActive ? 'boardActive' : 'board'}
            onClick={onClick}
            disabled={isDisabled}
            size='icon'
            className='h-8 w-8'
        >
            <Icon className='h-4 w-4' />
        </Button>
    </Hint>
  )
}

