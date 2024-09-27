import ReactPDF, { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  src: "https://raw.githubusercontent.com/onivim/oni2/master/assets/fonts/Inter-UI-Regular.ttf",
  fontWeight: 'normal',
});

function capitalizeString(str: string) {
    return str?.charAt(0)?.toUpperCase() + str.slice(1)?.toLowerCase();
  }
  
const styles = StyleSheet.create({
  // Typography
  textHeadLine1: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 16,
    paddingLeft: 10,
  },
  textHeadLine2: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 20,
  },
  textHeadLine3: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 18,
  },
  textSubHeading1: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 16,
  },
  textSubHeading2: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
  },
  textSubHeading3: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
  },
  textBody1: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
  },
  textBody2: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 12,
  },
  textBody3: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 11,
  },
  textSecondary: {
    color: '#55505A',
  },
  textLight: {
    color: '#fff',
  },
  textLink: {
    color: '#167FCC',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  // page style
  page: {
    position: 'relative',
    padding: '18px 24px 75px',
  },
  watermarkRotatedContainer: {
    position: 'absolute',
    top: '50%',
    left: '15%',
    transform: 'translate(-50%, -50%) rotate(-40.17deg)',
    opacity: 0.5,

    // opacity: 0.5;
    // transform: rotate(-40.17deg);
  },
  watermarkContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    opacity: 0.5,
  },
  watermarkText: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 88,
    color: '#C8CBCE',
  },
  watermarkImage: {
    width: 334,
    height: 324,
    objectFit: 'contain',
  },
  // header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 24px',
    height: 45,
    border: '1px solid #DCD9DD',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  candidateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: '56px',
    height: '31px',
    objectFit: 'contain',
    alignSelf: 'flex-start',
  },
  profileImageSmall: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    objectFit: 'cover',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  profileImageLarge: {
    width: '54px',
    height: '54px',
    objectFit: 'cover',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  candidateDetails: {
    flexDirection: 'column',
  },
  //   footer
  footer: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    left: 0,
    width: '100vw',
    flexDirection: 'column',
  },
  pageContainer: {
    backgroundColor: '#F3F8FC',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '8px 14px',
  },
  captionContainer: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '8px 14px',
  },
  captionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  supportSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  captionImage: {
    width: '19px',
    height: '9px',
    objectFit: 'contain',
  },
  //   main section
  mainSectionContainer: {
    top: 35,
    flexDirection: 'column',
    gap: 10,
    paddingBottom: 10,
  },
  disclaimerContent: {
    fontSize: '11px',
  },
  disclaimerColumnContainer: {
    fontSize: '13px',
    marginBottom: '10px',
  },
  stackColumnContainer: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  iconTextContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  iconImageSmall: {
    width: '12px',
    height: '12px',
    objectFit: 'contain',
  },
  iconImageMedium: {
    width: '16px',
    height: '16px',
    objectFit: 'contain',
  },
  checkLegendContainer: {
    position: 'relative',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    padding: 16,
  },

  // Instruction container
  instructionContainer: {
    flexDirection: 'column',
    gap: 8,
    borderTop: '1px solid #DCD9DD',
    borderRight: '1px solid #DCD9DD',
    borderBottom: '1px solid #DCD9DD',
    padding: 15,
    borderRadius: 8,
    borderBottomLeftRadius: 27,
    borderTopLeftRadius: 27,
  },

  //   User details box
  //   "linear-gradient(71.33deg, #9E34F1 23.82%, #4F35F2 135.01%)",
  // transform: "matrix(-1, 0, 0, 1, 0, 0)",
  userDetailsContainer: {
    borderRadius: 8,
    width: '100%',
    height: '182px',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '88%',
    gap: 4,
  },
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  contactDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderSection: {
    flexDirection: 'row',
    gap: 32,
  },
  orderColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 4,
  },

  // Checks Menu List Styles
  reportMenuList: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    border: '1px solid #DCD9DD',
    borderRadius: 8,
    padding: 15,
    // position: 'relative',
  },
  checkLogoContainer: {
    width: '9%',
  },
  checkLogoImage: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  checkInfoSection: {
    gap: 8,
  },
  checkInfoSubheading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  checkMenuDetailsContainer: {
    width: '63%',
    gap: 8,
  },
  checkDetailsContainer: {
    width: '91%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  // Check Summary Container
  leftBorderedContainer: {
    borderTop: '1px solid #DCD9DD',
    borderBottom: '1px solid #DCD9DD',
    borderRight: '1px solid #DCD9DD',
    borderLeft: '4px solid #167FCC',
    borderRadius: 4,
    width: '100%',
  },
  checkInfoContainer: {
    height: 91,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8FC',
    borderRadius: 4,
    padding: 16,
  },
  summaryIconImage: {
    width: 34,
    height: 26,
    objectFit: 'contain',
  },
  checkCommentContainer: {
    flexDirection: 'column',
    gap: 8,
    width: '100%',
    padding: '0 14px 14px',
    marginLeft: '9%',
  },

  // Table Style
  table: {
    flexDirection: 'column',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #DCD9DD',
    borderLeft: '4px solid #167FCC',
  },
  tableHeader: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F3F8FC',
    borderRight: '1px solid #DCD9DD',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    borderRight: '1px solid #DCD9DD',
  },
  comment: {
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 5,
    backgroundColor: '#f8f8f8',
    padding: 3,
  },

  // verification meta container
  verificationMetaContainer: {
    flexDirection: 'column',
    gap: 0,
    borderBottom: '1px solid #DCD9DD',
    padding: '16px 0px 24px 0px',
  },
  // verification documents section
  documentHeaderContainer: {
    backgroundColor: '#F3F8FC',
    padding: 16,
    gap: 6,
    width: '100%',
  },
  // Report Status Styles
  pillImage: {
    width: 130,
    height: 28,
    objectFit: 'contain',
  },
  clear: {
    color: '#048218',
  },
  discrepant: {
    color: '#D94415',
  },
  insufficient: {
    color: '#EE6E12',
  },
  noResponse: {
    color: '#55505A',
  },
  clearBg: {
    color: '#048218',
  },
  discrepantBg: {
    color: '#D94415',
  },
  insufficientBg: {
    color: '#EE6E12',
  },
  noResponseBg: {
    color: '#55505A',
  },
});

