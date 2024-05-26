import { CircleAlert } from 'lucide-react';
import CardWrapper from './card-wrapper';

function ErrorCard() {
    return (
        <CardWrapper
            backButtonHref='/auth/login'
            headerLabel={'Oops! Une erreur est survenue!'}
            headerTitle={'Erreur 😥'}
            backButtonLabel={'Retour à la page de connexion'}
        >
            <div className='bg-destructive/15 p-3 rounded-md flex items-center justify-center gap-x-2 text-sm text-destructive'>
                <CircleAlert className='w-4 h-4' />
            </div>
        </CardWrapper>
    );
}

export default ErrorCard;
