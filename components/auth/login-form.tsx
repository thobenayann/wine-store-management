import CardWrapper from './card-wrapper';

export default function loginForm() {
    return (
        <CardWrapper
            headerLabel='Welcome back'
            backButtonLabel="Don't have an account ?"
            backButtonHref='/auth/register'
            showSocial
        >
            Login form !
        </CardWrapper>
    );
}