const baseUrl = 'https://bgv-report-image.s3.ap-south-1.amazonaws.com/bgv-sample-data';
const staticImageUrl = 'https://bgv-report-image.s3.ap-south-1.amazonaws.com/bgv_static_images';

const verifyInWhite = staticImageUrl.concat('/Verifyin_White.png');
const verifyInDark = staticImageUrl.concat('/Verifyin_Dark.png');
const giginLogo = staticImageUrl.concat('/gigin_logo.png');
const addressIcon = baseUrl.concat('/address_icon.png');
const emailIcon = baseUrl.concat('/email_icon.png');
const phoneIcon = baseUrl.concat('/phone_icon.png');
const userDetailGradient = baseUrl.concat('/userdetails_bg-gradient.png');
const checkCompletedWatermark = baseUrl.concat('/check_completed_watermark.png');
const coverPageBg = baseUrl.concat('/coverpage_bg.png');
const reportCoverTitle = baseUrl.concat('/report_cover_title.png');
const checkInProgress = baseUrl.concat('/hourglass_check_progress.png');
const noDocumentsUploaded = baseUrl.concat('/no_documents_uploaded.png');
const clearIcon = baseUrl.concat('/clear_icon.png');
const discrepantIcon = baseUrl.concat('/discrepant_icon.png');
const insufficientIcon = baseUrl.concat('/insufficient_icon.png');
const noResponseIcon = baseUrl.concat('/noresponse_icon.png');
const clearLogo = baseUrl.concat('/clear.png');
const discrepantLogo = baseUrl.concat('/discrepant.png');
const insufficientLogo = staticImageUrl.concat('/insufficient.png');
const noResponseLogo = baseUrl.concat('/noresponse.png');
const unableToVerifyLogo = baseUrl.concat('/unableToVerifyLogo.png');
const inProgressLogo = baseUrl.concat('/in_progress.png');
const qcPendingLogo = baseUrl.concat('/qc_pending.png');

export interface CheckMenuListProps {
  menu: any;
}

const CheckMenuList = (props: CheckMenuListProps) => {
  const { menu } = props;
  return (
    <View style={styles.reportMenuList} wrap={false}>
      <View style={styles.checkLogoContainer}>
        <Image src={menu.icon} style={styles.checkLogoImage} />
      </View>
      <View style={styles.checkMenuDetailsContainer}>
        {/* <View style={styles.checkInfoSection}> */}
        <Text style={styles.textSubHeading1}>{menu.title}</Text>
        <View style={styles.checkInfoSubheading}>
          {/* TODO: Replace with API data later */}
          {menu.documentlist.map((data: any) => (
            <View
              style={[styles.iconTextContainer, { flexWrap: 'nowrap', flexBasis: 'auto', flexShrink: 1 }]}
              key={data.check_number}>
              {reportStatusIconMapper(data.check_status.status) && (
                <Image src={reportStatusIconMapper(data.check_status.status)} style={styles.iconImageSmall} />
              )}
              <Text style={styles.textBody2}>
                {/* {capitalizeString(data.product_listing_name)} */}
                {data.product_listing_name}
              </Text>
            </View>
          ))}
        </View>
        {/* </View> */}
      </View>
      <Image
        src={reportStatusMapper(menu.product_type_status.status)}
        style={[
          styles.pillImage,
          {
            position: 'absolute',
            top: '50%',
            right: 12,
            zIndex: 10,
          },
        ]}
      />
    </View>
  );
};

interface IndividualCheckDocumentsProps {
  checkData: any;
  subCheckData: any;
}

interface DocumentContainerHOCProps {
  check_id: string;
  title: string;
  imageUrl: string;
  documentsUploaded: boolean;
  firstDocumentId: string;
}

const DocumentContainerHOC = (props: DocumentContainerHOCProps) => {
  const { check_id, title, imageUrl, documentsUploaded, firstDocumentId } = props;

  return (
    <View style={[styles.leftBorderedContainer, styles.stackColumnContainer]} wrap={false} id={firstDocumentId}>
      {/* Header */}
      <View style={[styles.documentHeaderContainer]} fixed>
        <Text style={styles.textSubHeading1}>{title} - Supporting document</Text>
        <Text style={[styles.textSubHeading3, styles.textSecondary]}>Check ID: {check_id}</Text>
      </View>
      {/* Documents media section */}
      <View
        style={[
          styles.checkCommentContainer,
          {
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            padding: 16,
          },
        ]}>
        <Image
          src={imageUrl}
          style={{
            maxWidth: 480,
            maxHeight: 320,
            objectFit: 'contain',
            padding: '16px 32px 32px',
          }}
        />
        {!documentsUploaded && <Text style={[styles.textSubHeading1]}>No documents uploaded</Text>}
      </View>
    </View>
  );
};

