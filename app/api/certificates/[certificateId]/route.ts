
import { NextRequest, NextResponse } from "next/server";
import {
  PDFDocument,
  rgb,
  StandardFonts,
  PDFFont,
  PDFPage,
} from "pdf-lib";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth";
import { getCertificatesCollection } from "@/lib/certificates";

export const runtime = "nodejs";

// =========================================================
// TYPES
// =========================================================

type CertificateDocument = {
  _id: ObjectId;
  certificateId?: string;
  userId?: string;
  studentId?: string;
  studentName?: string;
  courseName?: string;
  instructorName?: string;
  instructorDesignation?: string;
  courseDuration?: number | string;
  duration?: number | string;
  status?: string;
  issueDate?: Date | string;
  createdAt?: Date | string;
  [key: string]: unknown;
};

// =========================================================
// PAGE
// =========================================================

const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;

// =========================================================
// PREMIUM COLOR THEME
// =========================================================
//
// No background color.
// certificate-bg.png is the actual certificate background.
//
// Theme:
// Deep Navy
// Royal Purple
// Champagne Gold
// Soft Slate
//
// =========================================================

const COLORS = {
  navy: rgb(0.075, 0.09, 0.16), // #13172A
  navySoft: rgb(0.15, 0.17, 0.24),
  red: rgb(179 / 255, 8 / 255, 8 / 255),

  purple: rgb(0.38, 0.20, 0.62), // Royal Purple
  purpleSoft: rgb(0.52, 0.39, 0.67),

  gold: rgb(0.72, 0.55, 0.25), // Champagne Gold
  goldSoft: rgb(0.80, 0.68, 0.43),

  text: rgb(0.12, 0.12, 0.16),
  muted: rgb(0.38, 0.38, 0.43),

  white: rgb(1, 1, 1),
};

// =========================================================
// HELPERS
// =========================================================

