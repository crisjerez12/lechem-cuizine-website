import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import type React from "react";

interface ReservationData {
  id: number;
  location: string;
  mobile_number: string;
  name: string;
  notes: string;
  choices: string;
  package: string;
  pax: string;
  reservation_date: string;
  total_price: number;
  created_at: Date;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 15, // Reduced padding for A6
    fontFamily: "Helvetica",
    width: "105mm", // A6 width
    height: "148mm", // A6 height
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#000",
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  image: {
    width: 30, // Reduced size for A6
    height: 30,
  },
  establishmentName: {
    fontSize: 8, // Reduced font size for A6
    fontWeight: "bold",
    marginBottom: 2,
  },
  location: {
    fontSize: 6,
    marginBottom: 1,
  },
  contactInfo: {
    fontSize: 6,
    marginBottom: 1,
  },
  receiptNumber: {
    fontSize: 7,
    marginTop: 1,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    borderBottomStyle: "dashed",
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoContainer: {
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 7,
    width: "40%",
    borderBottomWidth: 0.25,
    borderBottomColor: "#ccc",
    paddingBottom: 1,
  },
  infoValue: {
    fontSize: 7,
    flex: 1,
    borderBottomWidth: 0.25,
    borderBottomColor: "#ccc",
    paddingBottom: 1,
  },
  packageDetails: {
    marginBottom: 6,
  },
  footer: {
    marginTop: 8,
    alignItems: "center",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6,
    textAlign: "center",
    marginBottom: 1,
    fontFamily: "Helvetica",
  },
  officialReceipt: {
    fontSize: 5,
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
    borderTopWidth: 0.5,
    borderTopColor: "#000",
    paddingTop: 2,
  },
});

interface MyDocumentProps {
  reservationData: ReservationData;
}

const MyDocument: React.FC<MyDocumentProps> = ({ reservationData }) => (
  <Document>
    <Page size={[297.64, 419.53]} style={styles.page}>
      {" "}
      {/* A6 dimensions in points */}
      <View style={styles.header}>
        <Image style={styles.image} src="/logo.png" />
        <View style={styles.headerContent}>
          <Text style={styles.establishmentName}>
            LECHEM CUIZINE RESERVATION RECEIPT
          </Text>
          <Text style={styles.location}>
            POBLACION, MAASIM, SARANGANI PROVINCE
          </Text>
          <Text style={styles.contactInfo}>Contact #: +63 909 1730 091</Text>
          <Text style={styles.contactInfo}>
            Email : judelynbolivar5@gmail.com
          </Text>
          <View style={styles.divider} />
          <Text style={styles.receiptNumber}>
            RECEIPT NUMBER: {reservationData.id}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>RESERVATION INFORMATION</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reservation date:</Text>
          <Text style={styles.infoValue}>
            {reservationData.reservation_date}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{reservationData.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoValue}>{reservationData.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mobile Number:</Text>
          <Text style={styles.infoValue}>{reservationData.mobile_number}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Allergies/Notes:</Text>
          <Text style={styles.infoValue}>{reservationData.notes}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Food Choices:</Text>
          <Text style={styles.infoValue}>{reservationData.choices}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.packageDetails}>
        <Text style={styles.sectionTitle}>PACKAGE DETAILS</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Package:</Text>
          <Text style={styles.infoValue}>{reservationData.package}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Number of Guest:</Text>
          <Text style={styles.infoValue}>{reservationData.pax}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Price:</Text>
          <Text style={styles.infoValue}>
            {reservationData.total_price.toLocaleString()} Pesos
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Please Come and Visit</Text>
        <Text style={styles.footerText}>Our Store For Your Payment.</Text>
        <Text style={styles.footerText}>Thank You and Please Reserve</Text>
        <Text style={styles.footerText}>Again</Text>
        <Text style={styles.officialReceipt}>
          This serves as your OFFICIAL RECEIPT
        </Text>
      </View>
    </Page>
  </Document>
);

export const generatePDF = async (
  reservationData: ReservationData
): Promise<void> => {
  console.log(reservationData);
  const blob = await pdf(
    <MyDocument reservationData={reservationData} />
  ).toBlob();
  saveAs(blob, "Lechem-Cuizine-Reservation-Receipt.pdf");
};
