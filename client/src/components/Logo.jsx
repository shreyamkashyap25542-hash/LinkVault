import { Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Logo() { return <Link className="brand" to="/" aria-label="LinkVault home"><span className="brand-mark"><Link2 size={31} strokeWidth={2.8} /></span><span>LinkVault</span></Link>; }
