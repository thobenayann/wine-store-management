import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PayedSwitch } from '@/components/ui/payed-switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function Factures() {
    return (
        <Card>
            <CardHeader className='px-7'>
                <CardTitle>Factures</CardTitle>
                <CardDescription>
                    Factures récentes de votre magasin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead className='hidden sm:table-cell'>
                                Type
                            </TableHead>
                            <TableHead className='table-cell'>Statut</TableHead>
                            <TableHead className='hidden md:table-cell'>
                                Date
                            </TableHead>
                            <TableHead className='text-right'>
                                Montant
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Liam Johnson</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    liam@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Vente
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='En cours' />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-23
                            </TableCell>
                            <TableCell className='text-right'>
                                €250.00
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Olivia Smith</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    olivia@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Remboursement
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='Payée' initialIsOn />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-24
                            </TableCell>
                            <TableCell className='text-right'>
                                €150.00
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Noah Williams</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    noah@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Vente
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='Payée' initialIsOn />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-25
                            </TableCell>
                            <TableCell className='text-right'>
                                €350.00
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Emma Brown</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    emma@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Vente
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='En cours' />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-26
                            </TableCell>
                            <TableCell className='text-right'>
                                €450.00
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Liam Johnson</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    liam@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Vente
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='En cours' />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-23
                            </TableCell>
                            <TableCell className='text-right'>
                                €250.00
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Liam Johnson</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    liam@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Vente
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='En cours' />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-23
                            </TableCell>
                            <TableCell className='text-right'>
                                €250.00
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Olivia Smith</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    olivia@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Remboursement
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='Payée' initialIsOn />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-24
                            </TableCell>
                            <TableCell className='text-right'>
                                €150.00
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='font-medium'>Emma Brown</div>
                                <div className='hidden text-sm text-muted-foreground md:inline'>
                                    emma@example.com
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                Vente
                            </TableCell>
                            <TableCell className='table-cell'>
                                <PayedSwitch status='En cours' />
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                                2023-06-26
                            </TableCell>
                            <TableCell className='text-right'>
                                €450.00
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
