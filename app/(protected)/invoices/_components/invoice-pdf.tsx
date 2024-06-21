/* eslint-disable jsx-a11y/alt-text */
import { GetInvoiceByIdResponseType } from '@/app/api/invoices/invoice-detail/route';
import { formatCurrency } from '@/lib/helpers';
import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';
import React from 'react';

// Styles pour le PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        lineHeight: 1.6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
    },
    subheader: {
        fontSize: 14,
    },
    logo: {
        width: 60,
        height: 80,
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#f5f5f5',
        padding: 5,
        fontWeight: 'bold',
    },
    tableCol: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 5,
    },
    rightAligned: {
        textAlign: 'right',
        fontWeight: 'bold',
    },
    fixedWidthCol: {
        width: '100px', // Largeur fixe pour la colonne
        textAlign: 'right',
    },
    footer: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 10,
        color: '#666',
    },
    legalInfo: {
        marginTop: 'auto',
        textAlign: 'center',
        fontSize: 10,
        color: '#333',
    },
});

// Interface Props
interface Props {
    invoice: GetInvoiceByIdResponseType;
}

// Composant PDF
const InvoicePDF: React.FC<Props> = ({ invoice }) => {
    const invoiceDate = invoice?.created_at
        ? new Date(invoice.created_at).toLocaleDateString('fr-FR')
        : '';
    const dueDate = invoice?.due_date
        ? new Date(invoice.due_date).toLocaleDateString('fr-FR')
        : '';

    const totalHT =
        invoice?.lines.reduce(
            (total, line) =>
                total +
                line.unit_price *
                    line.quantity *
                    (1 - (line.discount || 0) / 100),
            0
        ) || 0;

    const vatAmount =
        totalHT * (invoice?.vat_applied ? invoice?.vat_applied / 100 : 0);
    const totalTTC = totalHT + vatAmount;

    return (
        <Document>
            <Page style={styles.page}>
                <View>
                    <View style={styles.header}>
                        <Image
                            style={styles.logo}
                            src='/logos/wine-glass.187x256.png'
                        />
                        <Text>Facture</Text>
                        {invoice ? (
                            <Text style={styles.subheader}>N°{invoice.id}</Text>
                        ) : null}
                    </View>
                    <View style={styles.details}>
                        <View>
                            <Text>De :</Text>
                            {invoice ? (
                                <>
                                    <Text>
                                        {invoice.client.first_name}{' '}
                                        {invoice.client.last_name}
                                    </Text>
                                    <Text>{invoice.client.email}</Text>
                                </>
                            ) : null}
                        </View>
                        <View>
                            <Text>À :</Text>
                            <Text>
                                {invoice?.client.first_name}{' '}
                                {invoice?.client.last_name}
                            </Text>
                            <Text>{invoice?.client.adresse}</Text>
                            <Text>{invoice?.client.email}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text>Date de la facture: {invoiceDate}</Text>
                        <Text>Date d&apos;échéance: {dueDate}</Text>
                        <Text>Statut: {invoice?.status}</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Vin</Text>
                            <Text style={styles.tableColHeader}>Quantité</Text>
                            <Text style={styles.tableColHeader}>
                                Prix unitaire HT
                            </Text>
                            <Text style={styles.tableColHeader}>Remise</Text>
                            <Text style={styles.tableColHeader}>
                                Prix unitaire après remise
                            </Text>
                            <Text
                                style={[
                                    styles.tableColHeader,
                                    styles.fixedWidthCol,
                                ]}
                            >
                                Total ligne HT
                            </Text>
                        </View>
                        {invoice?.lines.map((line) => (
                            <View style={styles.tableRow} key={line.id}>
                                <Text style={styles.tableCol}>
                                    {line.wine.name}
                                </Text>
                                <Text style={styles.tableCol}>
                                    {line.quantity}
                                </Text>
                                <Text style={styles.tableCol}>
                                    {formatCurrency(line.unit_price)}
                                </Text>
                                <Text style={styles.tableCol}>
                                    {line.discount || 0} %
                                </Text>
                                <Text style={styles.tableCol}>
                                    {formatCurrency(
                                        line.unit_price *
                                            (1 - (line.discount || 0) / 100)
                                    )}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCol,
                                        styles.fixedWidthCol,
                                    ]}
                                >
                                    {formatCurrency(
                                        line.unit_price *
                                            line.quantity *
                                            (1 - (line.discount || 0) / 100)
                                    )}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCol,
                                    styles.rightAligned,
                                    { flex: 4 },
                                ]}
                            >
                                Total HT à facturer :
                            </Text>
                            <Text
                                style={[
                                    styles.tableCol,
                                    styles.rightAligned,
                                    styles.fixedWidthCol,
                                ]}
                            >
                                {formatCurrency(totalHT)}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCol,
                                    styles.rightAligned,
                                    { flex: 4 },
                                ]}
                            >
                                TVA ({invoice?.vat_applied}%):
                            </Text>
                            <Text
                                style={[
                                    styles.tableCol,
                                    styles.rightAligned,
                                    styles.fixedWidthCol,
                                ]}
                            >
                                {formatCurrency(vatAmount)}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCol,
                                    styles.rightAligned,
                                    { flex: 4 },
                                ]}
                            >
                                Total TTC :
                            </Text>
                            <Text
                                style={[
                                    styles.tableCol,
                                    styles.rightAligned,
                                    styles.fixedWidthCol,
                                ]}
                            >
                                {formatCurrency(totalTTC)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text>Merci pour votre achat !</Text>
                    <Text>Contactez-nous pour toute question.</Text>
                </View>
                {/* <View style={styles.legalInfo}>
                    <Text>Numéro de TVA INTRA : FRXX 123456789</Text>
                    <Text>Numéro de SIRET : 123 456 789 00000</Text>
                    <Text>
                        Adresse de l&apos;entreprise : 123 Rue de
                        l&apos;Exemple, 75000 Paris, France
                    </Text>
                </View> */}
            </Page>
        </Document>
    );
};

export default InvoicePDF;