function safeText(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

// =========================================================
// DATE FORMAT
// =========================================================

function formatDate(value: unknown): string {
  const fallbackDate = new Date();

  if (!value) {
    return fallbackDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const date = new Date(value as string | number | Date);

  if (Number.isNaN(date.getTime())) {
    return fallbackDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// =========================================================
// DURATION FORMAT
// =========================================================

function formatDuration(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    if (numericValue <= 0) {
      return "N/A";
    }

    // Values below 1000 are treated as hours.
    if (numericValue < 1000) {
      return `${numericValue} Hours`;
    }

    // Larger values are treated as seconds.
    const hours = numericValue / 3600;

    if (hours >= 1) {
      return `${Math.round(hours)} Hours`;
    }
  }

  return String(value);
}

// =========================================================
// CENTERED TEXT
// =========================================================

function drawCenteredText(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  centerX: number,
  y: number,
  color = COLORS.text
) {
  const textWidth = font.widthOfTextAtSize(text, size);

  page.drawText(text, {
    x: centerX - textWidth / 2,
    y,
    size,
    font,
    color,
  });
}

// =========================================================
// GET ROUTE
// =========================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      certificateId: string;
    }>;
  }
) {
  try {
    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // PARAMS
    // =====================================================

    const { certificateId } = await context.params;

    if (!certificateId) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // DATABASE
    // =====================================================

    const certificatesCollection =
      await getCertificatesCollection();

    let certificate: CertificateDocument | null = null;

    // First try MongoDB ObjectId.
    if (ObjectId.isValid(certificateId)) {
      certificate =
        (await certificatesCollection.findOne({
          _id: new ObjectId(certificateId),
        })) as CertificateDocument | null;
    }

    // If not found by _id, try certificateId field.
    if (!certificate) {
      certificate =
        (await certificatesCollection.findOne({
          certificateId,
        })) as CertificateDocument | null;
    }

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // OWNERSHIP CHECK
    // =====================================================

    const currentUserId = safeText(
      (
        user as unknown as {
          _id?: unknown;
          id?: unknown;
        }
      )._id ??
      (
        user as unknown as {
          id?: unknown;
        }
      ).id
    );

    const certificateUserId = safeText(
      certificate.userId ?? certificate.studentId
    );

    const userRole = safeText(
      (
        user as unknown as {
          role?: unknown;
        }
      ).role
    ).toLowerCase();

    const isAdmin =
      userRole === "admin" ||
      userRole === "superadmin";

    // Admin can access any certificate.
    // Normal users can only access their own certificate.
    if (
      !isAdmin &&
      certificateUserId &&
      currentUserId
    ) {
      if (certificateUserId !== currentUserId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You are not allowed to access this certificate.",
          },
          {
            status: 403,
          }
        );
      }
    }

    // =====================================================
    // CREATE PDF
    // =====================================================

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

    // =====================================================
    // FONTS
    // =====================================================

    const regularFont =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    const boldFont =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    const italicFont =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaOblique
      );

    // =====================================================
    // CERTIFICATE BACKGROUND
    // =====================================================
    //
    // IMPORTANT:
    //
    // There is NO background color.
    //
    // certificate-bg.png itself is the complete
    // certificate background.
    //
    // We use CONTAIN instead of COVER so the
    // original background is not cropped.
    //
    // =====================================================

    try {
      const backgroundUrl = new URL(
        "/certificate-bg.png",
        request.url
      );

      const backgroundResponse =
        await fetch(backgroundUrl);

      if (backgroundResponse.ok) {
        const backgroundBytes =
          await backgroundResponse.arrayBuffer();

        const backgroundImage =
          await pdfDoc.embedPng(
            backgroundBytes
          );

        const scaleX =
          PAGE_WIDTH /
          backgroundImage.width;

        const scaleY =
          PAGE_HEIGHT /
          backgroundImage.height;

        const scale = Math.min(
          scaleX,
          scaleY
        );

        const imageWidth =
          backgroundImage.width * scale;

        const imageHeight =
          backgroundImage.height * scale;

        page.drawImage(
          backgroundImage,
          {
            x:
              (PAGE_WIDTH -
                imageWidth) /
              2,

            y:
              (PAGE_HEIGHT -
                imageHeight) /
              2,

            width: imageWidth,
            height: imageHeight,

            opacity: 1,
          }
        );
      } else {
        console.warn(
          "certificate-bg.png was not found."
        );
      }
    } catch (error) {
      console.warn(
        "Certificate background image could not be loaded:",
        error
      );
    }

    // =====================================================
    // NO OUTSIDE BORDER
    // =====================================================
    //
    // IMPORTANT:
    // The border/design already exists inside
    // certificate-bg.png.
    //
    // Therefore NOTHING is drawn here.
    //
    // =====================================================

    // =====================================================
    // LOGO
    // =====================================================
    //
    // Original logo colors are preserved.
    //
    // =====================================================

    try {
      const logoUrl = new URL(
        "/logo.png",
        request.url
      );

      const logoResponse =
        await fetch(logoUrl);

      if (logoResponse.ok) {
        const logoBytes =
          await logoResponse.arrayBuffer();

        const logoImage =
          await pdfDoc.embedPng(
            logoBytes
          );

        const maxLogoWidth = 72;
        const maxLogoHeight = 72;

        const logoScale =
          Math.min(
            maxLogoWidth /
            logoImage.width,
            maxLogoHeight /
            logoImage.height
          );

        const logoWidth =
          logoImage.width *
          logoScale;

        const logoHeight =
          logoImage.height *
          logoScale;

        page.drawImage(
          logoImage,
          {
            x: 680,
            y: PAGE_HEIGHT - 108,
            width: logoWidth,
            height: logoHeight,
            opacity: 1,
          }
        );
      }
    } catch (error) {
      console.warn(
        "Logo could not be loaded:",
        error
      );
    }

    // =====================================================
    // HEADER
    // =====================================================

    drawCenteredText(
      page,
      "NEXT LEVEL SCHOOL",
      boldFont,
      22,
      PAGE_WIDTH / 2,
      528,
      COLORS.navy
    );

    drawCenteredText(
      page,
      "IT INSTITUTE",
      boldFont,
      10,
      PAGE_WIDTH / 2,
      510,
      COLORS.purple
    );

    // Elegant gold accent line
    page.drawLine({
      start: {
        x: 318,
        y: 496,
      },
      end: {
        x: 524,
        y: 496,
      },
      thickness: 1.15,
      color: COLORS.gold,
    });

    // =====================================================
    // CERTIFICATE TITLE
    // =====================================================

    drawCenteredText(
      page,
      "CERTIFICATE OF COMPLETION",
      boldFont,
      27,
      PAGE_WIDTH / 2,
      454,
      COLORS.navy,
    );

    drawCenteredText(
      page,
      "This Certificate is proudly presented to",
      italicFont,
      11,
      PAGE_WIDTH / 2,
      426,
      COLORS.muted
    );

    // =====================================================
    // STUDENT NAME
    // =====================================================

    const studentName = safeText(
      certificate.studentName,
      "Student Name"
    ).toUpperCase();

    drawCenteredText(
      page,
      studentName,
      boldFont,
      25,
      PAGE_WIDTH / 2,
      385,
      COLORS.purple
    );

    const studentNameWidth =
      boldFont.widthOfTextAtSize(
        studentName,
        25
      );

    const studentUnderlineWidth =
      Math.min(
        studentNameWidth / 2,
        230
      );

    page.drawLine({
      start: {
        x:
          PAGE_WIDTH / 2 -
          studentUnderlineWidth,
        y: 375,
      },

      end: {
        x:
          PAGE_WIDTH / 2 +
          studentUnderlineWidth,
        y: 375,
      },

      thickness: 0.85,
      color: COLORS.gold,
    });

    // =====================================================
    // COURSE DESCRIPTION
    // =====================================================

    drawCenteredText(
      page,
      "for successfully completing the",
      regularFont,
      10.5,
      PAGE_WIDTH / 2,
      349,
      COLORS.muted
    );

    // =====================================================
    // COURSE NAME
    // =====================================================

    const courseName = safeText(
      certificate.courseName,
      "Course Name"
    ).toUpperCase();

    let courseFontSize = 18;

    if (
      boldFont.widthOfTextAtSize(
        courseName,
        courseFontSize
      ) > 610
    ) {
      courseFontSize = 15;
    }

    if (
      boldFont.widthOfTextAtSize(
        courseName,
        courseFontSize
      ) > 610
    ) {
      courseFontSize = 13;
    }

    drawCenteredText(
      page,
      courseName,
      boldFont,
      courseFontSize,
      PAGE_WIDTH / 2,
      320,
      COLORS.navy
    );

    // =====================================================
    // COURSE ACHIEVEMENT
    // =====================================================

    drawCenteredText(
      page,
      "COURSE ACHIEVEMENT",
      boldFont,
      10,
      PAGE_WIDTH / 2,
      288,
      COLORS.gold
    );

    drawCenteredText(
      page,
      "Successfully completed the required course curriculum",
      regularFont,
      9.5,
      PAGE_WIDTH / 2,
      270,
      COLORS.muted
    );

    drawCenteredText(
      page,
      "and demonstrated commitment to practical skill development.",
      regularFont,
      9.5,
      PAGE_WIDTH / 2,
      255,
      COLORS.muted
    );

    // =====================================================
    // COURSE DETAILS
    // =====================================================

    const cardY = 203;
    const cardHeight = 42;
    const cardWidth = 170;
    const cardGap = 14;

    const totalCardsWidth =
      cardWidth * 3 +
      cardGap * 2;

    const cardsStartX =
      (PAGE_WIDTH -
        totalCardsWidth) /
      2;

    const duration =
      formatDuration(
        certificate.courseDuration ??
        certificate.duration
      );

    const certificateNumber =
      safeText(
        certificate.certificateId,
        certificate._id?.toString() ??
        certificateId
      );

    const issueDate =
      formatDate(
        certificate.issueDate ??
        certificate.createdAt
      );

    const cards = [
      {
        label: "COURSE DURATION",
        value: duration,
        accent: COLORS.purple,
      },

      {
        label: "COURSE STATUS",
        value: "SUCCESSFULLY COMPLETED",
        accent: COLORS.gold,
      },

      {
        label: "ISSUE DATE",
        value: issueDate,
        accent: COLORS.navy,
      },
    ];

    cards.forEach(
      (card, index) => {
        const x =
          cardsStartX +
          index *
          (cardWidth + cardGap);

        // Transparent card.
        // No fill color.
        page.drawRectangle({
          x,
          y: cardY,
          width: cardWidth,
          height: cardHeight,
          borderColor: card.accent,
          borderWidth: 0.75,
        });

        drawCenteredText(
          page,
          card.label,
          boldFont,
          6.8,
          x + cardWidth / 2,
          cardY + 27,
          card.accent
        );

        let valueFontSize = 8.5;

        if (
          boldFont.widthOfTextAtSize(
            card.value,
            valueFontSize
          ) >
          cardWidth - 12
        ) {
          valueFontSize = 7;
        }

        drawCenteredText(
          page,
          card.value,
          boldFont,
          valueFontSize,
          x + cardWidth / 2,
          cardY + 11,
          COLORS.text
        );
      }
    );

    // =====================================================
    // CERTIFICATE ID
    // =====================================================

    drawCenteredText(
      page,
      `Certificate ID: ${certificateNumber}`,
      regularFont,
      7.5,
      PAGE_WIDTH / 2,
      178,
      COLORS.purpleSoft
    );

    // =====================================================
    // SIGNATURE SECTION
    // =====================================================

    const signatureY = 91;

    // =====================================================
    // LEFT - INSTRUCTOR
    // =====================================================

    const leftSignatureCenter = 225;

    // Label directly above signature line
    drawCenteredText(
      page,
      "INSTRUCTOR",
      boldFont,
      8,
      leftSignatureCenter,
      signatureY + 14,
      COLORS.purple
    );

    page.drawLine({
      start: {
        x:
          leftSignatureCenter - 72,
        y: signatureY,
      },

      end: {
        x:
          leftSignatureCenter + 72,
        y: signatureY,
      },

      thickness: 0.75,
      color: COLORS.purple,
    });

    const instructorName =
      safeText(
        certificate.instructorName,
        "Md Towhidul Islam"
      );

    const instructorDesignation =
      safeText(
        certificate.instructorDesignation,
        "ICT Instructor"
      );

    drawCenteredText(
      page,
      instructorName,
      boldFont,
      9,
      leftSignatureCenter,
      77,
      COLORS.text
    );

    drawCenteredText(
      page,
      instructorDesignation,
      regularFont,
      7.5,
      leftSignatureCenter,
      64,
      COLORS.muted
    );

    // =====================================================
    // RIGHT - AUTHORIZED SIGNATURE
    // =====================================================

    const rightSignatureCenter = 617;

    // Heading
    drawCenteredText(
      page,
      "",
      boldFont,
      8,
      rightSignatureCenter,
      132,
      COLORS.gold
    );

    // =====================================================
    // AUTHORIZED SIGNATURE IMAGE
    // =====================================================

    try {
      const signatureUrl =
        new URL(
          "/authorized-signature.png",
          request.url
        );

      const signatureResponse =
        await fetch(signatureUrl);

      if (signatureResponse.ok) {
        const signatureBytes =
          await signatureResponse.arrayBuffer();

        const signatureImage =
          await pdfDoc.embedPng(
            signatureBytes
          );

        const maxSignatureWidth = 125;
        const maxSignatureHeight = 24;

        const signatureScale =
          Math.min(
            maxSignatureWidth /
            signatureImage.width,
            maxSignatureHeight /
            signatureImage.height
          );

        const signatureWidth =
          signatureImage.width *
          signatureScale;

        const signatureHeight =
          signatureImage.height *
          signatureScale;

        page.drawImage(
          signatureImage,
          {
            x:
              rightSignatureCenter -
              signatureWidth / 2,

            y: signatureY + 5,

            width: signatureWidth,
            height: signatureHeight,

            opacity: 1,
          }
        );
      } else {
        console.warn(
          "authorized-signature.png was not found."
        );
      }
    } catch (error) {
      console.warn(
        "Authorized signature image could not be loaded:",
        error
      );
    }

    // =====================================================
    // AUTHORIZED SIGNATURE LINE
    // =====================================================

    page.drawLine({
      start: {
        x:
          rightSignatureCenter - 72,
        y: signatureY,
      },

      end: {
        x:
          rightSignatureCenter + 72,
        y: signatureY,
      },

      thickness: 0.75,
      color: COLORS.gold,
    });

    // =====================================================
    // AUTHORIZED SIGNATORY NAME
    // =====================================================

    drawCenteredText(
      page,
      "Engr. Md Towhidul Islam",
      boldFont,
      9,
      rightSignatureCenter,
      77,
      COLORS.text
    );

    drawCenteredText(
      page,
      "Authorized Signatory",
      regularFont,
      7.5,
      rightSignatureCenter,
      64,
      COLORS.muted
    );

    // =====================================================
    // FOOTER
    // =====================================================

    drawCenteredText(
      page,
      "NEXT LEVEL SCHOOL IT INSTITUTE",
      boldFont,
      7.5,
      PAGE_WIDTH / 2,
      54,
      COLORS.navySoft
    );

    drawCenteredText(
      page,
      "Build Skills. Build Your Future.",
      italicFont,
      7,
      PAGE_WIDTH / 2,
      45,
      COLORS.gold
    );

    // =====================================================
    // SAVE PDF
    // =====================================================

    const pdfBytes =
      await pdfDoc.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",

        // Direct download
        "Content-Disposition": `attachment; filename="certificate-${certificateNumber}.pdf"`,

        "Content-Length": pdfBuffer.length.toString(),

        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error(
      "Certificate PDF generation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to generate certificate PDF.",
      },
      {
        status: 500,
      }
    );
  }
}

