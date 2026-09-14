import type { ReactNode } from 'react';
export default function NeonCard({children,className=''}:{children:ReactNode;className?:string}){return <section className={`neon-card ${className}`}>{children}</section>}
