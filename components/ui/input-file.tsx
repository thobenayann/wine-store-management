import { Input } from '@/components/ui/input';
import { FormLabel } from './form';

interface InputFileProps {
    label: string;
    htmlFor: string;
    disabled?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputFile({
    disabled = false,
    label,
    htmlFor,
    onChange,
}: InputFileProps) {
    return (
        <div className='grid w-full max-w-sm items-center gap-1.5'>
            <FormLabel htmlFor={htmlFor}>{label}</FormLabel>
            <Input
                id='picture'
                type='file'
                disabled={disabled}
                onChange={onChange}
            />
        </div>
    );
}
