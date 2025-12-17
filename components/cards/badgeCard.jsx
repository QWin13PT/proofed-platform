import Card from '../ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function BadgeCard({ platform, metric, txHash }) {
    return (
        <Card variant="border">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image src={platform.icon} alt={platform.name} width={24} height={24} />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <span className="text-sm font-medium">{metric.value}</span>
                    </div>
                </div>
                <Link href={`https://zkverify-testnet.subscan.io/extrinsic/${txHash}`} target="_blank" >
                    <div className='flex items-center gap-1 rounded-full bg-dark text-white px-2 py-1'>
                        <Image src="/images/brands/zkverify-icon-white.svg" alt="Proofed" width={16} height={16} />
                        <span className="text-sm font-medium">Proofed</span>
                    </div>
                </Link>
            </div>
        </Card>
    );
}