import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CVData } from "@/lib/cv";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1B2A4A",
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  summary: {
    fontSize: 10,
    marginBottom: 16,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#14B8A6",
    paddingBottom: 2,
  },
  expBlock: {
    marginBottom: 8,
  },
  role: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  company: {
    fontSize: 10,
    marginBottom: 2,
    color: "#555",
  },
  point: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 2,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    fontSize: 9,
    backgroundColor: "#F4F5F7",
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 3,
  },
});

export function CVDocument({ cv }: { cv: CVData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{cv.full_name}</Text>
        <Text style={styles.summary}>{cv.summary}</Text>

        <Text style={styles.sectionTitle}>PENGALAMAN KERJA</Text>
        {cv.experience.map((exp, i) => (
          <View key={i} style={styles.expBlock}>
            <Text style={styles.role}>{exp.role}</Text>
            <Text style={styles.company}>{exp.company}</Text>
            {exp.points.map((point, j) => (
              <Text key={j} style={styles.point}>
                • {point}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>PENDIDIKAN</Text>
        {cv.education.map((edu, i) => (
          <Text key={i} style={styles.listItem}>
            • {edu}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>SKILLS</Text>
        <View style={styles.skillsRow}>
          {cv.skills.map((skill, i) => (
            <Text key={i} style={styles.skillBadge}>
              {skill}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