export const IndividualCheckDocuments = (props: IndividualCheckDocumentsProps) => {
  const { checkData, subCheckData } = props;

  return (
    <View>
      {/* // If no documents then show illustration of no document */}
      {/* TODO NEED TO REVIEW THIS SECTION */}
      {/* {subCheckData.documents_provided.length === 0 && (
        <DocumentContainerHOC
          check_id={subCheckData.check_number}
          title={checkData.title}
          imageUrl={noDocumentsUploaded}
          documentsUploaded={false}
          firstDocumentId={subCheckData.first_document_id}
        />
      )} */}
      {/* // If documents then map the list and show documents */}
      {subCheckData.documents_provided.length > 0 &&
        subCheckData.documents_provided.map((row: any) => (
          <DocumentContainerHOC
            check_id={subCheckData.check_number}
            title={checkData.title}
            imageUrl={row.file_url}
            documentsUploaded={true}
            firstDocumentId={subCheckData.first_document_id}
          />
        ))}
    </View>
  );
};

export interface IndividualCheckMetaProps {
  subCheckData: any;
}

export const IndividualCheckMeta = (props: IndividualCheckMetaProps) => {
  const { subCheckData } = props;
  return (
    <View style={styles.verificationMetaContainer} wrap={false}>
      {subCheckData.documents_provided.length > 0 && (
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.stackColumnContainer, { flex: 1, gap: 8 }]}>
            <Text style={[styles.textBody2, styles.textSecondary]}>Supporting document(s)</Text>
            <Link src={`#${subCheckData.first_document_id}`} style={[styles.textLink, styles.textBody2]}>
              View document(s)
            </Link>
          </View>

          <View style={[styles.stackColumnContainer, { flex: 1, gap: 6 }]}>
            <Text style={[styles.textBody2, styles.textSecondary]}>Requested on</Text>
            <Text style={[styles.textBody1]}>
              {dayjs(subCheckData.meta.timeline.initiated_on).format('DD-MM-YYYY')}
            </Text>
          </View>
          <View style={[styles.stackColumnContainer, { flex: 1, gap: 6 }]}>
            <Text style={[styles.textBody2, styles.textSecondary]}>Completed on</Text>
            <Text style={[styles.textBody1]}>
              {subCheckData.meta.timeline.completed_on
                ? dayjs(subCheckData.meta.timeline.completed_on).format('DD-MM-YYYY')
                : 'N/A'}
            </Text>
          </View>
        </View>
      )}
      {subCheckData.documents_provided.length === 0 && (
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.stackColumnContainer, { flex: 1, gap: 6 }]}>
            <Text style={[styles.textBody2, styles.textSecondary]}>Requested on</Text>
            <Text style={[styles.textBody1]}>
              {dayjs(subCheckData.meta.timeline.initiated_on).format('DD-MM-YYYY')}
            </Text>
          </View>
          <View style={[styles.stackColumnContainer, { flex: 2, gap: 6 }]}>
            <Text style={[styles.textBody2, styles.textSecondary]}>Completed on</Text>
            <Text style={[styles.textBody1]}>
              {subCheckData.meta.timeline.completed_on
                ? dayjs(subCheckData.meta.timeline.completed_on).format('DD-MM-YYYY')
                : 'N/A'}
            </Text>
          </View>
        </View>
      )}
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.stackColumnContainer, { flex: 1, gap: 6 }]}>
          <Text style={[styles.textBody2, styles.textSecondary]}>Source</Text>
          <Text style={[styles.textBody1]}>
            {subCheckData.meta.verification_source ? capitalizeString(subCheckData.meta.verification_source) : 'N/A'}
          </Text>
        </View>
        <View style={[styles.stackColumnContainer, { flex: 2, gap: 6 }]}>
          <Text style={[styles.textBody2, styles.textSecondary]}>Verified by</Text>
          <Text style={[styles.textBody1]}>
            {subCheckData.meta.verified_by ? subCheckData.meta.verified_by : 'N/A'}
          </Text>
        </View>
      </View>
      {/* individual check additional comments - fixed section */}
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.stackColumnContainer, { gap: 6, marginTop: 8 }]}>
          <Text style={[styles.textBody2, styles.textSecondary]}>Additional Comments</Text>
          <Text style={styles.textBody1}>
            {subCheckData.meta.additional_comments ? subCheckData.meta.additional_comments : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export interface IndividualCheckSummaryProps {
  checkData: any;
  subCheckData: any;
}

export const IndividualCheckSummary = (props: IndividualCheckSummaryProps) => {
  const { checkData, subCheckData } = props;

  // function to apply subtitle style based on status
  const handleSubtitleStyle = (status: string) => {
    switch (status) {
      case 'CLEAR':
        return [styles.textBody1, styles.clear];
      case 'DISCREPANT':
        return [styles.textBody1, styles.discrepant];
      case 'INSUFFICIENT':
        return [styles.textBody1, styles.insufficient];
      case 'NO_RESPONSE':
        return [styles.textBody1, styles.noResponse];
      case 'UNABLE_TO_VERIFY':
        return [styles.textBody1, styles.noResponse];
      default:
        return styles.textBody1;
    }
  };

  return (
    <View
      style={styles.leftBorderedContainer}
      wrap={false}
      id={subCheckData.check_number === checkData.first_subcheck_id ? subCheckData.check_number : null}>
      <View style={styles.stackColumnContainer}>
        {/* Check detail and check status section */}
        <View style={styles.checkInfoContainer}>
          <View style={styles.checkLogoContainer}>
            <Image src={subCheckData.meta.icon} style={styles.summaryIconImage} />
          </View>
          <View style={styles.checkDetailsContainer}>
            <View style={[styles.stackColumnContainer, { gap: 4 }]}>
              <Text style={[styles.textSubHeading3, styles.textSecondary]}>Check ID: {subCheckData.check_number}</Text>
              <Text style={styles.textHeadLine2}>{subCheckData.meta.title}</Text>
              <Text style={styles.textBody3}>{capitalizeString(subCheckData.meta.subtitle)}</Text>
            </View>
            <Image src={reportStatusMapper(subCheckData.check_status.status)} style={[styles.pillImage]} />
          </View>
        </View>
        {/* If check in progress or details are not present then show in progress illustration */}
        {subCheckData.check_status.status === 'INPROGRESS' &&
          (subCheckData.details.length === 0 ? (
            <View style={[styles.checkCommentContainer, { alignItems: 'center', justifyContent: 'center', margin: 0 }]}>
              <Image
                src={checkInProgress}
                style={{
                  maxWidth: 480,
                  maxHeight: 300,
                  objectFit: 'contain',
                  padding: 32,
                }}
              />
              {subCheckData.check_status.status === 'UNABLE_TO_VERIFY' ? (
                <Text style={styles.textSubHeading1}>Unable to Verify</Text>
              ) : (
                <Text style={styles.textSubHeading1}>This check is still in progress</Text>
              )}
            </View>
          ) : (
            <Text style={styles.textHeadLine1}>This check is still in progress</Text>
          ))}
        {/* Check Comments section */}
        {subCheckData.meta.messages && (
          <View style={styles.checkCommentContainer}>
            <Text style={[styles.textBody1]}>{subCheckData.meta.messages.title}</Text>
            {subCheckData.meta.messages.subtitle && (
              <Text style={handleSubtitleStyle(subCheckData.check_status.status)}>
                {subCheckData.meta.messages.subtitle}
              </Text>
            )}
            {subCheckData?.meta?.messages?.additional_point?.map((data: any) => (
              <View style={[styles.iconTextContainer, { marginLeft: 4 }]} key={data}>
                <Image src={reportStatusIconMapper(data.type)} style={styles.iconImageSmall} />
                <Text style={[styles.textBody2]}>{data.message}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export interface IndividualCheckTableProps {
  subCheckData: any;
}

export const IndividualCheckTable = (props: IndividualCheckTableProps) => {
  const { subCheckData } = props;

  // function to apply subtitle style based on status
  const handleSubtitleStyle = (status: string) => {
    switch (status) {
      case 'CLEAR':
        return [styles.textBody2, styles.clear];
      case 'DISCREPANT':
        return [styles.textBody2, styles.discrepant];
      case 'INSUFFICIENT':
        return [styles.textBody2, styles.insufficient];
      case 'NO_RESPONSE':
        return [styles.textBody2, styles.noResponse];
      case 'UNABLE_TO_VERIFY':
        return [styles.textBody2, styles.noResponse];
      default:
        return styles.textBody2;
    }
  };

  const shouldShowTable = subCheckData.details.some((item: { fieldVisibility: any }) => item.fieldVisibility);

  // If none of the items have fieldVisibility set to true, return null
  if (!shouldShowTable) return null;

  return (
    <View style={[styles.table]}>
      {/* Header Row */}
      <View style={[styles.tableRow, { borderTopLeftRadius: 4, borderTop: '1px solid #DCD9DD' }]} fixed>
        <Text style={[styles.tableHeader, styles.textSubHeading3]}>Parameters</Text>
        <Text style={[styles.tableHeader, styles.textSubHeading3, { flex: 2 }]}>Candidate Details</Text>
        <Text style={[styles.tableHeader, styles.textSubHeading3]}>Verification Result</Text>
      </View>

      {/* Data Rows */}
      {subCheckData.details.map(
        (row: any, id: number) =>
          // Check if the field should be visible
          row.fieldVisibility && (
            <View style={[styles.tableRow]} key={id} wrap={false}>
              {/* First Column */}
              <Text
                style={
                  id % 2 === 0
                    ? [styles.tableCell, styles.textSubHeading3, { backgroundColor: '#F1F1F1' }]
                    : [styles.tableCell, styles.textSubHeading3]
                }>
                {row.parameters}
              </Text>
              {/* Second Column */}
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text style={[styles.textBody1]}>{row.detail.value}</Text>
                {row?.detail?.message.map(
                  (tableRowData: any) =>
                    tableRowData.comment &&
                    tableRowData.comment.trim().length > 0 && ( // Check if data.comment has content
                      <View style={[styles.iconTextContainer, { marginTop: 14 }]}>
                        <Image src={reportStatusIconMapper(tableRowData.icon)} style={styles.iconImageSmall} />

                        <Text style={[styles.textBody3]}>{tableRowData.comment}</Text>
                      </View>
                    ),
                )}
              </View>
              {/* Third Column */}
              <View style={[styles.tableCell, styles.iconTextContainer, { alignItems: 'flex-start' }]}>
                <Image src={reportStatusIconMapper(row.detail.field_status)} style={styles.iconImageSmall} />

                <Text style={handleSubtitleStyle(row.detail.field_status)}>
                  {row.detail.field_status === 'INSUFFICIENT'
                    ? 'ATTENTION \n REQUIRED'
                    : row.detail.field_status.replace(/_/g, ' ')}
                </Text>
              </View>
            </View>
          ),
      )}
    </View>
  );
};

export const reportStatusMapper = (reportStatus: string) => {
  const statusMap: Record<string, any> = {
    CLEAR: clearLogo,
    DISCREPANT: discrepantLogo,
    INSUFFICIENT: insufficientLogo,
    NO_RESPONSE: noResponseLogo,
    INPROGRESS: inProgressLogo,
    QC_PENDING: qcPendingLogo,
    UNABLE_TO_VERIFY: unableToVerifyLogo,
  };

  return statusMap[reportStatus] || null;
};

export const reportStatusIconMapper = (reportStatus: string) => {
  const statusMap: Record<string, any> = {
    CLEAR: clearIcon,
    DISCREPANT: discrepantIcon,
    INSUFFICIENT: insufficientIcon,
    NO_RESPONSE: noResponseIcon,
    INPROGRESS: noResponseIcon,
    UNABLE_TO_VERIFY: noResponseIcon,
  };

  return statusMap[reportStatus] || null;
};

export interface UserDetailContainerProps {
  reportDataObject: any;
}

export const UserDetailContainer = (props: UserDetailContainerProps) => {
  const { reportDataObject } = props;

  return (
    <View style={styles.userDetailsContainer}>
      <Image
        src={userDetailGradient}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: '-1',
        }}
      />
      <View style={{ flexDirection: 'column', gap: 18, padding: '30px 25px' }}>
        {/* profile and address section */}
        <View style={styles.profileSection}>
          <View style={{ width: '12%' }}>
            <Image src={reportDataObject.basic_detail.profile_image} style={styles.profileImageLarge} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameSection}>
              <View style={{ gap: 4 }}>
                <Text style={[styles.textHeadLine3, styles.textLight]}>{reportDataObject.basic_detail.name}</Text>
                <View style={styles.contactDetails}>
                  <View style={styles.iconTextContainer}>
                    <Image src={phoneIcon} style={styles.iconImageSmall} />
                    <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.basic_detail.mobile}</Text>
                  </View>
                  <View style={styles.iconTextContainer}>
                    <Image src={emailIcon} style={styles.iconImageSmall} />
                    <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.basic_detail.email}</Text>
                  </View>
                </View>
              </View>
              <Image src={reportStatusMapper(reportDataObject.overall_status.status)} style={[styles.pillImage]} />
            </View>
            {reportDataObject.basic_detail.address !== '-' && (
              <View style={[styles.iconTextContainer, { marginTop: 6 }]}>
                <Image src={addressIcon} style={styles.iconImageSmall} />
                <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.basic_detail.address}</Text>
              </View>
            )}
          </View>
        </View>
        {/* order detail section */}
        <View style={styles.orderSection}>
          <View style={styles.orderColumn}>
            <Text style={[styles.textBody2, styles.textLight]}>Initiated on</Text>
            <Text style={[styles.textSubHeading2, styles.textLight]}>
              {dayjs(reportDataObject.request.initiated_on).format('DD-MM-YYYY')}
            </Text>
          </View>
          <View style={styles.orderColumn}>
            <Text style={[styles.textBody2, styles.textLight]}>Initiated by</Text>
            <View style={styles.iconTextContainer}>
              <Image src={reportDataObject.request.initiated_by.profile_image} style={styles.profileImageSmall} />
              <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.request.initiated_by.name}</Text>
            </View>
          </View>
          <View style={styles.orderColumn}>
            <Text style={[styles.textBody2, styles.textLight]}>Verified by</Text>
            <View style={styles.iconTextContainer}>
              <Image src={reportDataObject.request.verified_by.profile_image} style={styles.profileImageSmall} />
              <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.request.verified_by.name}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

type TemplateData = {
  firstName: string;
  lastName: string;
  description: string;
  sections: string[];
  company: string;
  address: string;
  cost: string;
  date: string;
  receiptNumber: string;
  datePaid: string;
  paymentMethod: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  amount: string;
};

interface PDFProps {
  data: TemplateData;
}
interface CustomListItemProps {
  children: React.ReactNode; // Using ReactPDF.Style for style prop
}
export interface DisclaimerPageProps {
  reportDataObject: object;
}
const CustomListItem: React.FC<CustomListItemProps> = ({ children }) => (
  <View style={{ flexDirection: 'row', marginBottom: 3 }}>
    <Text style={{ marginRight: 8, marginTop: '0px' }}>•</Text>
    <Text style={styles.disclaimerContent}>{children}</Text>
  </View>
);
export const DisclaimerPage = (props: DisclaimerPageProps) => {
  const { reportDataObject } = props;
  const [hasError, setHasError] = useState(false);

  // Example useEffect to handle data fetching or processing
  useEffect(() => {
    try {
      // Your data fetching or processing logic here
    } catch (error) {
      console.error('Error occurred in DisclaimerPage: ', error);
      setHasError(true);
    }
  }, []); // Dependencies array can be adjusted as needed

  if (hasError) {
    return (
      <Page size="A4" wrap style={styles.page}>
        <Text>An error occurred while generating the report. Please try again later.</Text>
      </Page>
    );
  }

  return (
    <Page size="A4" wrap style={styles.page}>
      <ReportHeader reportDataObject={reportDataObject} />
      {/* Main Content Section */}
      <View style={styles.mainSectionContainer}>
        {/* Terms and Conditions Title */}
        <Text style={{ ...styles.textHeadLine2, marginTop: 4 }}>Terms and Conditions:</Text>

        {/* Custom List */}
        <View>
          <Text style={styles.disclaimerColumnContainer}>
            This background verification report ("Report") is submitted pursuant to the agreement dated ("Agreement")
            executed by and between us and the Client, and shall be subject to the following terms and conditions
            ("T&Cs"):
          </Text>
          <CustomListItem>
            This Report contains personal and sensitive information which has been provided in strict confidence solely,
            pursuant to the Agreement and for the purpose of verification of the statements made by the Candidates for
            employment and/or other permitted purposes. The Client shall therefore use the information provided in the
            Report strictly for the permitted purpose and in compliance with the applicable information technology, data
            protection and other laws.
          </CustomListItem>
          <CustomListItem>
            The records / information provided in the Report are provided on an 'as is' basis, i.e., as they were found
            at the source as on the date and time of verification, whether on a computer information system, retrieved
            by manual search, telephonic interviews or field work. The records / information contained in the Report are
            simply compiled in a structured way for Client's review, from various databases including public records
            that are available and as updated at defined, undefined or infrequent intervals, and therefore, may or may
            not have the most current information...
          </CustomListItem>
          <CustomListItem>
            Where criminal record check is conducted either through online databases or through police records or
            through law firms, there is a possibility of not finding criminal records in the name of the Candidate;
            where address verification (for current/ previous/ permanent) is either not initiated for any reason
            including but not limited to non-disclosure of an address by the Candidate or is discrepant as in such case
            the Candidate may never have resided/situated at the address.
          </CustomListItem>
          <CustomListItem>
            The information provided in the Report shall not be construed to constitute a legal opinion or a definitive
            pronouncement on the subject or a recommendation. The Client shall be fully and solely responsible for the
            final verification and for applying its independent judgment, with respect to the findings provided in the
            Report, to make appropriate decisions in relation to the future course of action, if any. We shall not be
            responsible for any decision or any other consequences resulting from such decisions taken by the Client
            based on information included in the Report.
          </CustomListItem>
          <CustomListItem>
            We do not warrant or provide guarantee of the information's accuracy or completeness. We disclaim any and
            all responsibilities and liabilities which Client may incur due to any reliance or use of the information
            provided through this Report, in contrary to the purpose agreed in the Agreement or otherwise. This Report
            cannot be reproduced in part or full without our prior written approval. Further, under no circumstances
            shall we will be liable for any loss or damage of whatsoever nature, arising from the information being
            withheld or concealed or misrepresented by any person/agency to which information requests were made by us.
            We also do not undertake any responsibility for events or circumstances occurring after the date of
            completion of the research, verification and enquiries.
          </CustomListItem>
          <CustomListItem>
            The Report has been prepared basis the facts reported to us. We reserve the right to amend the Report where
            additional information or documentation is made available impacting the facts in the Report post publishing
            the Report.
          </CustomListItem>
          <CustomListItem>
            Except where required by law, no information provided in the Report shall be revealed, directly or
            indirectly, to any unauthorized third party. Further, the Client shall secure storing of the Report and its
            destruction once it has been used for the purpose for which it was intended, as per the applicable law.
          </CustomListItem>

          {/* More CustomListItem components as needed */}
        </View>
      </View>
      {/* Footer Section (if any) */}
    </Page>
  );
};
export const CheckColorLegend = () => {
  return (
    <View style={styles.checkLegendContainer} fixed>
      <View style={styles.iconTextContainer}>
        <Image src={reportStatusIconMapper('CLEAR')} style={styles.iconImageSmall} />
        <Text style={[styles.textBody2, styles.clear]}>Clear</Text>
      </View>
      <View style={styles.iconTextContainer}>
        <Image src={reportStatusIconMapper('DISCREPANT')} style={styles.iconImageSmall} />
        <Text style={[styles.textBody2, styles.discrepant]}>Discrepant</Text>
      </View>
      <View style={styles.iconTextContainer}>
        <Image src={reportStatusIconMapper('INSUFFICIENT')} style={styles.iconImageSmall} />
        <Text style={[styles.textBody2, styles.insufficient]}>Attention Required / Insufficient</Text>
      </View>
      <View style={styles.iconTextContainer}>
        <Image src={reportStatusIconMapper('NO_RESPONSE')} style={styles.iconImageSmall} />
        <Text style={[styles.textBody2, styles.noResponse]}>No Response Received</Text>
      </View>
    </View>
  );
};

export interface CoverPageProps {
  reportDataObject: any;
}
export const CoverPage = (props: CoverPageProps) => {
  const { reportDataObject } = props;

  return (
    <Page size="A4">
      <View style={{ width: '100%', height: '100%' }}>
        <Image
          src={coverPageBg}
          style={{
            width: '100%',
            height: '100vh',
            position: 'absolute',
            objectFit: 'cover',
            zIndex: '-10',
          }}
        />
        {/* Logo and report title section */}
        <View
          style={{
            position: 'absolute',
            top: 110,
            flexDirection: 'column',
            gap: 18,
            padding: '0 48px',
          }}>
          <Image src={verifyInWhite} style={{ width: '194px', height: '55px' }} />
          <Image src={reportCoverTitle} style={{ width: 'auto', height: '120px' }} />
        </View>
        {/*  user details Section */}
        <View
          style={{
            position: 'absolute',
            bottom: 201,
            flexDirection: 'column',
            gap: 18,
            padding: '30px 25px',
            backgroundColor: 'rgba(0,0,0,0.36)',
          }}>
          {/* profile and address section */}
          <View style={styles.profileSection}>
            <View style={{ width: '12%' }}>
              <Image src={reportDataObject.basic_detail.profile_image} style={styles.profileImageLarge} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameSection}>
                <View style={{ gap: 4 }}>
                  <Text style={[styles.textHeadLine3, styles.textLight]}>{reportDataObject.basic_detail.name}</Text>
                  <View style={styles.contactDetails}>
                    <View style={styles.iconTextContainer}>
                      <Image src={phoneIcon} style={styles.iconImageSmall} />
                      <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.basic_detail.mobile}</Text>
                    </View>
                    <View style={styles.iconTextContainer}>
                      <Image src={emailIcon} style={styles.iconImageSmall} />
                      <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.basic_detail.email}</Text>
                    </View>
                  </View>
                </View>
                <Image src={reportStatusMapper(reportDataObject.overall_status.status)} style={[styles.pillImage]} />
              </View>
              {reportDataObject.basic_detail.address !== '-' && (
                <View style={[styles.iconTextContainer, { marginTop: 6 }]}>
                  <Image src={addressIcon} style={styles.iconImageSmall} />
                  <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.basic_detail.address}</Text>
                </View>
              )}
            </View>
          </View>
          {/* order detail section */}
          <View style={[styles.orderSection, { marginLeft: '13%' }]}>
            <View style={styles.orderColumn}>
              <Text style={[styles.textBody2, styles.textLight]}>Initiated on</Text>
              <Text style={[styles.textSubHeading2, styles.textLight]}>
                {dayjs(reportDataObject.request.initiated_on).format('DD-MM-YYYY')}
              </Text>
            </View>
            <View style={styles.orderColumn}>
              <Text style={[styles.textBody2, styles.textLight]}>Initiated by</Text>
              <View style={styles.iconTextContainer}>
                <Image src={reportDataObject.request.initiated_by.profile_image} style={styles.profileImageSmall} />
                <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.request.initiated_by.name}</Text>
              </View>
            </View>
            <View style={styles.orderColumn}>
              <Text style={[styles.textBody2, styles.textLight]}>Verified by</Text>
              <View style={styles.iconTextContainer}>
                <Image src={reportDataObject.request.verified_by.profile_image} style={styles.profileImageSmall} />
                <Text style={[styles.textBody3, styles.textLight]}>{reportDataObject.request.verified_by.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
};

