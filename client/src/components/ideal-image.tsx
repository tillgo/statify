import { SpotifyImage } from '@shared/types.ts'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils.ts'

type IdealImageProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    images: SpotifyImage[]
    size: number
}

export const IdealImage = ({ images, size, className, ...other }: IdealImageProps) => {
    return (
        <img
            alt="cover"
            src={getAtLeastImage(images, size)}
            height={size}
            width={size}
            className={cn('object-cover', className)}
            {...other}
        />
    )
}

const PIXEL_RATIO = window.devicePixelRatio ?? 1
function getAtLeastImage(images: SpotifyImage[], size: number) {
    const realSize = size * PIXEL_RATIO
    const sorted = [...images].sort((a, b) => a.width + a.height - (b.width + b.height))
    return (
        sorted.find((s) => s.width > realSize && s.height > realSize)?.url ??
        sorted[sorted.length - 1]?.url
    )
}
