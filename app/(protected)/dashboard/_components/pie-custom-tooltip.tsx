import { getWineTypeSVG } from '../../wines/_components/wines-table';

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const { wine, quantity, type } = data;

    return (
        <div className='min-w-fit rounded border bg-background p-4'>
            <div className='flex items-center'>
                {getWineTypeSVG(type)}
                <div className='text-sm font-bold flex gap-x-2'>
                    <span>{wine}:</span>
                    <span>{quantity}</span>
                </div>
            </div>
        </div>
    );
}

export default CustomTooltip;
