import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsAndConditions = () => {
    return (
        <div className='md:container py-1 md:py-8'>
            <Card className='mx-auto p-2 md:p-6'>
                <CardHeader>
                    <CardTitle>
                        Conditions Générales d&apos;Utilisation
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <section>
                        <h2 className='text-xl font-bold'>1. Introduction</h2>
                        <p>
                            Bienvenue sur mon application de gestion de stock de
                            vin. En utilisant ce service, vous acceptez les
                            présentes conditions générales d&apos;utilisation.
                            Veuillez les lire attentivement.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>
                            2. Informations Légales
                        </h2>
                        <p>
                            Conformément aux dispositions de l&apos;article 6 de
                            la loi n° 2004-575 du 21 juin 2004 pour la confiance
                            dans l&apos;économie numérique, je vous informe de
                            mon identité :
                        </p>
                        <ul className='list-disc ml-6'>
                            <li>
                                <strong>Nom :</strong> THOBENA Yann
                            </li>
                            <li>
                                <strong>Adresse :</strong> 31470 Saint-Lys
                            </li>
                            <li>
                                <strong>Téléphone :</strong> +33 6 38 91 56 89
                            </li>
                            <li>
                                <strong>Email :</strong> thobena.yann@gmail.com
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>
                            3. Collecte des Données Personnelles
                        </h2>
                        <p>
                            Je collecte et traite des données personnelles
                            conformément aux réglementations en vigueur,
                            notamment le Règlement Général sur la Protection des
                            Données (RGPD) et la loi Informatique et Libertés.
                            Les données collectées incluent :
                        </p>
                        <ul className='list-disc ml-6'>
                            <li>Nom, prénom</li>
                            <li>Adresse email</li>
                            <li>Numéro de téléphone</li>
                            <li>Adresse postale</li>
                            <li>Nom de société</li>
                        </ul>
                        <p>
                            La collecte de ces données est nécessaire pour la
                            gestion de vos commandes et pour vous offrir un
                            service personnalisé.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>
                            4. Utilisation des Données Personnelles
                        </h2>
                        <p>
                            Les données personnelles collectées sont utilisées
                            pour :
                        </p>
                        <ul className='list-disc ml-6'>
                            <li>Gérer et traiter vos commandes</li>
                            <li>
                                Communiquer avec vous concernant vos commandes
                                et mon service
                            </li>
                            <li>
                                Améliorer le service et personnaliser votre
                                expérience
                            </li>
                            <li>
                                Respecter les obligations légales et
                                réglementaires
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>
                            5. Partage des Données Personnelles
                        </h2>
                        <p>
                            Cette application n&apos;a pas été conçue dans le
                            but de partager vos données personnelles. Si cela
                            devenait le cas, je m&apos;engage à vous en informer
                            et à obtenir votre consentement explicite.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>
                            6. Sécurité des Données
                        </h2>
                        <p>
                            Je mets en œuvre toutes les mesures techniques et
                            organisationnelles nécessaires pour protéger vos
                            données personnelles contre tout accès, modification
                            ou divulgation non autorisés.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>7. Vos Droits</h2>
                        <p>
                            Conformément à la réglementation en vigueur, vous
                            disposez des droits suivants :
                        </p>
                        <ul className='list-disc ml-6'>
                            <li>Droit d&apos;accès à vos données</li>
                            <li>Droit de rectification</li>
                            <li>Droit à l&apos;effacement</li>
                            <li>Droit à la limitation du traitement</li>
                            <li>Droit à la portabilité</li>
                            <li>Droit d&apos;opposition</li>
                        </ul>
                        <p>
                            Pour exercer ces droits, vous pouvez me contacter à
                            l&apos;adresse email suivante :{' '}
                            <strong>thobena.yann@gmail.com</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>
                            8. Modification des Conditions
                        </h2>
                        <p>
                            Je me réserve le droit de modifier les présentes
                            conditions générales d&apos;utilisation à tout
                            moment. Toute modification prendra effet
                            immédiatement après publication sur cette page.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl font-bold'>9. Contact</h2>
                        <p>
                            Pour toute question ou demande d&apos;information
                            concernant ces conditions générales
                            d&apos;utilisation, vous pouvez me contacter à
                            l&apos;adresse suivante :{' '}
                            <strong>thobena.yann@gmail.com</strong>
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
};

export default TermsAndConditions;