export interface InstructionPageProps {
  reportDataObject: any;
}
export const InstructionPage = (props: InstructionPageProps) => {
  const { reportDataObject } = props;

  return (
    <Page size="A4" wrap style={styles.page}>
      {/* header section */}
      <ReportHeader reportDataObject={reportDataObject} />
      {/* Main Section */}
      <View style={styles.mainSectionContainer}>
        {/* User Detail Section */}
        <UserDetailContainer reportDataObject={reportDataObject} />
        {/* check Status section menu */}
        <Text style={(styles.textHeadLine2, { marginTop: 4 })}>Definition of Results & Color codes:</Text>
        {/* Menu List Container */}
        <View style={styles.stackColumnContainer}>
          {/* CLEAR */}
          <View style={[styles.instructionContainer, { borderLeft: `27px solid #048218` }]} wrap={false}>
            <Text style={styles.textSubHeading1}>Clear</Text>
            <Text style={[styles.textBody2, styles.textSecondary]}>
              There is no disparity between stated and verified antecedents or the difference is considered
              non-significant and treated as Clear.
            </Text>
          </View>
          {/* DISCREPANT */}
          <View style={[styles.instructionContainer, { borderLeft: '27px solid #D94415' }]} wrap={false}>
            <Text style={styles.textSubHeading1}>Discrepant</Text>
            <Text style={[styles.textBody2, styles.textSecondary]}>
              Source of verification is fake or the major mismatch in the verification remarks or produced fake
              documents.
            </Text>
          </View>
          {/* Attention required / Insufficient */}
          <View style={[styles.instructionContainer, { borderLeft: '27px solid #EE6E12' }]} wrap={false}>
            <Text style={styles.textSubHeading1}>Attention Required / Insufficient</Text>
            <Text style={[styles.textBody2, styles.textSecondary]}>
              Source of verification have provided partial information, hence verification could not be conducted, where
              there is no records available.{'\n'} or{'\n'} Verification could not be completed due to absence of
              mandatory data or document.
            </Text>
          </View>
          {/* No response received */}
          <View style={[styles.instructionContainer, { borderLeft: '27px solid #55505A' }]} wrap={false}>
            <Text style={styles.textSubHeading1}>No Response Received</Text>
            <Text style={[styles.textBody2, styles.textSecondary]}>
              Verification could not be completed as the response from the verification source has not been received
              till the date of report generation.
            </Text>
          </View>
        </View>
      </View>
      {/* footer section */}
      <ReportFooter reportDataObject={reportDataObject} />
    </Page>
  );
};

