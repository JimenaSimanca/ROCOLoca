import type { ButtonHTMLAttributes, ReactNode } from 'react';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;variant?:'pink'|'blue'|'yellow'};
export default function NeonButton({children,variant='pink',className='',...props}:Props){return <button className={`neon-button neon-button--${variant} ${className}`} {...props}>{children}</button>}
