/* eslint-disable jsx-a11y/alt-text */
import { GetInvoiceByIdResponseType } from '@/app/api/invoices/invoice-detail/route';
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
    footer: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 10,
        color: '#666',
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
    const totalInvoiceAmount = invoice?.lines.reduce(
        (total, line) => total + line.total,
        0
    );

    return (
        <Document>
            <Page style={styles.page}>
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
                        <Text style={styles.tableColHeader}>Prix unitaire</Text>
                        <Text style={styles.tableColHeader}>Remise</Text>
                        <Text style={styles.tableColHeader}>Total ligne</Text>
                    </View>
                    {invoice?.lines.map((line) => (
                        <View style={styles.tableRow} key={line.id}>
                            <Text style={styles.tableCol}>
                                {line.wine.name}
                            </Text>
                            <Text style={styles.tableCol}>{line.quantity}</Text>
                            <Text style={styles.tableCol}>
                                {line.unit_price} €
                            </Text>
                            <Text style={styles.tableCol}>
                                {line.discount || 0} %
                            </Text>
                            <Text style={styles.tableCol}>{line.total} €</Text>
                        </View>
                    ))}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.tableCol,
                                {
                                    flex: 4,
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                },
                            ]}
                        >
                            Total :
                        </Text>
                        <Text style={styles.tableCol}>
                            {totalInvoiceAmount?.toFixed(2)} €
                        </Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text>Merci pour votre achat !</Text>
                    <Text>Contactez-nous pour toute question.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