export interface IndividualCheckDetailsProps {
  checkData: any;
  subCheckData: any;
}

export const IndividualCheckDetails = (props: IndividualCheckDetailsProps) => {
  const { checkData, subCheckData } = props;
  return (
    <View style={styles.mainSectionContainer}>
      {/* individual check Summary - fixed section */}
      <IndividualCheckSummary checkData={checkData} subCheckData={subCheckData} />
      {/* individual check table - breakable section */}
      {subCheckData.details.length > 0 && <IndividualCheckTable subCheckData={subCheckData} />}
      {/* individual check meta - fixed section */}
      {<IndividualCheckMeta subCheckData={subCheckData} />}
      {/* Individual Checks Documents */}
      {<IndividualCheckDocuments checkData={checkData} subCheckData={subCheckData} />}
    </View>
  );
};

export interface MenuPageProps {
  reportDataObject: any;
}

export const MenuPage = (props: MenuPageProps) => {
  const { reportDataObject } = props;

  return (
    <Page size="A4" wrap style={[styles.page, { paddingBottom: 100 }]}>
      {/* header section */}
      <ReportHeader reportDataObject={reportDataObject} />
      {/* Main Section */}
      <View style={styles.mainSectionContainer}>
        {/* User Detail Section */}
        <UserDetailContainer reportDataObject={reportDataObject} />
        {/* check Status section menu */}
        <Text style={(styles.textHeadLine2, { marginTop: 4 })}>Check Status</Text>
        {/* Menu List Container */}
        <View style={[styles.stackColumnContainer]}>
          {/* TODO: Replace with API data later */}
          {reportDataObject.reports.map((data: any) => (
            <Link
              src={`#${data.first_subcheck_id}`}
              style={{
                textDecoration: 'none',
                fontWeight: 'normal',
                color: '#000',
              }}>
              <CheckMenuList  menu={data} />
            </Link>
          ))}
        </View>
      </View>
      {/* Watermark */}
      <Watermark checkStatus={reportDataObject.overall_status.status} />
      {/* footer section */}
      <ReportFooter renderCheckLegend={true} reportDataObject={reportDataObject} />
    </Page>
  );
};

