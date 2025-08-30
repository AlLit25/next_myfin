import Link from 'next/link';

export default function MenuButton({ href, text, color }) {
    return (
        <div className="text-center p-2">
            <Link href={href} className={`btn btn-${color} btn-menu fs-4 fw-bold`}>
                {text}
            </Link>
        </div>
    );
}