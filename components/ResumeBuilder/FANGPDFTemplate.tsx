"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/resume-types";

// Register fonts for professional look
Font.register({
  family: "Times New Roman",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/sourceserifpro/v15/neIXzD-0qpwxpaWvjeD0X88SAOeaiXM0oSOL2Yf8Ks1lDQ.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/sourceserifpro/v15/neIWzD-0qpwxpaWvjeD0X88SAOeasas8YjeszAJ9CAE.ttf",
      fontWeight: "bold",
    },
  ],
});

const COL = "#000000";
const SECTION_COLOR = "#1a1a1a";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 50,
    paddingRight: 50,
    lineHeight: 1.35,
    color: COL,
    backgroundColor: "#ffffff",
  },
  /* ── Header ── */
  header: {
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    color: "#000",
    marginBottom: 3,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
    fontSize: 9,
    color: "#333",
  },
  contactItem: {
    marginHorizontal: 3,
  },
  divider: {
    color: "#888",
    marginHorizontal: 2,
  },
  /* ── Section ── */
  sectionWrapper: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: SECTION_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 5,
  },
  /* ── Education ── */
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  eduLeft: {
    flex: 1,
  },
  schoolName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  degreeText: {
    fontSize: 9.5,
    color: "#222",
    fontStyle: "italic",
  },
  eduRight: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 9,
    color: "#444",
  },
  locationText: {
    fontSize: 9,
    color: "#555",
  },
  gpaText: {
    fontSize: 9,
    color: "#333",
  },
  /* ── Experience ── */
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expLeft: {
    flex: 1,
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  roleName: {
    fontSize: 9.5,
    fontStyle: "italic",
    color: "#222",
  },
  expRight: {
    alignItems: "flex-end",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 1.5,
    paddingLeft: 4,
  },
  bullet: {
    width: 12,
    fontSize: 9,
    color: "#000",
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#111",
    lineHeight: 1.4,
  },
  expWrapper: {
    marginBottom: 6,
  },
  /* ── Projects ── */
  projHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 1,
    flexWrap: "wrap",
  },
  projName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  projTech: {
    fontSize: 9,
    color: "#444",
    fontStyle: "italic",
    marginLeft: 4,
  },
  projLinks: {
    fontSize: 8.5,
    color: "#2455a4",
    marginLeft: 6,
  },
  projWrapper: {
    marginBottom: 6,
  },
  /* ── Skills ── */
  skillRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  skillLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    width: 80,
  },
  skillValue: {
    flex: 1,
    fontSize: 9.5,
    color: "#111",
  },
  /* ── Summary ── */
  summaryText: {
    fontSize: 9.5,
    color: "#111",
    lineHeight: 1.45,
  },
});

const Divider = () => (
  <Text style={styles.divider}>|</Text>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionWrapper}>
    <Text style={styles.sectionHeader}>{title}</Text>
  </View>
);

const Bullet = ({ text }: { text: string }) => {
  if (!text.trim()) return null;
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
};

interface Props {
  data: ResumeData;
}

const FANGPDFTemplate = ({ data }: Props) => {
  const contactParts = [
    data.phone,
    data.email,
    data.location,
    data.linkedin ? `linkedin.com/in/${data.linkedin.replace(/^.*linkedin\.com\/in\//i, "")}` : "",
    data.github ? `github.com/${data.github.replace(/^.*github\.com\//i, "")}` : "",
  ].filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || "Your Name"}</Text>
          <View style={styles.contactRow}>
            {contactParts.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Divider />}
                <Text style={styles.contactItem}>{item}</Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Summary ── */}
        {data.summary?.trim() && (
          <>
            <SectionHeader title="Summary" />
            <Text style={styles.summaryText}>{data.summary}</Text>
          </>
        )}

        {/* ── Education ── */}
        {data.education?.length > 0 && (
          <>
            <SectionHeader title="Education" />
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 5 }}>
                <View style={styles.eduRow}>
                  <View style={styles.eduLeft}>
                    <Text style={styles.schoolName}>{edu.school}</Text>
                    <Text style={styles.degreeText}>
                      {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                    </Text>
                  </View>
                  <View style={styles.eduRight}>
                    <Text style={styles.dateText}>
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                    </Text>
                    <Text style={styles.locationText}>{edu.location}</Text>
                    {edu.gpa && (
                      <Text style={styles.gpaText}>GPA: {edu.gpa}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* ── Experience ── */}
        {data.experience?.length > 0 && (
          <>
            <SectionHeader title="Experience" />
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.expWrapper}>
                <View style={styles.expHeader}>
                  <View style={styles.expLeft}>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    <Text style={styles.roleName}>{exp.role}</Text>
                  </View>
                  <View style={styles.expRight}>
                    <Text style={styles.dateText}>
                      {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                    </Text>
                    <Text style={styles.locationText}>{exp.location}</Text>
                  </View>
                </View>
                {exp.bullets.map((b, i) => (
                  <Bullet key={i} text={b} />
                ))}
              </View>
            ))}
          </>
        )}

        {/* ── Projects ── */}
        {data.projects?.length > 0 && (
          <>
            <SectionHeader title="Projects" />
            {data.projects.map((proj) => (
              <View key={proj.id} style={styles.projWrapper}>
                <View style={styles.projHeader}>
                  <Text style={styles.projName}>{proj.name}</Text>
                  {proj.techStack && (
                    <Text style={styles.projTech}>| {proj.techStack}</Text>
                  )}
                  {proj.githubUrl && (
                    <Text style={styles.projLinks}>
                      [GitHub{proj.liveUrl ? " | Live" : ""}]
                    </Text>
                  )}
                </View>
                {proj.bullets.map((b, i) => (
                  <Bullet key={i} text={b} />
                ))}
              </View>
            ))}
          </>
        )}

        {/* ── Skills ── */}
        {(data.skills?.languages ||
          data.skills?.frameworks ||
          data.skills?.tools ||
          data.skills?.databases) && (
          <>
            <SectionHeader title="Technical Skills" />
            {data.skills.languages && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Languages:</Text>
                <Text style={styles.skillValue}>{data.skills.languages}</Text>
              </View>
            )}
            {data.skills.frameworks && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Frameworks:</Text>
                <Text style={styles.skillValue}>{data.skills.frameworks}</Text>
              </View>
            )}
            {data.skills.tools && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Tools:</Text>
                <Text style={styles.skillValue}>{data.skills.tools}</Text>
              </View>
            )}
            {data.skills.databases && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Databases:</Text>
                <Text style={styles.skillValue}>{data.skills.databases}</Text>
              </View>
            )}
          </>
        )}
      </Page>
    </Document>
  );
};

export default FANGPDFTemplate;
