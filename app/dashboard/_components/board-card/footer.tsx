
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react";


interface FooterProps{
    title: string;
    authorLable: string;
    createdAtLabel: string;
    isFavriotes: boolean;
    onClick: () => void;
    disabled: boolean;

} 

const Footer = ({
    title,
    authorLable,
    createdAtLabel,
    isFavriotes,
    onClick,
    disabled
} : FooterProps) => {

    const handelClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation()
        event.preventDefault()
        onClick()
    }

  return (
    <div className="relative bg-white p-3 ">
        <p className="text-[13px] truncate max-w-[calc(100%-20px)]">
            {title}
        </p>
        <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
            {authorLable},{createdAtLabel}
        </p>

        <button 
        disabled={disabled}
            onClick={handelClick}
            className={cn(
                "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
                disabled && "cursor-not-allowed opacity-75"
            )}
        >
            <Star
                className={cn(
                    "h-4 w-4",
                    isFavriotes && "fill-blue-600 text-blue-600"
                )}
            />
        </button>
    </div>
  )
}

export default Footer