export interface ReportFooterProps {
  renderCheckLegend?: boolean;
  reportDataObject: any;
}

export const ReportFooter = (props: ReportFooterProps) => {
  const { renderCheckLegend = false, reportDataObject } = props;

  return (
    <View fixed style={styles.footer}>
      {renderCheckLegend && <CheckColorLegend />}
      <View style={styles.pageContainer}>
        <Text style={[styles.textBody3, styles.textSecondary]}>
          Confidential report {reportDataObject.report_details.report_version}
        </Text>
        <Text
          style={[styles.textBody3, styles.textSecondary]}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
        <Text style={[styles.textBody3, styles.textSecondary]}>CIN : {reportDataObject.report_details.cin}</Text>
      </View>
      <View style={styles.captionContainer}>
        <View style={styles.captionSection}>
          <Text style={[styles.textBody3, styles.textSecondary]}>{reportDataObject.report_details.copy_right}</Text>
          <Image src={giginLogo} style={styles.captionImage} />
          <Text style={[styles.textBody3, styles.textSecondary]}>
            {reportDataObject.report_details.year} {reportDataObject.report_details.verdor_company_info}
          </Text>
        </View>
        <View style={styles.supportSection}>
          <Text style={[styles.textBody3, styles.textSecondary]}>For support contact</Text>
          <Text style={[styles.textBody3, styles.textLink]}>{reportDataObject.report_details.contact_email}</Text>
        </View>
      </View>
    </View>
  );
};

