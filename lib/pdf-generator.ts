import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'row', backgroundColor: '#E4E4E7' },
  section: { margin: 10, padding: 10, flexGrow: 1 }
});

export const generatePDF = async (data: any) => {
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Suitpax Travel Report</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      </Page>
    </Document>
  );

  return await pdf(<MyDocument />).toBuffer();
};