import { NextRequest } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export async function GET() {
  const userData = {
    name: 'João Silva',
    email: 'joao@example.com',
    registeredAt: '2025-07-11',
  };

  let styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 12,
      fontFamily: 'Helvetica',
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
    },
    field: {
      marginBottom: 10,
    },
  });

  const MyPDF = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório do Usuário</Text>
        <View>
          <Text style={styles.field}>Nome: {userData.name}</Text>
          <Text style={styles.field}>Email: {userData.email}</Text>
          <Text style={styles.field}>Registrado em: {userData.registeredAt}</Text>
        </View>
      </Page>
    </Document>
  );

  const pdfStream = await renderToStream(MyPDF);

  return new Response(pdfStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="relatorio.pdf"',
    },
  });
}