export interface ReportHeaderProps {
  reportDataObject: any;
}

export const ReportHeader = (props: ReportHeaderProps) => {
  const { reportDataObject } = props;
  return (
    <View fixed style={styles.header}>
      <View style={styles.logoContainer}>
        <Image src={verifyInDark} style={styles.logoImage} />
        <Text style={styles.textBody3}>{reportDataObject.report_details.title}</Text>
      </View>
      <View style={styles.candidateContainer}>
        <Image src={reportDataObject.basic_detail.profile_image} style={styles.profileImageSmall} />
        <View style={styles.candidateDetails}>
          <Text style={styles.textSubHeading3}>{reportDataObject.basic_detail.name}</Text>
          <Text style={[styles.textBody3, styles.textSecondary]}>{reportDataObject.basic_detail.case_id}</Text>
        </View>
      </View>
    </View>
  );
};

export interface WatermarkProps {
  checkStatus: string;
}

export const Watermark = (props: WatermarkProps) => {
  const { checkStatus } = props;
  const [isRotated, setIsRotated] = useState(checkStatus.toLowerCase() === 'inprogress');

  //   Rerender when prop checkStatus changes
  useMemo(() => {
    setIsRotated(checkStatus.toLowerCase() === 'inprogress');
  }, [checkStatus]);

  return (
    <View style={isRotated ? styles.watermarkRotatedContainer : styles.watermarkContainer} fixed>
      {isRotated && <Text style={styles.watermarkText}>QC PENDING</Text>}
      {!isRotated && <Image src={checkCompletedWatermark} style={styles.watermarkImage} />}
    </View>
  );
};

export interface PDFDocumentProps {
  reportDataObject: any;
}

export const PDFDocument = (props: any) => {
  const reportDataObject = props.data;
  return (
    <Document>
      {/* Cover Page */}
      <CoverPage reportDataObject={reportDataObject} />
      {/* Instruction Page */}
      <InstructionPage reportDataObject={reportDataObject} />
      {/* Menu Page */}
      <MenuPage reportDataObject={reportDataObject} />
      {/* Individual Checks Details Pages. Each Check is having its subcheck */}
      {reportDataObject.reports.map((check: any) =>
        check.documentlist.map((subcheck: any) => (
          <Page size="A4" style={styles.page} key={check.check_id} wrap>
            {/* Header */}
            <ReportHeader reportDataObject={reportDataObject} />
            {/* Individual Subchecks */}
            <IndividualCheckDetails checkData={check} subCheckData={subcheck}  />
            {/* Watermark */}
            <Watermark checkStatus={reportDataObject.overall_status.status} />
            {/* Footer */}
            <ReportFooter reportDataObject={reportDataObject} />
          </Page>
        )),
      )}

      {/* Disclaimer Page */}
      <DisclaimerPage reportDataObject={reportDataObject} />
    </Document>
  );
};

// const PDF = ({ data }: PDFProps) => {
//     return (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <View style={styles.section}>
//             <View style={styles.columnParent}>
//               <View style={styles.columnStart}>
//                 <Text style={styles.heading}>{data.companyName}</Text>
//                 <Text style={styles.paragraph}>{data.companyPhone}</Text>
//                 <Text style={styles.paragraph}>{data.companyEmail}</Text>
//               </View>
//               <View style={styles.columnEnd}>
//                 <Text style={styles.heading}>Receipt</Text>
//                 <Text style={styles.paragraph}>Receipt number: {data.receiptNumber}</Text>
//                 <Text style={styles.paragraph}>Date paid: {data.datePaid}</Text>
//                 <Text style={styles.paragraph}>Payment method: {data.paymentMethod}</Text>
//               </View>
//             </View>
//             <View style={styles.divider}></View>
//             <View>
//               <Text style={styles.statement}>{`${data.amount} paid on ${data.datePaid}`}</Text>
//               <Text style={styles.paragraph}>Thank you for your business!</Text>
//             </View>
//           </View>
//         </Page>
//       </Document>
//     );
//   };

export default async (data: any) => {
  return await ReactPDF.renderToFile(<PDFDocument {...{ data }} />,"./report.pdf");
};
